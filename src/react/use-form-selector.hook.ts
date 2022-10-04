import { useCallback, useSyncExternalStore } from 'react'

import { Form, Selector, Setter } from '../types'

export function useFormSelector<T>(form: Form<T>, selector: Selector<T>): [any, Setter<T>, Form<T>] {
	const data = useSyncExternalStore(
		form.subscribe,
		useCallback(() => {
			return form.getData(selector)
		}, [form, selector]),
	)

	return [data, form.setData, form]
}
