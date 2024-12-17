function createFocus(store, ...path) {
    const listeners = new Set();
    function onUpdate() {
        for (const listener of listeners) {
            listener();
        }
    }
    function getData(...args) {
        if (args.length === 1 && typeof args[0] === 'function') {
            const [selector] = args;
            return selector(store.getData(...path));
        }
        return store.getData(...[...path, ...args]);
    }
    function setData(...args) {
        store.setData(...[...path, ...args]);
        onUpdate();
    }
    function subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }
    return {
        getData,
        setData,
        subscribe,
    };
}

export { createFocus };
