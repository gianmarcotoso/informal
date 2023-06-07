import { Store, Selector, Setter, StoreBaseType } from '../types';
export declare function useStoreSelector<T extends StoreBaseType>(store: Store<T>, selector: Selector<T>): [any, Setter<T>, Store<T>];
