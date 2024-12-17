import { normalizePath } from './normalize-path.util.js';

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
