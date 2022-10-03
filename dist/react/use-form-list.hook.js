import { identity } from 'ramda';
import { useRef, useSyncExternalStore } from 'react';
import { createList } from '../create-list.js';

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

export { useFormList };
