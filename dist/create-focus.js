function createFocus(Form, ...path) {
    const listeners = new Set();
    function onUpdate() {
        for (const listener of listeners) {
            listener();
        }
    }
    function getData(...args) {
        if (args.length === 1 && typeof args[0] === 'function') {
            const [selector] = args;
            return selector(Form.getData(...path));
        }
        return Form.getData(...[...path, ...args]);
    }
    function setData(...args) {
        Form.setData(...[...path, ...args]);
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
