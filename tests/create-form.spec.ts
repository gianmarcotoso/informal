import { createForm } from '../src/create-form'

describe('createForm', () => {
	it('should create a form', () => {
		const form = createForm()

		expect(form).toBeDefined()
	})

	it('should allow to get data', () => {
		const form = createForm({ name: 'John' })

		expect(form.getData()).toEqual({ name: 'John' })
	})

	it('should allow to set data', () => {
		const form = createForm({ name: 'John' })

		form.setData({ name: 'Jane' })

		expect(form.getData()).toEqual({ name: 'Jane' })
	})

	it('should allow to set data on a specific path', () => {
		const form = createForm({ user: { name: 'John' } })

		form.setData('user', { name: 'Jane' })
		expect(form.getData()).toEqual({ user: { name: 'Jane' } })

		form.setData('user.name', 'Billy')
		expect(form.getData()).toEqual({ user: { name: 'Billy' } })

		form.setData('user', 'name', 'Bob')
		expect(form.getData()).toEqual({ user: { name: 'Bob' } })
	})

	it('should replace data when setting on a specific key', () => {
		const form = createForm({ user: { name: 'John' } })

		form.setData('user.age', 25)
		expect(form.getData()).toEqual({ user: { name: 'John', age: 25 } })

		form.setData('user', { age: 30 })
		expect(form.getData()).toEqual({ user: { age: 30 } })
	})

	it('should support updating elements of an array', () => {
		const form = createForm({ users: [{ name: 'John' }, { name: 'Jane' }] })

		form.setData('users.0.name', 'Billy')
		expect(form.getData()).toEqual({ users: [{ name: 'Billy' }, { name: 'Jane' }] })

		form.setData('users.1.name', 'Bob')
		expect(form.getData()).toEqual({ users: [{ name: 'Billy' }, { name: 'Bob' }] })
	})

	it('should allow to update data by using a function', () => {
		const form = createForm({ user: { name: 'John' } })

		form.setData('user.name', (name: string) => name.toUpperCase())
		expect(form.getData()).toEqual({ user: { name: 'JOHN' } })

		form.setData('user', (user: any) => {
			return {
				...user,
				age: 33,
			}
		})
		expect(form.getData()).toEqual({ user: { name: 'JOHN', age: 33 } })

		form.setData((data: any) => {
			data.friends = ['Jane', 'Billy']
		})
		expect(form.getData()).toEqual({ user: { name: 'JOHN', age: 33 }, friends: ['Jane', 'Billy'] })
	})

	it('should notify all listeners when the form changes', () => {
		const form = createForm({ name: 'John' })
		const listener = jest.fn()

		form.subscribe(listener)

		form.setData({ name: 'Jane' })

		expect(listener).toHaveBeenCalled()
	})
})
