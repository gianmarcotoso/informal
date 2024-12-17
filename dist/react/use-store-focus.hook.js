import { useRef, useSyncExternalStore } from 'react';
import { createFocus } from '../create-focus.js';

function useStoreFocus(store, ...path) {
    const { current: focus } = useRef(createFocus(store, ...path));
    const data = useSyncExternalStore(focus.subscribe, focus.getData, focus.getData);
    return [data, focus.setData, focus];
}

export { useStoreFocus };
