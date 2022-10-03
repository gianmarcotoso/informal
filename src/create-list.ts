import { identity } from 'ramda'

import { createFocus } from './create-focus'
import { Args, Form, List, PathElement } from './types'

export function createList<T, K>(focus: Form<T>, id: CallableFunction = identity): List<K> {
	function getList(): K[] {
		return focus.getData()
	}

	function setList(list: K[]) {
		focus.setData(list)
	}

	function onAddListItem(item: K) {
		focus.setData((list: K[]) => [...list, item])
	}

	function onEditListItem(item: K, ...args: Args<K>) {
		const index = getList().findIndex((i) => id(i) === id(item))

		focus.setData(index, ...args)
	}

	function onRemoveListItem(item: K) {
		focus.setData((list: K[]) => {
			return list.filter((x) => id(x) !== id(item))
		})
	}

	return {
		getList,
		setList,
		onAddListItem,
		onEditListItem,
		onRemoveListItem,
	}
}
