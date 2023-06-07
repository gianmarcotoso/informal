import { PathElement, Setter, Store, StoreBaseType } from '../types';
export declare function useStoreFocus<K extends StoreBaseType, T extends StoreBaseType = any>(store: Store<T>, ...path: PathElement[]): [K, Setter<K>, Store<K>];
