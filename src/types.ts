export type Listener = () => void

export type PathElement = string | number

export type UpdateFunction<T> = (data: T) => T

export type S<T> = UpdateFunction<T> | any
export type Args<T> = [...PathElement[], S<T>]

export type Getter = (...args: PathElement[]) => any
export type Setter<T> = (...args: Args<T>) => void

export type Form<T> = {
	getData: Getter
	setData: Setter<T>
	subscribe: (listener: Listener) => void
}

export type List<K> = {
	getList: () => K[]
	setList: (list: K[]) => void
	onAddListItem: (item: K) => void
	onEditListItem: (item: K, ...args: Args<K>) => void
	onRemoveListItem: (item: K) => void
}
