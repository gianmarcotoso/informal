import { Args, Store, List } from '../types'
import { identity } from 'ramda'
import { useRef, useSyncExternalStore } from 'react'
import { createList } from '../create-list'

export function useStoreList<T, K>(
	form: Store<T>,
	id: CallableFunction = identity,
): [
	K[],
	{
		addItem: (item: K) => void
		removeItem: (item: K) => void
		updateItem: (item: K, ...args: Args<K>) => void
		setItems: (items: K[]) => void
	},
	List<K>,
] {
	const { current: list } = useRef(createList<T, K>(form, id))
	const items = useSyncExternalStore(form.subscribe, list.getItems, list.getItems)

	return [
		items,
		{
			addItem: list.addItem,
			updateItem: list.updateItem,
			removeItem: list.removeItem,
			setItems: list.setItems,
		},
		list,
	]
}
