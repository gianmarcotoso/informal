import { n as normalizePath } from './create-list-9cecd1f0.js';
export { a as createFocus, b as createList, c as createStore } from './create-list-9cecd1f0.js';
import 'immer';
import 'ramda';

function wrapHandler(setter) {
    return function eventHandler(event) {
        const target = event.target;
        const { name, type, value } = target;
        const path = normalizePath(name);
        let finalValue = value;
        if (type === 'checkbox' && 'checked' in target && typeof target.checked === 'boolean') {
            finalValue = target.checked;
        }
        setter(...path, finalValue);
    };
}

export { wrapHandler };
