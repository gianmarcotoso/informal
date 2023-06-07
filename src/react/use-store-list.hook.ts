import { Args, Store, List, StoreBaseType } from '../types'
import { identity } from 'ramda'
import { useRef, useSyncExternalStore } from 'react'
import { createList } from '../create-list'

export function useStoreList<K extends StoreBaseType, T extends StoreBaseType = any>(
	store: Store<T>,
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
	const { current: list } = useRef(createList<K, T>(store, id))
	const items = useSyncExternalStore(store.subscribe, list.getItems, list.getItems)

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
