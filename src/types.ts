export type StoreBaseType = Record<string, any> | string | number | boolean

export type Widen<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T

export type Listener = () => void
export type Unsubscribe = () => void

export type Producer<T> = (data: T) => T | void
export type Selector<T> = (data: T) => any

export type PathElement = string | number

export type S<T> = Producer<T> | any
export type Args<T> = [...PathElement[], S<T>]

type OpaqueLeaf =
	| Date
	| RegExp
	| Error
	| Map<any, any>
	| Set<any>
	| WeakMap<any, any>
	| WeakSet<any>
	| Promise<any>
	| ((...args: any[]) => any)

type IsTraversable<T> = [T] extends [OpaqueLeaf]
	? false
	: T extends readonly any[]
		? true
		: T extends object
			? true
			: false

type Depth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8]
type Prev<D extends number> = Depth[D]

/**
 * A literal range of array indices for dotted-string paths, e.g. 'todos.0.title'.
 *
 * TS's editor completion can't enumerate suggestions past a `${number}` placeholder (it's not a
 * finite set of literals) — and, for recursive template literal types specifically, even having
 * `${number}` as one alternative alongside a bounded literal range is enough to make the whole
 * union uncompletable. So this range has to be the ONLY option: indices beyond it (or built from
 * a runtime variable) won't type-check via a dotted string, but still work via the multi-argument
 * form (`getData('todos', someIndex, 'title')`), where the index is a plain, unbounded `number`.
 */
type BoundedIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19

export type PathString<T, D extends number = 8> = [D] extends [never]
	? never
	: T extends readonly (infer U)[]
		? IsTraversable<U> extends false
			? `${BoundedIndex}`
			: `${BoundedIndex}` | `${BoundedIndex}.${PathString<U, Prev<D>>}`
		: IsTraversable<T> extends false
			? never
			: {
					[K in keyof T & string]: IsTraversable<T[K]> extends false
						? K
						: K | `${K}.${PathString<T[K], Prev<D>>}`
				}[keyof T & string]

type SplitPath<S extends string> = S extends `${infer Head}.${infer Rest}` ? [Head, ...SplitPath<Rest>] : [S]

export type PathTuple<T, D extends number = 8> = [D] extends [never]
	? never
	: T extends readonly (infer U)[]
		? IsTraversable<U> extends false
			? [number]
			: [number] | [number, ...PathTuple<U, Prev<D>>] | FragmentTuple<T, D>
		: FragmentTuple<T, D>

type FragmentTuple<T, D extends number> =
	IsTraversable<T> extends false
		? never
		: {
				[K in PathString<T, D>]: PathValue<T, SplitPath<K>> extends infer V
					? IsTraversable<V> extends false
						? [K]
						: [K] | [K, ...PathTuple<V, Prev<D>>]
					: [K]
			}[PathString<T, D>]

type FlattenPath<P extends readonly PropertyKey[]> = P extends [infer K, ...infer Rest]
	? Rest extends readonly PropertyKey[]
		? K extends string
			? [...SplitPath<K>, ...FlattenPath<Rest>]
			: [K, ...FlattenPath<Rest>]
		: []
	: []

export type PathValue<T, P extends readonly PropertyKey[]> = WalkPath<T, FlattenPath<P>>

type WalkPath<T, P extends readonly PropertyKey[]> = P extends [infer K, ...infer Rest]
	? T extends readonly (infer U)[]
		? Rest extends readonly PropertyKey[]
			? Rest extends []
				? U
				: WalkPath<U, Rest>
			: never
		: K extends keyof T
			? Rest extends readonly PropertyKey[]
				? Rest extends []
					? T[K]
					: WalkPath<T[K], Rest>
				: never
			: any
	: T

export type DottedPathValue<T, P extends string> = PathValue<T, SplitPath<P>>

export type SetValue<V> = V | ((current: V) => V | void)

export interface Getter<T> {
	(): any
	<P extends PathString<T>>(path: P): DottedPathValue<T, P>
	<P extends PathTuple<T>>(...path: P): PathValue<T, P>
	(selector: Selector<T>): any
}

export interface Setter<T> {
	(value: SetValue<T>): void
	<P extends PathString<T>>(path: P, value: SetValue<DottedPathValue<T, P>>): void
	<P extends PathTuple<T>>(...args: [...P, value: SetValue<PathValue<T, P>>]): void
}

export type Store<T> = {
	getData: Getter<T>
	setData: Setter<T>
	subscribe: (listener: Listener) => Unsubscribe
}

export type List<K> = {
	getItems: () => K[]
	setItems: (list: K[]) => void
	addItem: (item: K) => void
	updateItem: (item: K, ...args: Args<K>) => void
	removeItem: (item: K) => void
}
