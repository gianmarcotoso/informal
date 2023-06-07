import { Store, List, StoreBaseType } from './types';
export declare function createList<K, T extends StoreBaseType = any>(store: Store<T>, id?: CallableFunction): List<K>;
