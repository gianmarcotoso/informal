import { produce } from 'immer';
import { identity, view, lensPath, last, set } from 'ramda';
import { normalizePath } from './normalize-path.util.js';

function createForm(initialState = {}, middleware = identity) {
    let data = produce(initialState, middleware);
    const listeners = new Set();
    function onUpdate() {
        for (const listener of listeners) {
            listener();
        }
    }
    function getData(...path) {
        return view(lensPath(normalizePath(...path)), data);
    }
    function setData(...args) {
        const path = normalizePath(...args.slice(0, -1));
        const value = last(args);
        const pathLens = lensPath(path);
        let nextData;
        if (typeof value === 'function') {
            const nextValue = produce(view(pathLens, data), value);
            nextData = set(pathLens, nextValue, data);
        }
        else {
            nextData = set(pathLens, value, data);
        }
        data = produce(nextData, middleware);
        onUpdate();
    }
    function subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }
    return {
        getData,
        setData,
        subscribe,
    };
}

export { createForm };
