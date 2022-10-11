import { identity } from 'ramda'
import { useRef, useSyncExternalStore, useTransition } from 'react'
import { createStore } from '../create-store'
import { DeepPartial, Store, Getter, Producer, Setter } from '../types'

export function useStore<T>(
	initialState: DeepPartial<T> = {} as T,
	middleware: Producer<T> = identity,
): [T, Setter<T>, Store<T>] {
	const { current: form } = useRef(createStore<T>(initialState, middleware))
	const data = useSyncExternalStore(form.subscribe, form.getData, form.getData)

	return [data, form.setData, form]
}
