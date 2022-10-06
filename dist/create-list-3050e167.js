import { produce } from 'immer';
import { flatten, identity, view, lensPath, last, set } from 'ramda';

function normalizePathElement(pathElement) {
    if (!isNaN(+pathElement)) {
        return +pathElement;
    }
    if (typeof pathElement === 'string' && pathElement.includes('.')) {
        const elements = pathElement.split('.');
        return flatten(elements.map((p) => normalizePathElement(p)));
    }
    return pathElement;
}
function normalizePath(...path) {
    return flatten(path.map((p) => normalizePathElement(p)));
}

function createForm(initialState = {}, middleware = identity) {
    let data = produce(initialState, middleware);
    const listeners = new Set();
    function onUpdate() {
        for (const listener of listeners) {
            listener();
        }
    }
    function getData(...args) {
        if (args.length === 1 && typeof args[0] === 'function') {
            const [selector] = args;
            return selector(data);
        }
        return view(lensPath(normalizePath(...args)), data);
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

function createFocus(Form, ...path) {
    const listeners = new Set();
    function onUpdate() {
        for (const listener of listeners) {
            listener();
        }
    }
    function getData(...args) {
        if (args.length === 1 && typeof args[0] === 'function') {
            const [selector] = args;
            return selector(Form.getData(...path));
        }
        return Form.getData(...[...path, ...args]);
    }
    function setData(...args) {
        Form.setData(...[...path, ...args]);
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

function createList(form, id = identity) {
    const emptyList = [];
    function getItems() {
        var _a;
        return (_a = form.getData()) !== null && _a !== void 0 ? _a : emptyList;
    }
    function setItems(list) {
        form.setData(list);
    }
    function addItem(item) {
        form.setData((list) => [...list, item]);
    }
    function updateItem(item, ...args) {
        const index = getItems().findIndex((i) => id(i) === id(item));
        form.setData(index, ...args);
    }
    function removeItem(item) {
        form.setData((list) => {
            return list.filter((x) => id(x) !== id(item));
        });
    }
    return {
        getItems: getItems,
        setItems: setItems,
        addItem,
        updateItem,
        removeItem,
    };
}

export { createFocus as a, createList as b, createForm as c, normalizePath as n };
