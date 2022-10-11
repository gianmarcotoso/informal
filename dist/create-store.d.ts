import { DeepPartial, Store, Producer } from './types';
export declare function createStore<T>(initialState?: DeepPartial<T>, middleware?: Producer<T>): Store<T>;
