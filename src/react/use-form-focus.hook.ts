import { useRef, useSyncExternalStore } from 'react'
import { createFocus } from '../create-focus'
import { Form, PathElement, Setter } from '../types'

export function useFormFocus<T, K>(form: Form<T>, ...path: PathElement[]): [K, Setter<K>, Form<K>] {
	const { current: focus } = useRef(createFocus<T, K>(form, ...path))
	const data = useSyncExternalStore(focus.subscribe, focus.getData)

	return [data, focus.setData, focus]
}
