import { identity } from 'ramda';
import { useRef, useSyncExternalStore, useCallback } from 'react';
import { c as createForm, a as createFocus, b as createList } from './create-list-54515400.js';
import 'immer';

function useForm(initialState = {}, middleware = identity) {
    const { current: form } = useRef(createForm(initialState, middleware));
    const data = useSyncExternalStore(form.subscribe, form.getData);
    return [data, form.setData, form];
}

function useFormFocus(form, ...path) {
    const { current: focus } = useRef(createFocus(form, ...path));
    const data = useSyncExternalStore(focus.subscribe, focus.getData);
    return [data, focus.setData, focus];
}

function useFormList(form, id = identity) {
    const { current: list } = useRef(createList(form, id));
    const items = useSyncExternalStore(form.subscribe, list.getList);
    return [
        items,
        {
            onAddItem: list.onAddListItem,
            onEditItem: list.onEditListItem,
            onRemoveItem: list.onRemoveListItem,
            onSetItems: list.setList,
        },
        list,
    ];
}

function useFormSelector(form, selector) {
    const data = useSyncExternalStore(form.subscribe, useCallback(() => {
        return form.getData(selector);
    }, [form, selector]));
    return [data, form.setData, form];
}

export { useForm, useFormFocus, useFormList, useFormSelector };
