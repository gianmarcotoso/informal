import { identity } from 'ramda';
import { useRef, useSyncExternalStore } from 'react';
import { createList } from '../create-list.js';

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

export { useStoreList };
