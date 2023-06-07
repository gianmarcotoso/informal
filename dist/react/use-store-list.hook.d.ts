import { Args, Store, List, StoreBaseType } from '../types';
export declare function useStoreList<K extends StoreBaseType, T extends StoreBaseType = any>(store: Store<T>, id?: CallableFunction): [
    K[],
    {
        addItem: (item: K) => void;
        removeItem: (item: K) => void;
        updateItem: (item: K, ...args: Args<K>) => void;
        setItems: (items: K[]) => void;
    },
    List<K>
];
