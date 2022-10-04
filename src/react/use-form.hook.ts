import { identity } from 'ramda'
import { useRef, useSyncExternalStore, useTransition } from 'react'
import { createForm } from '../create-form'
import { DeepPartial, Form, Getter, Producer, Setter } from '../types'

export function useForm<T>(
	initialState: DeepPartial<T> = {} as T,
	middleware: Producer<T> = identity,
): [T, Setter<T>, Form<T>] {
	const { current: form } = useRef(createForm<T>(initialState, middleware))
	const data = useSyncExternalStore(form.subscribe, form.getData)

	return [data, form.setData, form]
}
