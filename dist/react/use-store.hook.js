import { identity } from 'ramda';
import { useRef, useSyncExternalStore } from 'react';
import { createStore } from '../create-store.js';

function useStore(initialState = {}, middleware = identity) {
    const { current: store } = useRef(createStore(initialState, middleware));
    const data = useSyncExternalStore(store.subscribe, store.getData, store.getData);
    return [data, store.setData, store];
}

export { useStore };
