import { Store, Selector, Setter } from '../types';
export declare function useStoreSelector<T>(store: Store<T>, selector: Selector<T>): [any, Setter<T>, Store<T>];
