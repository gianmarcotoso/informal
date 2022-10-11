import { Store, PathElement } from './types';
export declare function createFocus<T, K>(store: Store<T>, ...path: PathElement[]): Store<K>;
