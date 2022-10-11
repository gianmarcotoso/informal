import { DeepPartial, Store, Producer, Setter } from '../types';
export declare function useStore<T>(initialState?: DeepPartial<T>, middleware?: Producer<T>): [T, Setter<T>, Store<T>];
