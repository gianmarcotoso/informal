import { createFocus } from '../src/create-focus'
import { createForm } from '../src/create-form'
import { createList } from '../src/create-list'

describe('createList', () => {
	it('allows to focus on an array within a form', () => {
		const form = createForm({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(form, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		expect(usersList.getList()).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' },
		])
	})

	it('allows to focus on an array within a form and update the list', () => {
		const form = createForm({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(form, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		usersList.setList([
			{ id: 1, name: 'Billy' },
			{ id: 2, name: 'Jack' },
			{ id: 3, name: 'Bob' },
		])

		expect(usersList.getList()).toEqual([
			{ id: 1, name: 'Billy' },
			{ id: 2, name: 'Jack' },
			{ id: 3, name: 'Bob' },
		])
		expect(form.getData('users')).toEqual([
			{ id: 1, name: 'Billy' },
			{ id: 2, name: 'Jack' },
			{ id: 3, name: 'Bob' },
		])
	})

	it('allows the array to be the form root value', () => {
		const form = createForm([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' },
		])
		const usersList = createList(form, (user: any) => user.id)

		expect(usersList.getList()).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' },
		])

		usersList.setList([
			{ id: 1, name: 'Billy' },
			{ id: 2, name: 'Jack' },
			{ id: 3, name: 'Bob' },
		])

		expect(usersList.getList()).toEqual([
			{ id: 1, name: 'Billy' },
			{ id: 2, name: 'Jack' },
			{ id: 3, name: 'Bob' },
		])

		expect(form.getData()).toEqual([
			{ id: 1, name: 'Billy' },
			{ id: 2, name: 'Jack' },
			{ id: 3, name: 'Bob' },
		])
	})

	it('allows to add an element to the array', () => {
		const form = createForm({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(form, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		usersList.addItem({ id: 3, name: 'Billy' })

		expect(usersList.getList()).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' },
			{ id: 3, name: 'Billy' },
		])
	})

	it('allows to remove an element from the array', () => {
		const form = createForm({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(form, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		usersList.removeItem({ id: 2, name: 'Jane' })

		expect(usersList.getList()).toEqual([{ id: 1, name: 'John' }])
	})

	it('allows to edit an item in the array by using a path', () => {
		const form = createForm({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(form, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		usersList.updateItem({ id: 2, name: 'Jane' }, 'name', 'Jack')

		expect(usersList.getList()).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jack' },
		])
	})

	it('allows to replace an item in the array', () => {
		const form = createForm({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(form, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		usersList.updateItem({ id: 2, name: 'Jane' }, { name: 'Jack' })

		expect(usersList.getList()).toEqual([{ id: 1, name: 'John' }, { name: 'Jack' }])
	})

	it('allows to edit an item in the array by using a function', () => {
		const form = createForm({
			users: [
				{ id: 1, name: 'John' },
				{ id: 2, name: 'Jane' },
			],
		})
		const usersFocus = createFocus(form, 'users')
		const usersList = createList(usersFocus, (user: any) => user.id)

		usersList.updateItem({ id: 2, name: 'Jane' }, (user: any) => {
			user.name = 'Jack'
		})

		expect(usersList.getList()).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jack' },
		])

		usersList.updateItem({ id: 2, name: 'Jack' }, 'name', (name: string) => {
			return name.toUpperCase()
		})

		expect(usersList.getList()).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'JACK' },
		])
	})

	it('allows to create a list from an array of strings', () => {
		const form = createForm({
			users: ['John', 'Jane'],
		})
		const usersFocus = createFocus(form, 'users')
		const usersList = createList(usersFocus)

		expect(usersList.getList()).toEqual(['John', 'Jane'])

		usersList.updateItem('Jane', 'Jack')

		expect(usersList.getList()).toEqual(['John', 'Jack'])
	})
})
