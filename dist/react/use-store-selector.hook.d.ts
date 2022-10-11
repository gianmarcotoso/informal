import { Store, Selector, Setter } from '../types';
export declare function useStoreSelector<T>(form: Store<T>, selector: Selector<T>): [any, Setter<T>, Store<T>];
