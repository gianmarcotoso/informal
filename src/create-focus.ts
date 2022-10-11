import { Args, Store, Listener, PathElement, Selector } from './types'

export function createFocus<T, K>(store: Store<T>, ...path: PathElement[]): Store<K> {
	const listeners = new Set<Listener>()

	function onUpdate() {
		for (const listener of listeners) {
			listener()
		}
	}

	function getData<K>(...args: PathElement[] | [Selector<K>]): K {
		if (args.length === 1 && typeof args[0] === 'function') {
			const [selector] = args

			return selector(store.getData(...path) as K)
		}

		return store.getData(...([...path, ...args] as PathElement[]))
	}

	function setData(...args: Args<K>) {
		store.setData(...[...path, ...args])

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
