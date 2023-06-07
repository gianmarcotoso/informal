import { useRef, useSyncExternalStore } from 'react'
import { createFocus } from '../create-focus'
import { PathElement, Setter, Store, StoreBaseType } from '../types'

export function useStoreFocus<K extends StoreBaseType, T extends StoreBaseType = any>(
	store: Store<T>,
	...path: PathElement[]
): [K, Setter<K>, Store<K>] {
	const { current: focus } = useRef(createFocus<K, T>(store, ...path))
	const data = useSyncExternalStore(focus.subscribe, focus.getData, focus.getData)

	return [data, focus.setData, focus]
}
