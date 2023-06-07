import { identity } from 'ramda'
import { useRef, useSyncExternalStore } from 'react'
import { createStore } from '../create-store'
import { Producer, Setter, Store, StoreBaseType } from '../types'

export function useStore<T extends StoreBaseType>(
	initialState: T = {} as T,
	middleware: Producer<T> = identity,
): [T, Setter<T>, Store<T>] {
	const { current: store } = useRef(createStore<T>(initialState, middleware))
	const data = useSyncExternalStore(store.subscribe, store.getData, store.getData)

	return [data, store.setData, store]
}
