import { identity } from 'ramda'

import { Args, Store, List } from './types'

export function createList<T, K>(form: Store<T>, id: CallableFunction = identity): List<K> {
	const emptyList: K[] = []

	function getItems(): K[] {
		return form.getData() ?? emptyList
	}

	function setItems(list: K[]) {
		form.setData(list)
	}

	function addItem(item: K) {
		form.setData((list: K[]) => [...list, item])
	}

	function updateItem(item: K, ...args: Args<K>) {
		const index = getItems().findIndex((i) => id(i) === id(item))

		form.setData(index, ...args)
	}

	function removeItem(item: K) {
		form.setData((list: K[]) => {
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
