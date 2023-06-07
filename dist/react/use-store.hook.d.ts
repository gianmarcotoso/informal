import { Producer, Setter, Store, StoreBaseType } from '../types';
export declare function useStore<T extends StoreBaseType>(initialState?: T, middleware?: Producer<T>): [T, Setter<T>, Store<T>];
