import { normalizePath } from './normalize-path.util'

export function wrapHandler<T extends Event>(setter: CallableFunction) {
	return function eventHandler(event: T) {
		const target = event.target as HTMLInputElement
		const { name, type, value, checked } = target

		const path = normalizePath(name)

		setter(...path, type === 'checkbox' ? checked : value)
	}
}
