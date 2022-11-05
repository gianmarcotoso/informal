import { createStore } from '../src/create-store'

describe('createStore', () => {
	it('should create a store', () => {
		const store = createStore()

		expect(store).toBeDefined()
	})

	it('should allow to get data', () => {
		const store = createStore({ name: 'John' })

		expect(store.getData()).toEqual({ name: 'John' })
	})

	it('should allow to get data nested within the store', () => {
		const store = createStore({ name: 'John', address: { city: 'New York' } })

		expect(store.getData('address', 'city')).toEqual('New York')
	})

	it('should allow to use dot notation to get nested data within the store', () => {
		const store = createStore({ name: 'John', address: { city: 'New York' } })

		expect(store.getData('address.city')).toEqual('New York')
	})

	it('should support numbers to reference elements at a specific index within an array', () => {
		const store = createStore({
			name: 'John',
			address: { city: 'New York' },
			todos: [{ id: 1, title: 'Buy food' }],
		})

		expect(store.getData('todos.0.title')).toEqual('Buy food')
	})

	it('should support mixing path elements and dot notation', () => {
		const store = createStore({
			name: 'John',
			address: { city: 'New York' },
			todos: [{ id: 1, title: 'Buy food' }],
		})

		expect(store.getData('todos', '0.title')).toEqual('Buy food')
	})

	it('should allow to get data using a selector', () => {
		const store = createStore({ name: 'John', address: { city: 'New York' } })

		expect(store.getData((data) => data.address.city)).toEqual('New York')
	})

	it('should allow to set data', () => {
		const store = createStore({ name: 'John' })

		store.setData({ name: 'Jane' })

		expect(store.getData()).toEqual({ name: 'Jane' })
	})

	it('should allow to set data using a producer function', () => {
		const store = createStore({ name: 'John' })

		store.setData((data: any) => ({ name: 'Jane' }))

		expect(store.getData()).toEqual({ name: 'Jane' })
	})

	it('should allow to set data on a specific path', () => {
		const store = createStore({ user: { name: 'John' } })

		store.setData('user', { name: 'Jane' })
		expect(store.getData()).toEqual({ user: { name: 'Jane' } })

		store.setData('user.name', 'Billy')
		expect(store.getData()).toEqual({ user: { name: 'Billy' } })

		store.setData('user', 'name', 'Bob')
		expect(store.getData()).toEqual({ user: { name: 'Bob' } })
	})

	it('should replace data when setting on a specific key', () => {
		const store = createStore({ user: { name: 'John' } })

		store.setData('user.age', 25)
		expect(store.getData()).toEqual({ user: { name: 'John', age: 25 } })

		store.setData('user', { age: 30 })
		expect(store.getData()).toEqual({ user: { age: 30 } })
	})

	it('should support updating elements of an array', () => {
		const store = createStore({ users: [{ name: 'John' }, { name: 'Jane' }] })

		store.setData('users.0.name', 'Billy')
		expect(store.getData()).toEqual({ users: [{ name: 'Billy' }, { name: 'Jane' }] })

		store.setData('users.1.name', 'Bob')
		expect(store.getData()).toEqual({ users: [{ name: 'Billy' }, { name: 'Bob' }] })
	})

	it('should allow to update data by using a function', () => {
		const store = createStore({ user: { name: 'John' } })

		store.setData('user.name', (name: string) => name.toUpperCase())
		expect(store.getData()).toEqual({ user: { name: 'JOHN' } })

		store.setData('user', (user: any) => {
			return {
				...user,
				age: 33,
			}
		})
		expect(store.getData()).toEqual({ user: { name: 'JOHN', age: 33 } })

		store.setData((data: any) => {
			data.friends = ['Jane', 'Billy']
		})
		expect(store.getData()).toEqual({ user: { name: 'JOHN', age: 33 }, friends: ['Jane', 'Billy'] })
	})

	it('should notify all listeners when the store changes', () => {
		const store = createStore({ name: 'John' })
		const listener = jest.fn()
		const listener2 = jest.fn()

		store.subscribe(listener)
		store.subscribe(listener2)

		store.setData({ name: 'Jane' })

		expect(listener).toHaveBeenCalled()
		expect(listener2).toHaveBeenCalled()
	})

	it('a listener should be able to call getData to get a fresh version of the store', () => {
		const store = createStore({ name: 'John' })
		const listener = jest.fn(() => {
			expect(store.getData()).toEqual({ name: 'Jane' })
		})

		store.subscribe(listener)

		store.setData({ name: 'Jane' })

		expect(listener).toHaveBeenCalled()
	})

	it('a listener should no longer be called after being unsubscribed', () => {
		const store = createStore({ name: 'John' })
		const listener = jest.fn()

		const unsubscribe = store.subscribe(listener)

		store.setData({ name: 'Jane' })

		expect(listener).toHaveBeenCalled()

		unsubscribe()

		store.setData({ name: 'Billy' })

		expect(listener).toHaveBeenCalledTimes(1)
	})

	it('applies the middleware on the initial value', () => {
		const middleware = jest.fn((data: any) => {
			return {
				...data,
				version: 2,
			}
		})
		const store = createStore({ name: 'John' }, middleware as any)

		expect(middleware).toHaveBeenCalled()
		expect(store.getData()).toEqual({ name: 'John', version: 2 })
	})

	it('applies the middleware after a value is updated', () => {
		const middleware = jest.fn((data: any) => {
			return {
				...data,
				version: 2,
			}
		})
		const store = createStore({ name: 'John' }, middleware as any)

		store.setData({ name: 'Jane' })

		expect(middleware).toHaveBeenCalled()
		expect(store.getData()).toEqual({ name: 'Jane', version: 2 })
	})

	it('applies the middleware after a value is updated (using immer)', () => {
		const middleware = jest.fn((data: any) => {
			data.name = data.name.toUpperCase()
		})
		const store = createStore({ name: 'John' }, middleware as any)

		store.setData({ name: 'Jane' })

		expect(middleware).toHaveBeenCalled()
		expect(store.getData()).toEqual({ name: 'JANE' })
	})

	it('should support an array as content for the store, instead of an object', () => {
		const store = createStore(['John', 'Jane'])

		expect(store.getData()).toEqual(['John', 'Jane'])
		expect(store.getData(0)).toEqual('John')

		store.setData(['Billy', 'Bob'])

		expect(store.getData()).toEqual(['Billy', 'Bob'])
	})

	it('should support a primitive type such as a string as the content for the store, instead of an object', () => {
		const store = createStore('John')

		expect(store.getData()).toEqual('John')

		store.setData('Jane')

		expect(store.getData()).toEqual('Jane')
	})

	it('should update values correctly with subsequent fast updates', () => {
		const store = createStore({ number: 0 })

		for (let i = 0; i < 100; i++) {
			store.setData({ number: i })
		}

		expect(store.getData()).toEqual({ number: 99 })

		store.setData({ number: 0 })
		for (let i = 0; i < 100; i++) {
			store.setData('number', (n: number) => n + 1)
		}

		expect(store.getData()).toEqual({ number: 100 })

		store.setData({ number: 0 })
		for (let i = 0; i < 100; i++) {
			store.setData((data: any) => {
				data.number++
			})
		}

		expect(store.getData()).toEqual({ number: 100 })
	})
})
