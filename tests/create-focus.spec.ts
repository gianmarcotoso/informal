import { createForm } from '../src/create-form'
import { createFocus } from '../src/create-focus'

describe('createFocus', () => {
	it('allows to create a focus on a form', () => {
		const form = createForm({ name: 'John', address: { city: 'New York' } })
		const nameFocus = createFocus(form, 'name')
		const addressFocus = createFocus(form, 'address')

		expect(nameFocus.getData()).toEqual('John')
		expect(addressFocus.getData()).toEqual({ city: 'New York' })
	})

	it('allows to get nested data on a focused object', () => {
		const form = createForm({ name: 'John', address: { city: 'New York' } })
		const addressFocus = createFocus(form, 'address')

		expect(addressFocus.getData('city')).toEqual('New York')
	})

	it('allows to get nested data using a selector', () => {
		const form = createForm({ name: 'John', address: { city: 'New York' } })
		const addressFocus = createFocus(form, 'address')

		expect(addressFocus.getData((data: any) => data.city)).toEqual('New York')
	})

	it('allows a focused form data to be updated', () => {
		const form = createForm({ name: 'John', address: { city: 'New York' } })
		const nameFocus = createFocus(form, 'name')
		const addressFocus = createFocus(form, 'address')

		nameFocus.setData('Jane')
		addressFocus.setData({ city: 'Paris' })

		expect(form.getData()).toEqual({ name: 'Jane', address: { city: 'Paris' } })
	})

	it('allows to update a key on a focused form object', () => {
		const form = createForm({ name: 'John', address: { city: 'New York' } })
		const addressFocus = createFocus(form, 'address')

		addressFocus.setData('city', 'Paris')

		expect(form.getData()).toEqual({ name: 'John', address: { city: 'Paris' } })
	})

	it('allows to update a focused form object using a function', () => {
		const form = createForm({ name: 'John', address: { city: 'New York', street: 'Street Name 123' } })
		const addressFocus = createFocus(form, 'address')

		addressFocus.setData((address: any) => ({ ...address, city: 'Paris' }))

		expect(form.getData()).toEqual({ name: 'John', address: { street: 'Street Name 123', city: 'Paris' } })
	})

	it('allows to subscribe to the focused form', () => {
		const form = createForm({ name: 'John', address: { city: 'New York' } })
		const addressFocus = createFocus(form, 'address')

		const listener = jest.fn(() => {
			expect(addressFocus.getData()).toEqual({ city: 'Paris' })
		})
		addressFocus.subscribe(listener)

		addressFocus.setData('city', 'Paris')

		expect(listener).toHaveBeenCalled()
	})

	it('should still call the form listeners when a focused field is updated', () => {
		const form = createForm({ name: 'John', address: { city: 'New York' } })
		const addressFocus = createFocus(form, 'address')

		const listener = jest.fn(() => {
			expect(form.getData()).toEqual({ name: 'John', address: { city: 'Paris' } })
		})
		form.subscribe(listener)

		addressFocus.setData('city', 'Paris')

		expect(listener).toHaveBeenCalled()
	})

	it('should allow focuses to be created recursively', () => {
		const form = createForm({ name: 'John', address: { city: 'New York' } })
		const addressFocus = createFocus(form, 'address')
		const cityFocus = createFocus(addressFocus, 'city')

		expect(cityFocus.getData()).toEqual('New York')

		cityFocus.setData('Paris')
		expect(form.getData()).toEqual({ name: 'John', address: { city: 'Paris' } })
	})
})
