import { identity } from 'ramda'

import { Args, Store, List, StoreBaseType } from './types'

export function createList<K, T extends StoreBaseType = any>(
	store: Store<T>,
	id: CallableFunction = identity,
): List<K> {
	const emptyList: K[] = []

	const storeSetData = store.setData as (...args: any[]) => void

	function getItems(): K[] {
		return store.getData() ?? emptyList
	}

	function setItems(list: K[]) {
		storeSetData(list)
	}

	function addItem(item: K) {
		storeSetData((list: K[]) => [...list, item])
	}

	function updateItem(item: K, ...args: Args<K>) {
		const index = getItems().findIndex((i) => id(i) === id(item))

		storeSetData(index, ...args)
	}

	function removeItem(item: K) {
		storeSetData((list: K[]) => {
			return list.filter((x) => id(x) !== id(item))
		})
	}

	return {
		getItems: getItems,
		setItems: setItems,
		addItem,
		updateItem,
		removeItem,
	}
}
