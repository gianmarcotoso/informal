function createFocus(store, ...path) {
    const listeners = new Set();
    function onUpdate() {
        for (const listener of listeners) {
            listener();
        }
    }
    const storeGetData = store.getData;
    const storeSetData = store.setData;
    function getData(...args) {
        if (args.length === 1 && typeof args[0] === 'function') {
            const [selector] = args;
            return selector(storeGetData(...path));
        }
        return storeGetData(...path, ...args);
    }
    function setData(...args) {
        storeSetData(...path, ...args);
        onUpdate();
    }
    function subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }
    return {
        getData: getData,
        setData: setData,
        subscribe,
    };
}

export { createFocus };
