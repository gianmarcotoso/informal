import { Store, PathElement, Setter } from '../types';
export declare function useStoreFocus<T, K>(form: Store<T>, ...path: PathElement[]): [K, Setter<K>, Store<K>];
