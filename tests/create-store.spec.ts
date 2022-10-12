import { createStore } from '../src/create-store'

describe('createStore', () => {
	it('should create a form', () => {
		const form = createStore()

		expect(form).toBeDefined()
	})

	it('should allow to get data', () => {
		const form = createStore({ name: 'John' })

		expect(form.getData()).toEqual({ name: 'John' })
	})

	it('should allow to get data nested within the form', () => {
		const form = createStore({ name: 'John', address: { city: 'New York' } })

		expect(form.getData('address', 'city')).toEqual('New York')
	})

	it('should allow to use dot notation to get nested data within the form', () => {
		const form = createStore({ name: 'John', address: { city: 'New York' } })

		expect(form.getData('address.city')).toEqual('New York')
	})

	it('should support numbers to reference elements at a specific index within an array', () => {
		const form = createStore({ name: 'John', address: { city: 'New York' }, todos: [{ id: 1, title: 'Buy food' }] })

		expect(form.getData('todos.0.title')).toEqual('Buy food')
	})

	it('should support mixing path elements and dot notation', () => {
		const form = createStore({ name: 'John', address: { city: 'New York' }, todos: [{ id: 1, title: 'Buy food' }] })

		expect(form.getData('todos', '0.title')).toEqual('Buy food')
	})

	it('should allow to get data using a selector', () => {
		const form = createStore({ name: 'John', address: { city: 'New York' } })

		expect(form.getData((data) => data.address.city)).toEqual('New York')
	})

	it('should allow to set data', () => {
		const form = createStore({ name: 'John' })

		form.setData({ name: 'Jane' })

		expect(form.getData()).toEqual({ name: 'Jane' })
	})

	it('should allow to set data using a producer function', () => {
		const form = createStore({ name: 'John' })

		form.setData((data: any) => ({ name: 'Jane' }))

		expect(form.getData()).toEqual({ name: 'Jane' })
	})

	it('should allow to set data on a specific path', () => {
		const form = createStore({ user: { name: 'John' } })

		form.setData('user', { name: 'Jane' })
		expect(form.getData()).toEqual({ user: { name: 'Jane' } })

		form.setData('user.name', 'Billy')
		expect(form.getData()).toEqual({ user: { name: 'Billy' } })

		form.setData('user', 'name', 'Bob')
		expect(form.getData()).toEqual({ user: { name: 'Bob' } })
	})

	it('should replace data when setting on a specific key', () => {
		const form = createStore({ user: { name: 'John' } })

		form.setData('user.age', 25)
		expect(form.getData()).toEqual({ user: { name: 'John', age: 25 } })

		form.setData('user', { age: 30 })
		expect(form.getData()).toEqual({ user: { age: 30 } })
	})

	it('should support updating elements of an array', () => {
		const form = createStore({ users: [{ name: 'John' }, { name: 'Jane' }] })

		form.setData('users.0.name', 'Billy')
		expect(form.getData()).toEqual({ users: [{ name: 'Billy' }, { name: 'Jane' }] })

		form.setData('users.1.name', 'Bob')
		expect(form.getData()).toEqual({ users: [{ name: 'Billy' }, { name: 'Bob' }] })
	})

	it('should allow to update data by using a function', () => {
		const form = createStore({ user: { name: 'John' } })

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
		const form = createStore({ name: 'John' })
		const listener = jest.fn()
		const listener2 = jest.fn()

		form.subscribe(listener)
		form.subscribe(listener2)

		form.setData({ name: 'Jane' })

		expect(listener).toHaveBeenCalled()
		expect(listener2).toHaveBeenCalled()
	})

	it('a listener should be able to call getData to get a fresh version of the form', () => {
		const form = createStore({ name: 'John' })
		const listener = jest.fn(() => {
			expect(form.getData()).toEqual({ name: 'Jane' })
		})

		form.subscribe(listener)

		form.setData({ name: 'Jane' })

		expect(listener).toHaveBeenCalled()
	})

	it('a listener should no longer be called after being unsubscribed', () => {
		const form = createStore({ name: 'John' })
		const listener = jest.fn()

		const unsubscribe = form.subscribe(listener)

		form.setData({ name: 'Jane' })

		expect(listener).toHaveBeenCalled()

		unsubscribe()

		form.setData({ name: 'Billy' })

		expect(listener).toHaveBeenCalledTimes(1)
	})

	it('applies the middleware on the initial value', () => {
		const middleware = jest.fn((data: any) => {
			return {
				...data,
				version: 2,
			}
		})
		const form = createStore({ name: 'John' }, middleware as any)

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
		const form = createStore({ name: 'John' }, middleware as any)

		form.setData({ name: 'Jane' })

		expect(middleware).toHaveBeenCalled()
		expect(form.getData()).toEqual({ name: 'Jane', version: 2 })
	})

	it('applies the middleware after a value is updated (using immer)', () => {
		const middleware = jest.fn((data: any) => {
			data.name = data.name.toUpperCase()
		})
		const form = createStore({ name: 'John' }, middleware as any)

		form.setData({ name: 'Jane' })

		expect(middleware).toHaveBeenCalled()
		expect(form.getData()).toEqual({ name: 'JANE' })
	})

	it('should support an array as content for the form, instead of an object', () => {
		const form = createStore(['John', 'Jane'])

		expect(form.getData()).toEqual(['John', 'Jane'])
		expect(form.getData(0)).toEqual('John')

		form.setData(['Billy', 'Bob'])

		expect(form.getData()).toEqual(['Billy', 'Bob'])
	})

	it('should support a primitive type such as a string as the content for the form, instead of an object', () => {
		const form = createStore('John')

		expect(form.getData()).toEqual('John')

		form.setData('Jane')

		expect(form.getData()).toEqual('Jane')
	})

	it('should update values correctly with subsequent fast updates', () => {
		const form = createStore({ number: 0 })

		for (let i = 0; i < 100; i++) {
			form.setData({ number: i })
		}

		expect(form.getData()).toEqual({ number: 99 })

		form.setData({ number: 0 })
		for (let i = 0; i < 100; i++) {
			form.setData('number', (n: number) => n + 1)
		}

		expect(form.getData()).toEqual({ number: 100 })

		form.setData({ number: 0 })
		for (let i = 0; i < 100; i++) {
			form.setData((data: any) => {
				data.number++
			})
		}

		expect(form.getData()).toEqual({ number: 100 })
	})
})
