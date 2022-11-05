import { n as normalizePath } from './create-list-688a1002.js';
export { a as createFocus, b as createList, c as createStore } from './create-list-688a1002.js';
import 'immer';
import 'ramda';

function wrapHandler(setter) {
    return function eventHandler(event) {
        const target = event.target;
        const { name, type, value, checked } = target;
        const path = normalizePath(name);
        setter(...path, type === 'checkbox' ? checked : value);
    };
}

export { wrapHandler };
