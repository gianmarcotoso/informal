import { wrapHandler } from '../src/wrap-handler.util'

describe('wrapHandler', () => {
	it('wraps a setter function to handle events', () => {
		const setter = jest.fn()
		const eventHandler = wrapHandler(setter)
		const event = {
			target: {
				name: 'user.name',
				type: 'text',
				value: 'John',
			},
		}
		eventHandler(event as unknown as Event)
		expect(setter).toHaveBeenCalledWith('user', 'name', 'John')
	})

	it('handles checkboxes', () => {
		const setter = jest.fn()
		const eventHandler = wrapHandler(setter)
		const event = {
			target: {
				name: 'user.active',
				type: 'checkbox',
				checked: true,
			},
		}
		eventHandler(event as unknown as Event)
		expect(setter).toHaveBeenCalledWith('user', 'active', true)
	})
})
