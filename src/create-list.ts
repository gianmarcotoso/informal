import { identity } from 'ramda'

import { Args, Form, List } from './types'

export function createList<T, K>(form: Form<T>, id: CallableFunction = identity): List<K> {
	const emptyList: K[] = []

	function getList(): K[] {
		return form.getData() ?? emptyList
	}

	function setList(list: K[]) {
		form.setData(list)
	}

	function addItem(item: K) {
		form.setData((list: K[]) => [...list, item])
	}

	function updateItem(item: K, ...args: Args<K>) {
		const index = getList().findIndex((i) => id(i) === id(item))

		form.setData(index, ...args)
	}

	function removeItem(item: K) {
		form.setData((list: K[]) => {
			return list.filter((x) => id(x) !== id(item))
		})
	}

	return {
		getList,
		setList,
		addItem,
		updateItem,
		removeItem,
	}
}
