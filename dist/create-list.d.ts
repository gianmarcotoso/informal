import { Store, List } from './types';
export declare function createList<T, K>(store: Store<T>, id?: CallableFunction): List<K>;
