import { identity } from 'ramda';
import { useRef, useSyncExternalStore } from 'react';
import { createForm } from '../create-form.js';
import 'immer';
import '../normalize-path.util.js';

function useForm(initialState = {}, middleware = identity) {
    const { current: form } = useRef(createForm(initialState, middleware));
    const data = useSyncExternalStore(form.subscribe, form.getData);
    return [data, form.setData, form];
}

export { useForm };
