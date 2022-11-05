import { identity } from 'ramda'

import { Args, Store, List } from './types'

export function createList<T, K>(store: Store<T>, id: CallableFunction = identity): List<K> {
	const emptyList: K[] = []

	function getItems(): K[] {
		return store.getData() ?? emptyList
	}

	function setItems(list: K[]) {
		store.setData(list)
	}

	function addItem(item: K) {
		store.setData((list: K[]) => [...list, item])
	}

	function updateItem(item: K, ...args: Args<K>) {
		const index = getItems().findIndex((i) => id(i) === id(item))

		store.setData(index, ...args)
	}

	function removeItem(item: K) {
		store.setData((list: K[]) => {
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
