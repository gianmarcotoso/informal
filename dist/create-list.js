import { identity } from 'ramda';

function createList(store, id = identity) {
    const emptyList = [];
    function getItems() {
        var _a;
        return (_a = store.getData()) !== null && _a !== void 0 ? _a : emptyList;
    }
    function setItems(list) {
        store.setData(list);
    }
    function addItem(item) {
        store.setData((list) => [...list, item]);
    }
    function updateItem(item, ...args) {
        const index = getItems().findIndex((i) => id(i) === id(item));
        store.setData(index, ...args);
    }
    function removeItem(item) {
        store.setData((list) => {
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

export { createList };
