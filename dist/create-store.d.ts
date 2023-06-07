import { Store, Producer, StoreBaseType } from './types';
export declare function createStore<T extends StoreBaseType>(initialState?: T, middleware?: Producer<T>): Store<T>;
