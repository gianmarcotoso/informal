import { Args, Store, Listener, PathElement, Selector, StoreBaseType, Getter, Setter } from './types'

export function createFocus<K extends StoreBaseType, T extends StoreBaseType = any>(
	store: Store<T>,
	...path: PathElement[]
): Store<K> {
	const listeners = new Set<Listener>()

	function onUpdate() {
		for (const listener of listeners) {
			listener()
		}
	}

	const storeGetData = store.getData as (...args: any[]) => any
	const storeSetData = store.setData as (...args: any[]) => void

	function getData<K>(...args: PathElement[] | [Selector<K>]): K {
		if (args.length === 1 && typeof args[0] === 'function') {
			const [selector] = args

			return selector(storeGetData(...path) as K)
		}

		return storeGetData(...path, ...args)
	}

	function setData(...args: Args<K>) {
		storeSetData(...path, ...args)

		onUpdate()
	}

	function subscribe(listener: Listener) {
		listeners.add(listener)

		return () => listeners.delete(listener)
	}

	return {
		getData: getData as Getter<K>,
		setData: setData as Setter<K>,
		subscribe,
	}
}
