import { identity } from 'ramda';
import { useRef, useSyncExternalStore, useCallback } from 'react';
import { c as createStore, a as createFocus, b as createList } from './create-list-9cecd1f0.js';
import 'immer';

function useStore(initialState = {}, middleware = identity) {
    const { current: store } = useRef(createStore(initialState, middleware));
    const data = useSyncExternalStore(store.subscribe, store.getData, store.getData);
    return [data, store.setData, store];
}

function useStoreFocus(store, ...path) {
    const { current: focus } = useRef(createFocus(store, ...path));
    const data = useSyncExternalStore(focus.subscribe, focus.getData, focus.getData);
    return [data, focus.setData, focus];
}

function useStoreList(store, id = identity) {
    const { current: list } = useRef(createList(store, id));
    const items = useSyncExternalStore(store.subscribe, list.getItems, list.getItems);
    return [
        items,
        {
            addItem: list.addItem,
            updateItem: list.updateItem,
            removeItem: list.removeItem,
            setItems: list.setItems,
        },
        list,
    ];
}

function useStoreSelector(store, selector) {
    const data = useSyncExternalStore(store.subscribe, useCallback(() => {
        return store.getData(selector);
    }, [store, selector]), () => store.getData(selector));
    return [data, store.setData, store];
}

export { useStore, useStoreFocus, useStoreList, useStoreSelector };
