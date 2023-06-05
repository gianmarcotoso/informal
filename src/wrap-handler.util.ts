import { normalizePath } from './normalize-path.util'

export type HasTarget<K extends InputElement = InputElement> = {
	target: K | null
}

export interface InputElement extends EventTarget {
	name: string
	type: string
	value: string
	checked?: boolean
}

export function wrapHandler<K extends InputElement, T extends HasTarget<K>>(setter: CallableFunction) {
	return function eventHandler(event: T) {
		const target = event.target as K
		const { name, type, value } = target

		const path = normalizePath(name)

		let finalValue: string | boolean = value

		if (type === 'checkbox' && 'checked' in target && typeof target.checked === 'boolean') {
			finalValue = target.checked
		}

		setter(...path, finalValue)
	}
}
