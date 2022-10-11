import { identity } from 'ramda';
import { useRef, useSyncExternalStore, useMemo, useCallback } from 'react';
import { c as createStore, a as createFocus, b as createList } from './create-list-c042b693.js';
import 'immer';

function useStore(initialState = {}, middleware = identity) {
    const { current: form } = useRef(createStore(initialState, middleware));
    const data = useSyncExternalStore(form.subscribe, form.getData, form.getData);
    return [data, form.setData, form];
}

function useStoreFocus(form, ...path) {
    const focus = useMemo(() => createFocus(form, ...path), [form, path]);
    const data = useSyncExternalStore(focus.subscribe, focus.getData, focus.getData);
    return [data, focus.setData, focus];
}

function useStoreList(form, id = identity) {
    const { current: list } = useRef(createList(form, id));
    const items = useSyncExternalStore(form.subscribe, list.getItems, list.getItems);
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

function useStoreSelector(form, selector) {
    const data = useSyncExternalStore(form.subscribe, useCallback(() => {
        return form.getData(selector);
    }, [form, selector]), () => form.getData(selector));
    return [data, form.setData, form];
}

export { useStore, useStoreFocus, useStoreList, useStoreSelector };
