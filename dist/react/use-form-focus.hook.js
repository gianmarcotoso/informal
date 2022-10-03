import { useRef, useSyncExternalStore } from 'react';
import { createFocus } from '../create-focus.js';

function useFormFocus(form, ...path) {
    const { current: focus } = useRef(createFocus(form, ...path));
    const data = useSyncExternalStore(focus.subscribe, focus.getData);
    return [data, focus.setData, focus];
}

export { useFormFocus };
