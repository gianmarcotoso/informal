import { act, renderHook } from '@testing-library/react'

import { useStoreFocus } from '../../src/react/use-store-focus.hook'
import { useStore } from '../../src/react/use-store.hook'

type TestStoreStateTodo = {
	completed?: string
	name: string
	id: number
}

type TestStoreState = {
	foo: string
	baz: string
	num: number
	flag: boolean
	nest: {
		some: string
		tags: string[]
		todos?: TestStoreStateTodo[]
	}
	todos: TestStoreStateTodo[]
}

describe('useStoreFocus', () => {
	it('allows to focus on a nested object using the useStoreFocus hook', () => {
		function useNestedStoreHookTest() {
			const [data, setData, store] = useStore<Partial<TestStoreState>>({})
			const [nestedData, setNestedData] = useStoreFocus(store, 'nest')

			return { data, nestedData, setData, setNestedData }
		}

		const { result } = renderHook(() => useNestedStoreHookTest())

		act(() => result.current.setNestedData('some', 'foo'))

		expect(result.current.nestedData).toEqual({ some: 'foo' })
		expect(result.current.data).toEqual({ nest: { some: 'foo' } })
		expect(result.current.data.nest).toBe(result.current.nestedData)
	})

	it('allows to reset the state of a nested object using the useNestedStore hook', () => {
		function useNestedStoreHookTest() {
			const [data, setData, store] = useStore<Partial<TestStoreState>>({
				foo: 'foo',
				nest: {
					some: 'bar',
					tags: ['foo', 'bar'],
				},
			})
			const [nestedData, setNestedData] = useStoreFocus(store, 'nest')

			return { data, nestedData, setData, setNestedData }
		}

		const { result } = renderHook(() => useNestedStoreHookTest())

		act(() => result.current.setNestedData({ some: 'baz' }))

		expect(result.current.nestedData).toEqual({ some: 'baz' })
		expect(result.current.data).toEqual({ foo: 'foo', nest: { some: 'baz' } })
		expect(result.current.data.nest).toBe(result.current.nestedData)
	})

	it('should allow to focus on an item of an array of objects', () => {
		function useStoreListHookTest() {
			const [data, setData, store] = useStore<Partial<TestStoreState>>({
				nest: {
					todos: [{ id: Math.random(), name: 'foo' }],
					some: 'bar',
					tags: ['foo', 'bar'],
				},
			})

			const [todo, todoHandlers] = useStoreFocus(store, 'nest.todos.0')

			return { data, todo, setData, todoHandlers }
		}

		const { result } = renderHook(() => useStoreListHookTest())

		expect(result.current.todo).toHaveProperty('name', 'foo')
	})

	it('should allow to edit a focused item of an array of objects', () => {
		function useStoreListHookTest() {
			const [data, setData, store] = useStore<Partial<TestStoreState>>({
				nest: {
					todos: [{ id: Math.random(), name: 'foo' }],
					some: 'bar',
					tags: ['foo', 'bar'],
				},
			})

			const [todo, onChangeTodo] = useStoreFocus(store, 'nest.todos.0')

			return { data, todo, setData, onChangeTodo }
		}

		const { result } = renderHook(() => useStoreListHookTest())

		act(() => {
			result.current.onChangeTodo('name', 'bar')
			result.current.setData('nest.todos.0.completed', true)
		})

		expect(result.current.todo).toHaveProperty('name', 'bar')
		expect(result.current.data.nest!.todos![0]).toHaveProperty('name', 'bar')
		expect(result.current.data.nest!.todos![0]).toHaveProperty('completed', true)
	})
})
