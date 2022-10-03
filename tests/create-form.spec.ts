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

	it('a listener should be able to call getData to get a fresh version of the form', () => {
		const form = createForm({ name: 'John' })
		const listener = jest.fn(() => {
			expect(form.getData()).toEqual({ name: 'Jane' })
		})

		form.subscribe(listener)

		form.setData({ name: 'Jane' })

		expect(listener).toHaveBeenCalled()
	})

	it('applies the middleware on the initial value', () => {
		const middleware = jest.fn((data: any) => {
			return {
				...data,
				version: 2,
			}
		})
		const form = createForm({ name: 'John' }, middleware as any)

		expect(middleware).toHaveBeenCalled()
		expect(form.getData()).toEqual({ name: 'John', version: 2 })
	})

	it('applies the middleware after a value is updated', () => {
		const middleware = jest.fn((data: any) => {
			return {
				...data,
				version: 2,
			}
		})
		const form = createForm({ name: 'John' }, middleware as any)

		form.setData({ name: 'Jane' })

		expect(middleware).toHaveBeenCalled()
		expect(form.getData()).toEqual({ name: 'Jane', version: 2 })
	})

	it('applies the middleware after a value is updated (using immer)', () => {
		const middleware = jest.fn((data: any) => {
			data.name = data.name.toUpperCase()
		})
		const form = createForm({ name: 'John' }, middleware as any)

		form.setData({ name: 'Jane' })

		expect(middleware).toHaveBeenCalled()
		expect(form.getData()).toEqual({ name: 'JANE' })
	})
})
