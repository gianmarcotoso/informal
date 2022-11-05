import { createFocus } from '../src/create-focus'
import { createStore } from '../src/create-store'
import { createList } from '../src/create-list'

describe('createList', () => {
	it('allows to focus on an array within a store', () => {
		const store = createStore({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(store, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		expect(usersList.getItems()).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' },
		])
	})

	it('allows to focus on an array within a store and update the list', () => {
		const store = createStore({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(store, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		usersList.setItems([
			{ id: 1, name: 'Billy' },
			{ id: 2, name: 'Jack' },
			{ id: 3, name: 'Bob' },
		])

		expect(usersList.getItems()).toEqual([
			{ id: 1, name: 'Billy' },
			{ id: 2, name: 'Jack' },
			{ id: 3, name: 'Bob' },
		])
		expect(store.getData('users')).toEqual([
			{ id: 1, name: 'Billy' },
			{ id: 2, name: 'Jack' },
			{ id: 3, name: 'Bob' },
		])
	})

	it('allows the array to be the store root value', () => {
		const store = createStore([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' },
		])
		const usersList = createList(store, (user: any) => user.id)

		expect(usersList.getItems()).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' },
		])

		usersList.setItems([
			{ id: 1, name: 'Billy' },
			{ id: 2, name: 'Jack' },
			{ id: 3, name: 'Bob' },
		])

		expect(usersList.getItems()).toEqual([
			{ id: 1, name: 'Billy' },
			{ id: 2, name: 'Jack' },
			{ id: 3, name: 'Bob' },
		])

		expect(store.getData()).toEqual([
			{ id: 1, name: 'Billy' },
			{ id: 2, name: 'Jack' },
			{ id: 3, name: 'Bob' },
		])
	})

	it('allows to add an element to the array', () => {
		const store = createStore({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(store, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		usersList.addItem({ id: 3, name: 'Billy' })

		expect(usersList.getItems()).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' },
			{ id: 3, name: 'Billy' },
		])
	})

	it('allows to remove an element from the array', () => {
		const store = createStore({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(store, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		usersList.removeItem({ id: 2, name: 'Jane' })

		expect(usersList.getItems()).toEqual([{ id: 1, name: 'John' }])
	})

	it('allows to edit an item in the array by using a path', () => {
		const store = createStore({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(store, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		usersList.updateItem({ id: 2, name: 'Jane' }, 'name', 'Jack')

		expect(usersList.getItems()).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jack' },
		])
	})

	it('allows to replace an item in the array', () => {
		const store = createStore({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(store, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		usersList.updateItem({ id: 2, name: 'Jane' }, { name: 'Jack' })

		expect(usersList.getItems()).toEqual([{ id: 1, name: 'John' }, { name: 'Jack' }])
	})

	it('allows to edit an item in the array by using a function', () => {
		const store = createStore({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(store, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		usersList.updateItem({ id: 2, name: 'Jane' }, (user: any) => {
			user.name = 'Jack'
		})

		expect(usersList.getItems()).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jack' },
		])

		usersList.updateItem({ id: 2, name: 'Jack' }, 'name', (name: string) => {
			return name.toUpperCase()
		})

		expect(usersList.getItems()).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'JACK' },
		])
	})

	it('allows to create a list from an array of strings', () => {
		const store = createStore({
			users: ['John', 'Jane'],
		})
		const usersFocus = createFocus(store, 'users')
		const usersList = createList(usersFocus)

		expect(usersList.getItems()).toEqual(['John', 'Jane'])

		usersList.updateItem('Jane', 'Jack')

		expect(usersList.getItems()).toEqual(['John', 'Jack'])
	})
})
