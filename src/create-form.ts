import { produce } from 'immer'
import { clone, identity, last, lensPath, set, view } from 'ramda'

import { normalizePath } from './normalize-path.util'
import { Args, DeepPartial, Form, Listener, MiddlewareFunction, PathElement } from './types'

export function createForm<T>(
	initialState: DeepPartial<T> = {},
	middleware: MiddlewareFunction<T> = identity,
): Form<T> {
	let data = produce(initialState, middleware)
	const listeners = new Set<Listener>()

	function onUpdate() {
		for (const listener of listeners) {
			listener()
		}
	}

	function getData<T>(...path: PathElement[]) {
		return view(lensPath(normalizePath(...path)), data)
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

		data = produce(nextData, middleware) as T
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
