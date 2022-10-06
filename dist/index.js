import { n as normalizePath } from './create-list-3050e167.js';
export { a as createFocus, c as createForm, b as createList, n as normalizePath } from './create-list-3050e167.js';
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
