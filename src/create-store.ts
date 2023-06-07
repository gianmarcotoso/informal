import { produce } from 'immer'
import { identity, last, lensPath, set, view } from 'ramda'

import { normalizePath } from './normalize-path.util'
import { Args, Store, Listener, Producer, PathElement, Selector, StoreBaseType } from './types'

export function createStore<T extends StoreBaseType>(
	initialState: T = {} as any,
	middleware: Producer<T> = identity,
): Store<T> {
	let data = produce(initialState, middleware)
	const listeners = new Set<Listener>()

	function onUpdate() {
		for (const listener of listeners) {
			listener()
		}
	}

	function getData(...args: PathElement[] | [Selector<T>]): T {
		if (args.length === 1 && typeof args[0] === 'function') {
			const [selector] = args

			return selector(data)
		}

		return view(lensPath(normalizePath(...(args as PathElement[]))), data)
	}

	function setData(...args: Args<T>) {
		const path = normalizePath(...args.slice(0, -1))
		const value = last(args)

		const pathLens = lensPath(path)

		let nextData
		if (typeof value === 'function') {
			const nextValue = produce(view(pathLens, data as T), value)

			nextData = set(pathLens, nextValue, data as T)
		} else {
			nextData = set(pathLens, value, data as T)
		}

		data = produce(nextData, middleware) as any
		onUpdate()
	}

	function subscribe(listener: Listener) {
		listeners.add(listener)

		return () => listeners.delete(listener)
	}

	return {
		getData,
		setData,
		subscribe,
	}
}
