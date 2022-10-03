import { produce } from 'immer'
import { clone, last, lensPath, set, view } from 'ramda'

import { normalizePath } from './normalize-path.util'
import { Args, Form, Listener, PathElement } from './types'

export function createForm<T>(initialState: Partial<T> = {}): Form<T> {
	let data = clone(initialState)
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

		if (typeof value === 'function') {
			const nextValue = produce(view(pathLens, data), value)

			data = set(pathLens, nextValue, data)
		} else {
			data = set(pathLens, value, data) as Partial<T>
		}

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
