export type StoreBaseType = Record<string, any> | string | number | boolean;
export type Widen<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T;
export type Listener = () => void;
export type Unsubscribe = () => void;
export type Producer<T> = (data: T) => T | void;
export type Selector<T> = (data: T) => any;
export type PathElement = string | number;
export type S<T> = Producer<T> | any;
export type Args<T> = [...PathElement[], S<T>];
type OpaqueLeaf = Date | RegExp | Error | Map<any, any> | Set<any> | WeakMap<any, any> | WeakSet<any> | Promise<any> | ((...args: any[]) => any);
type IsTraversable<T> = [T] extends [OpaqueLeaf] ? false : T extends readonly any[] ? true : T extends object ? true : false;
type IsAny<T> = 0 extends 1 & T ? true : false;
type BoundedIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;
type ObjectKey<T> = (keyof T & string) | `${keyof T & number}`;
type Segment<T, Index extends string> = IsAny<T> extends true ? string : T extends unknown ? IsTraversable<T> extends true ? T extends readonly any[] ? Index : ObjectKey<T> : never : never;
type ValidSegment<T> = Segment<T, `${number}`>;
type SuggestedSegment<T> = Segment<T, `${BoundedIndex}`>;
type Step<T, K> = IsAny<T> extends true ? any : T extends unknown ? IsTraversable<T> extends true ? T extends readonly (infer U)[] ? K extends number | `${number}` ? U : never : K extends keyof T ? T[K] : K extends `${infer N extends number}` ? N extends keyof T ? T[N] : never : never : never : never;
type Walk<T, P extends readonly PropertyKey[]> = P extends readonly [infer K, ...infer Rest extends readonly PropertyKey[]] ? Walk<Step<T, K>, Rest> : number extends P['length'] ? never : T;
type SplitPath<S extends string> = S extends `${infer Head}.${infer Rest}` ? [Head, ...SplitPath<Rest>] : [S];
type FlattenPath<P extends readonly PathElement[]> = P extends readonly [
    infer K,
    ...infer Rest extends readonly PathElement[]
] ? K extends string ? [...SplitPath<K>, ...FlattenPath<Rest>] : [K, ...FlattenPath<Rest>] : number extends P['length'] ? PathElement[] : [];
export type DottedPath<T, P extends string> = P extends `${infer K}.${infer Rest}` ? K extends ValidSegment<T> ? `${K}.${DottedPath<Step<T, K>, Rest>}` : SuggestedSegment<T> : P extends ValidSegment<T> ? P : SuggestedSegment<T>;
export type PathValue<T, P extends readonly PathElement[]> = Walk<T, FlattenPath<P>>;
export type DottedPathValue<T, P extends string> = Walk<T, SplitPath<P>>;
export type InvalidPath<P> = {
    readonly __invalidPath: P;
};
export type ValidPath<T, P extends readonly PathElement[]> = [PathValue<T, P>] extends [never] ? [InvalidPath<P>] : P;
export type SetValue<V> = V | ((current: V) => V | void);
type PathSetValue<T, P extends readonly PathElement[]> = [PathValue<T, P>] extends [never] ? InvalidPath<P> : SetValue<PathValue<T, P>>;
export interface Getter<T> {
    (): any;
    <P extends string>(path: DottedPath<T, P>): DottedPathValue<T, P>;
    <const P extends readonly PathElement[]>(...path: ValidPath<T, P>): PathValue<T, P>;
    (selector: Selector<T>): any;
}
export interface Setter<T> {
    (value: SetValue<T>): void;
    <P extends string>(path: DottedPath<T, P>, value: SetValue<DottedPathValue<T, P>>): void;
    <const P extends readonly PathElement[]>(...args: [...P, value: PathSetValue<T, P>]): void;
}
export type Store<T> = {
    getData: Getter<T>;
    setData: Setter<T>;
    subscribe: (listener: Listener) => Unsubscribe;
};
export type List<K> = {
    getItems: () => K[];
    setItems: (list: K[]) => void;
    addItem: (item: K) => void;
    updateItem: (item: K, ...args: Args<K>) => void;
    removeItem: (item: K) => void;
};
export {};
