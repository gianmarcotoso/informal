import { createStore } from '../src/create-store'
import { createFocus } from '../src/create-focus'

describe('createFocus', () => {
	it('allows to create a focus on a store', () => {
		const store = createStore({ name: 'John', address: { city: 'New York' } })
		const nameFocus = createFocus(store, 'name')
		const addressFocus = createFocus(store, 'address')

		expect(nameFocus.getData()).toEqual('John')
		expect(addressFocus.getData()).toEqual({ city: 'New York' })
	})

	it('allows to get nested data on a focused object', () => {
		const store = createStore({ name: 'John', address: { city: 'New York' } })
		const addressFocus = createFocus(store, 'address')

		expect(addressFocus.getData('city')).toEqual('New York')
	})

	it('allows to get nested data using a selector', () => {
		const store = createStore({ name: 'John', address: { city: 'New York' } })
		const addressFocus = createFocus(store, 'address')

		expect(addressFocus.getData((data: any) => data.city)).toEqual('New York')
	})

	it('allows a focused store data to be updated', () => {
		const store = createStore({ name: 'John', address: { city: 'New York' } })
		const nameFocus = createFocus(store, 'name')
		const addressFocus = createFocus(store, 'address')

		nameFocus.setData('Jane')
		addressFocus.setData({ city: 'Paris' })

		expect(store.getData()).toEqual({ name: 'Jane', address: { city: 'Paris' } })
	})

	it('allows to update a key on a focused store object', () => {
		const store = createStore({ name: 'John', address: { city: 'New York' } })
		const addressFocus = createFocus(store, 'address')

		addressFocus.setData('city', 'Paris')

		expect(store.getData()).toEqual({ name: 'John', address: { city: 'Paris' } })
	})

	it('allows to update a focused store object using a function', () => {
		const store = createStore({ name: 'John', address: { city: 'New York', street: 'Street Name 123' } })
		const addressFocus = createFocus(store, 'address')

		addressFocus.setData((address: any) => ({ ...address, city: 'Paris' }))

		expect(store.getData()).toEqual({ name: 'John', address: { street: 'Street Name 123', city: 'Paris' } })
	})

	it('allows to subscribe to the focused store', () => {
		const store = createStore({ name: 'John', address: { city: 'New York' } })
		const addressFocus = createFocus(store, 'address')

		const listener = jest.fn(() => {
			expect(addressFocus.getData()).toEqual({ city: 'Paris' })
		})
		addressFocus.subscribe(listener)

		addressFocus.setData('city', 'Paris')

		expect(listener).toHaveBeenCalled()
	})

	it('should still call the store listeners when a focused field is updated', () => {
		const store = createStore({ name: 'John', address: { city: 'New York' } })
		const addressFocus = createFocus(store, 'address')

		const listener = jest.fn(() => {
			expect(store.getData()).toEqual({ name: 'John', address: { city: 'Paris' } })
		})
		store.subscribe(listener)

		addressFocus.setData('city', 'Paris')

		expect(listener).toHaveBeenCalled()
	})

	it('should allow focuses to be created recursively', () => {
		const store = createStore({ name: 'John', address: { city: 'New York' } })
		const addressFocus = createFocus(store, 'address')
		const cityFocus = createFocus(addressFocus, 'city')

		expect(cityFocus.getData()).toEqual('New York')

		cityFocus.setData('Paris')
		expect(store.getData()).toEqual({ name: 'John', address: { city: 'Paris' } })
	})
})
