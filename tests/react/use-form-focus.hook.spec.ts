import { act, renderHook } from '@testing-library/react'

import { useFormFocus } from '../../src/react/use-form-focus.hook'
import { useForm } from '../../src/react/use-form.hook'

type TestFormStateTodo = {
	completed?: string
	name: string
	id: number
}

type TestFormState = {
	foo: string
	baz: string
	num: number
	flag: boolean
	nest: {
		some: string
		tags: string[]
		todos?: TestFormStateTodo[]
	}
	todos: TestFormStateTodo[]
}

describe('useFormFocus', () => {
	it('allows to focus on a nested object using the useFormFocus hook', () => {
		function useNestedFormHookTest() {
			const [data, setData, form] = useForm<TestFormState>({})
			const [nestedData, setNestedData] = useFormFocus(form, 'nest')

			return { data, nestedData, setData, setNestedData }
		}

		const { result } = renderHook(() => useNestedFormHookTest())

		act(() => result.current.setNestedData('some', 'foo'))

		expect(result.current.nestedData).toEqual({ some: 'foo' })
		expect(result.current.data).toEqual({ nest: { some: 'foo' } })
		expect(result.current.data.nest).toBe(result.current.nestedData)
	})

	it('allows to reset the state of a nested object using the useNestedForm hook', () => {
		function useNestedFormHookTest() {
			const [data, setData, form] = useForm<TestFormState>({
				foo: 'foo',
				nest: {
					some: 'bar',
				},
			})
			const [nestedData, setNestedData] = useFormFocus(form, 'nest')

			return { data, nestedData, setData, setNestedData }
		}

		const { result } = renderHook(() => useNestedFormHookTest())

		act(() => result.current.setNestedData({ some: 'baz' }))

		expect(result.current.nestedData).toEqual({ some: 'baz' })
		expect(result.current.data).toEqual({ foo: 'foo', nest: { some: 'baz' } })
		expect(result.current.data.nest).toBe(result.current.nestedData)
	})

	it('should allow to focus on an item of an array of objects', () => {
		function useFormListHookTest() {
			const [data, setData, form] = useForm<TestFormState>({
				nest: {
					todos: [{ id: Math.random(), name: 'foo' }],
				},
			})

			const [todo, todoHandlers] = useFormFocus(form, 'nest.todos.0')

			return { data, todo, setData, todoHandlers }
		}

		const { result } = renderHook(() => useFormListHookTest())

		expect(result.current.todo).toHaveProperty('name', 'foo')
	})

	it('should allow to edit a focused item of an array of objects', () => {
		function useFormListHookTest() {
			const [data, setData, form] = useForm<TestFormState>({
				nest: {
					todos: [{ id: Math.random(), name: 'foo' }],
				},
			})

			const [todo, onChangeTodo] = useFormFocus(form, 'nest.todos.0')

			return { data, todo, setData, onChangeTodo }
		}

		const { result } = renderHook(() => useFormListHookTest())

		act(() => {
			result.current.onChangeTodo('name', 'bar')
			result.current.setData('nest.todos.0.completed', true)
		})

		expect(result.current.todo).toHaveProperty('name', 'bar')
		expect(result.current.data.nest.todos![0]).toHaveProperty('name', 'bar')
		expect(result.current.data.nest.todos![0]).toHaveProperty('completed', true)
	})
})
