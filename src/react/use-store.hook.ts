import { identity } from 'ramda'
import { useRef, useSyncExternalStore, useTransition } from 'react'
import { createStore } from '../create-store'
import { DeepPartial, Store, Getter, Producer, Setter } from '../types'

export function useStore<T>(
	initialState: DeepPartial<T> = {} as T,
	middleware: Producer<T> = identity,
): [T, Setter<T>, Store<T>] {
	const { current: store } = useRef(createStore<T>(initialState, middleware))
	const data = useSyncExternalStore(store.subscribe, store.getData, store.getData)

	return [data, store.setData, store]
}
