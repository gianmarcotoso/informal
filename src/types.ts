export type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>
}

export type Listener = () => void
export type Unsubscribe = () => void

export type Producer<T> = (data: T) => T
export type Selector<T> = (data: T) => any

export type PathElement = string | number

export type S<T> = Producer<T> | any
export type Args<T> = [...PathElement[], S<T>]

export interface Getter<T> {
	(...path: PathElement[]): any
	(selector: Selector<T>): any
}

export type Setter<T> = (...args: Args<T>) => void

export type Form<T> = {
	getData: Getter<T>
	setData: Setter<T>
	subscribe: (listener: Listener) => Unsubscribe
}

export type List<K> = {
	getList: () => K[]
	setList: (list: K[]) => void
	addItem: (item: K) => void
	updateItem: (item: K, ...args: Args<K>) => void
	removeItem: (item: K) => void
}
