import { Store, PathElement, Setter } from '../types';
export declare function useStoreFocus<T, K>(store: Store<T>, ...path: PathElement[]): [K, Setter<K>, Store<K>];
