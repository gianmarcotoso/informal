import { flatten } from 'ramda';

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

export { normalizePath };
