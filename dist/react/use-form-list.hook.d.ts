import { Args, Form, List } from '../types';
export declare function useFormList<T, K>(form: Form<T>, id?: CallableFunction): [
    K[],
    {
        onAddItem: (item: K) => void;
        onRemoveItem: (item: K) => void;
        onEditItem: (item: K, ...args: Args<K>) => void;
        onSetItems: (items: K[]) => void;
    },
    List<K>
];
