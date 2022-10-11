import { Args, Store, List } from '../types';
export declare function useStoreList<T, K>(form: Store<T>, id?: CallableFunction): [
    K[],
    {
        addItem: (item: K) => void;
        removeItem: (item: K) => void;
        updateItem: (item: K, ...args: Args<K>) => void;
        setItems: (items: K[]) => void;
    },
    List<K>
];
