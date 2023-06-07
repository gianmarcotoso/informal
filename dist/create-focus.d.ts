import { Store, PathElement, StoreBaseType } from './types';
export declare function createFocus<K extends StoreBaseType, T extends StoreBaseType = any>(store: Store<T>, ...path: PathElement[]): Store<K>;
