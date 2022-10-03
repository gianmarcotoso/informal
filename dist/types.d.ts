export declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
export declare type MiddlewareFunction<T> = (data: DeepPartial<T>) => DeepPartial<T>;
export declare type Listener = () => void;
export declare type Unsubscribe = () => void;
export declare type PathElement = string | number;
export declare type UpdateFunction<T> = (data: T) => T;
export declare type S<T> = UpdateFunction<T> | any;
export declare type Args<T> = [...PathElement[], S<T>];
export declare type Getter = (...args: PathElement[]) => any;
export declare type Setter<T> = (...args: Args<T>) => void;
export declare type Form<T> = {
    getData: Getter;
    setData: Setter<T>;
    subscribe: (listener: Listener) => Unsubscribe;
};
export declare type List<K> = {
    getList: () => K[];
    setList: (list: K[]) => void;
    onAddListItem: (item: K) => void;
    onEditListItem: (item: K, ...args: Args<K>) => void;
    onRemoveListItem: (item: K) => void;
};
