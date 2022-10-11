import { useCallback, useSyncExternalStore } from 'react'

import { Store, Selector, Setter } from '../types'

export function useStoreSelector<T>(form: Store<T>, selector: Selector<T>): [any, Setter<T>, Store<T>] {
	const data = useSyncExternalStore(
		form.subscribe,
		useCallback(() => {
			return form.getData(selector)
		}, [form, selector]),
		() => form.getData(selector),
	)

	return [data, form.setData, form]
}
