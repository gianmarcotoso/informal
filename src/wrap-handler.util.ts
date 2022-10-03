import { normalizePath } from './normalize-path.util'

export function wrapHandler(setter: CallableFunction) {
	return function eventHandler(event: Event) {
		const target = event.target as HTMLInputElement
		const { name, type, value, checked } = target

		const path = normalizePath(name)

		setter(...path, type === 'checkbox' ? checked : value)
	}
}
