import { normalizePath } from './normalize-path.util.js';
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
