import { useSyncExternalStore, useCallback } from 'react';

function useFormSelector(form, selector) {
    const data = useSyncExternalStore(form.subscribe, useCallback(() => {
        return form.getData(selector);
    }, [form, selector]));
    return [data, form.setData, form];
}

export { useFormSelector };
