export declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
export declare type Listener = () => void;
export declare type Unsubscribe = () => void;
export declare type Producer<T> = (data: T) => T;
export declare type Selector<T> = (data: T) => any;
export declare type PathElement = string | number;
export declare type S<T> = Producer<T> | any;
export declare type Args<T> = [...PathElement[], S<T>];
export interface Getter<T> {
    (...path: PathElement[]): any;
    (selector: Selector<T>): any;
}
export declare type Setter<T> = (...args: Args<T>) => void;
export declare type Form<T> = {
    getData: Getter<T>;
    setData: Setter<T>;
    subscribe: (listener: Listener) => Unsubscribe;
};
export declare type List<K> = {
    getItems: () => K[];
    setItems: (list: K[]) => void;
    addItem: (item: K) => void;
    updateItem: (item: K, ...args: Args<K>) => void;
    removeItem: (item: K) => void;
};
