import { Args, Form, List } from '../types'
import { identity } from 'ramda'
import { useRef, useSyncExternalStore } from 'react'
import { createList } from '../create-list'

export function useFormList<T, K>(
	form: Form<T>,
	id: CallableFunction = identity,
): [
	K[],
	{
		onAddItem: (item: K) => void
		onRemoveItem: (item: K) => void
		onEditItem: (item: K, ...args: Args<K>) => void
		onSetItems: (items: K[]) => void
	},
	List<K>,
] {
	const { current: list } = useRef(createList<T, K>(form, id))
	const items = useSyncExternalStore(form.subscribe, list.getList)

	return [
		items,
		{
			onAddItem: list.onAddListItem,
			onEditItem: list.onEditListItem,
			onRemoveItem: list.onRemoveListItem,
			onSetItems: list.setList,
		},
		list,
	]
}
