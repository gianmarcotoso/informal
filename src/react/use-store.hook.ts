import { identity } from 'ramda'
import { useRef, useSyncExternalStore } from 'react'
import { createStore } from '../create-store'
import { Producer, Setter, Store, StoreBaseType, Widen } from '../types'

export function useStore<I extends StoreBaseType, T extends StoreBaseType = Widen<I>>(
	initialState: I = {} as any,
	middleware: Producer<T> = identity,
): [T, Setter<T>, Store<T>] {
	const { current: store } = useRef(createStore<I, T>(initialState, middleware))
	const data = useSyncExternalStore(store.subscribe, store.getData, store.getData)

	return [data, store.setData, store]
}
