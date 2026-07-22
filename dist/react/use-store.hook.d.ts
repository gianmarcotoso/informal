import { Producer, Setter, Store, StoreBaseType, Widen } from '../types';
export declare function useStore<I extends StoreBaseType, T extends StoreBaseType = Widen<I>>(initialState?: I, middleware?: Producer<T>): [T, Setter<T>, Store<T>];
