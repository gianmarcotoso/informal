import { useMemo, useSyncExternalStore } from 'react'
import { createFocus } from '../create-focus'
import { Store, PathElement, Setter } from '../types'

export function useStoreFocus<T, K>(form: Store<T>, ...path: PathElement[]): [K, Setter<K>, Store<K>] {
	const focus = useMemo(() => createFocus<T, K>(form, ...path), [form, path])
	const data = useSyncExternalStore(focus.subscribe, focus.getData, focus.getData)

	return [data, focus.setData, focus]
}
