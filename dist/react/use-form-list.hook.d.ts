import { Args, Form, List } from '../types';
export declare function useFormList<T, K>(form: Form<T>, id?: CallableFunction): [
    K[],
    {
        addItem: (item: K) => void;
        removeItem: (item: K) => void;
        updateItem: (item: K, ...args: Args<K>) => void;
        setItems: (items: K[]) => void;
    },
    List<K>
];
