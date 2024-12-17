import { useSyncExternalStore, useCallback } from 'react';

function useStoreSelector(store, selector) {
    const data = useSyncExternalStore(store.subscribe, useCallback(() => {
        return store.getData(selector);
    }, [store, selector]), () => store.getData(selector));
    return [data, store.setData, store];
}

export { useStoreSelector };
