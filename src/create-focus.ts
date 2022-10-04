import { Args, Form, Listener, PathElement, Selector } from './types'

export function createFocus<T, K>(Form: Form<T>, ...path: PathElement[]): Form<K> {
	const listeners = new Set<Listener>()

	function onUpdate() {
		for (const listener of listeners) {
			listener()
		}
	}

	function getData<K>(...args: PathElement[] | [Selector<K>]): K {
		if (args.length === 1 && typeof args[0] === 'function') {
			const [selector] = args

			return selector(Form.getData(...path) as K)
		}

		return Form.getData(...([...path, ...args] as PathElement[]))
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
