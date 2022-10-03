function createFocus(Form, ...path) {
    const listeners = new Set();
    function onUpdate() {
        for (const listener of listeners) {
            listener();
        }
    }
    function getData() {
        return Form.getData(...path);
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
