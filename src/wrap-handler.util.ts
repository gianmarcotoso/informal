import { normalizePath } from './normalize-path.util'

export type HasTarget<K> = {
	target: K
}

export type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export function wrapHandler<K extends HTMLInputElement, T extends HasTarget<K>>(setter: CallableFunction) {
	return function eventHandler(event: T) {
		const target = event.target as K
		const { name, type, value } = target

		const path = normalizePath(name)

		let finalValue: string | boolean = value

		if (type === 'checkbox' && 'checked' in target) {
			finalValue = target.checked
		}

		setter(...path, finalValue)
	}
}
