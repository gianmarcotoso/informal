import { identity } from 'ramda';

function createList(store, id = identity) {
    const emptyList = [];
    const storeSetData = store.setData;
    function getItems() {
        var _a;
        return (_a = store.getData()) !== null && _a !== void 0 ? _a : emptyList;
    }
    function setItems(list) {
        storeSetData(list);
    }
    function addItem(item) {
        storeSetData((list) => [...list, item]);
    }
    function updateItem(item, ...args) {
        const index = getItems().findIndex((i) => id(i) === id(item));
        storeSetData(index, ...args);
    }
    function removeItem(item) {
        storeSetData((list) => {
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
