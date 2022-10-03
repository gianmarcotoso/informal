import { Args, Form, Listener, PathElement } from './types'

export function createFocus<T, K>(Form: Form<T>, ...path: PathElement[]): Form<K> {
	const listeners = new Set<Listener>()

	function onUpdate() {
		for (const listener of listeners) {
			listener()
		}
	}

	function getData(): K {
		return Form.getData(...path)
	}

	function setData(...args: Args<K>) {
		Form.setData(...[...path, ...args])

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
