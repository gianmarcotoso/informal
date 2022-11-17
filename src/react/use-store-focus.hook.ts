import { useRef, useSyncExternalStore } from 'react'
import { createFocus } from '../create-focus'
import { Store, PathElement, Setter } from '../types'

export function useStoreFocus<T, K>(store: Store<T>, ...path: PathElement[]): [K, Setter<K>, Store<K>] {
	const { current: focus } = useRef(createFocus<T, K>(store, ...path))
	const data = useSyncExternalStore(focus.subscribe, focus.getData, focus.getData)

	return [data, focus.setData, focus]
}
