import { identity } from 'ramda';

function createList(form, id = identity) {
    const emptyList = [];
    function getList() {
        var _a;
        return (_a = form.getData()) !== null && _a !== void 0 ? _a : emptyList;
    }
    function setList(list) {
        form.setData(list);
    }
    function onAddListItem(item) {
        form.setData((list) => [...list, item]);
    }
    function onEditListItem(item, ...args) {
        const index = getList().findIndex((i) => id(i) === id(item));
        form.setData(index, ...args);
    }
    function onRemoveListItem(item) {
        form.setData((list) => {
            return list.filter((x) => id(x) !== id(item));
        });
    }
    return {
        getList,
        setList,
        onAddListItem,
        onEditListItem,
        onRemoveListItem,
    };
}

export { createList };
