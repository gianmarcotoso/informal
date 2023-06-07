import { useCallback, useSyncExternalStore } from 'react'

import { Store, Selector, Setter, StoreBaseType } from '../types'

export function useStoreSelector<T extends StoreBaseType>(
	store: Store<T>,
	selector: Selector<T>,
): [any, Setter<T>, Store<T>] {
	const data = useSyncExternalStore(
		store.subscribe,
		useCallback(() => {
			return store.getData(selector)
		}, [store, selector]),
		() => store.getData(selector),
	)

	return [data, store.setData, store]
}
