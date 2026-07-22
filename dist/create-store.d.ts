import { Store, Producer, StoreBaseType, Widen } from './types';
export declare function createStore<I extends StoreBaseType, T extends StoreBaseType = Widen<I>>(initialState?: I, middleware?: Producer<T>): Store<T>;
