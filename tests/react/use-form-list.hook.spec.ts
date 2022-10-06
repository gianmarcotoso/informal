import { act, renderHook } from '@testing-library/react'

import { createFocus } from '../../src/create-focus'
import { useFormList } from '../../src/react/use-form-list.hook'
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

describe('useFormList', () => {
	it('allows to focus on an array using the useFormList hook', () => {
		function useFormListHookTest() {
			const [data, setData, form] = useForm<TestFormState>({
				todos: [],
			})
			const todosFocus = createFocus(form, 'todos')
			const [todos, todosHandlers] = useFormList(todosFocus, (i: any) => i.id)

			return { data, todos, setData, todosHandlers }
		}

		const { result } = renderHook(() => useFormListHookTest())

		expect(result.current.todos).toHaveLength(0)
		expect(result.current.todos).toBe(result.current.data.todos)
	})

	it('allows to focus on an array even when the array has not yet been initialized', () => {
		function useFormListHookTest() {
			const [data, setData, form] = useForm<TestFormState>({})
			const todosFocus = createFocus(form, 'todos')
			const [todos, todosHandlers] = useFormList(todosFocus, (i: any) => i.id)

			return { data, todos, setData, todosHandlers }
		}

		const { result } = renderHook(() => useFormListHookTest())

		expect(result.current.todos).toHaveLength(0)
		expect(result.current.data.todos).toBeUndefined()
	})

	it('allows to add an item on a focused array', () => {
		function useFormListHookTest() {
			const [data, setData, form] = useForm<TestFormState>({
				todos: [],
			})
			const todosFocus = createFocus(form, 'todos')
			const [todos, todosHandlers] = useFormList(todosFocus, (i: any) => i.id)

			return { data, todos, setData, todosHandlers }
		}

		const { result } = renderHook(() => useFormListHookTest())

		act(() => result.current.todosHandlers.addItem({ id: 1, name: 'foo' }))

		expect(result.current.todos).toHaveLength(1)
		expect(result.current.todos[0]).toEqual({ id: 1, name: 'foo' })
	})

	it('allows to edit an item on a focused array', () => {
		function useFormListHookTest() {
			const [data, setData, form] = useForm<TestFormState>({
				todos: [
					{ id: 1, name: 'foo' },
					{ id: 2, name: 'bar' },
				],
			})
			const todosFocus = createFocus(form, 'todos')
			const [todos, todosHandlers] = useFormList(todosFocus, (i: any) => i.id)

			return { data, todos, setData, todosHandlers }
		}

		const { result } = renderHook(() => useFormListHookTest())

		act(() => result.current.todosHandlers.updateItem(result.current.todos[0], 'name', 'baz'))

		expect(result.current.todos).toHaveLength(2)
		expect(result.current.todos[0]).toEqual({ id: 1, name: 'baz' })
	})

	it('allows to remove an item on a focused array', () => {
		function useFormListHookTest() {
			const [data, setData, form] = useForm<TestFormState>({
				todos: [
					{ id: 1, name: 'foo' },
					{ id: 2, name: 'bar' },
				],
			})
			const todosFocus = createFocus(form, 'todos')
			const [todos, todosHandlers] = useFormList(todosFocus, (i: any) => i.id)

			return { data, todos, setData, todosHandlers }
		}

		const { result } = renderHook(() => useFormListHookTest())

		act(() => result.current.todosHandlers.removeItem(result.current.todos[0]))

		expect(result.current.todos).toHaveLength(1)
	})

	it('allows to add a value when the focused array contains strings', () => {
		function useFormListHookTest() {
			const [data, setData, form] = useForm<TestFormState>({
				nest: {
					tags: [],
				},
			})
			const tagsFocus = createFocus(form, 'nest.tags')
			const [tags, tagsHandlers] = useFormList(tagsFocus, (i: any) => i)

			return { data, tags, setData, tagsHandlers }
		}

		const { result } = renderHook(() => useFormListHookTest())

		act(() => result.current.tagsHandlers.addItem('foo'))

		expect(result.current.tags).toHaveLength(1)
		expect(result.current.tags[0]).toEqual('foo')
	})

	it('allows to replace a value on a focused nested array of objects', () => {
		function useFormListHookTest() {
			const [data, setData, form] = useForm<TestFormState>({
				nest: {
					todos: [
						{ id: 1, name: 'foo' },
						{ id: 2, name: 'bar' },
					],
				},
			})
			const todosFocus = createFocus(form, 'nest.todos')
			const [todos, todosHandlers] = useFormList(todosFocus, (i: any) => i.id)

			return { data, todos, setData, todosHandlers }
		}

		const { result } = renderHook(() => useFormListHookTest())

		act(() => result.current.todosHandlers.updateItem({ id: 1, name: 'bar' }, { id: 7, name: 'baz' }))

		expect(result.current.todos).toHaveLength(2)
		expect(result.current.todos[0]).toEqual({ id: 7, name: 'baz' })
	})

	it('does nothing when attempting to edit a non existing item', () => {
		function useFormListHookTest() {
			const [data, setData, form] = useForm<TestFormState>({
				todos: [
					{ id: 1, name: 'foo' },
					{ id: 2, name: 'bar' },
				],
			})
			const todosFocus = createFocus(form, 'todos')
			const [todos, todosHandlers] = useFormList(todosFocus, (i: any) => i.id)

			return { data, todos, setData, todosHandlers }
		}

		const { result } = renderHook(() => useFormListHookTest())

		act(() => result.current.todosHandlers.updateItem({ id: 3, name: 'baz' }, 'name', 'qux'))

		expect(result.current.todos).toHaveLength(2)
		expect(result.current.todos[0]).toEqual({ id: 1, name: 'foo' })
	})

	it('allows to remove a value on a focused nested array of strings', () => {
		function useFormListHookTest() {
			const [data, setData, form] = useForm<TestFormState>({
				nest: {
					tags: ['foo', 'bar'],
				},
			})
			const tagsFocus = createFocus(form, 'nest.tags')
			const [tags, tagsHandlers] = useFormList(tagsFocus)

			return { data, tags, setData, tagsHandlers }
		}

		const { result } = renderHook(() => useFormListHookTest())

		act(() => result.current.tagsHandlers.removeItem('foo'))

		expect(result.current.tags).toHaveLength(1)
		expect(result.current.tags[0]).toEqual('bar')
	})

	it('allows to remove a value on a focused nested array of objects', () => {
		function useFormListHookTest() {
			const [data, setData, form] = useForm<TestFormState>({
				nest: {
					todos: [
						{ id: 1, name: 'foo' },
						{ id: 2, name: 'bar' },
					],
				},
			})
			const todosFocus = createFocus(form, 'nest.todos')
			const [todos, todosHandlers] = useFormList(todosFocus, (i: any) => i.id)

			return { data, todos, setData, todosHandlers }
		}

		const { result } = renderHook(() => useFormListHookTest())

		act(() => result.current.todosHandlers.removeItem({ id: 1, name: 'foo' }))

		expect(result.current.todos).toHaveLength(1)
		expect(result.current.todos[0]).toEqual({ id: 2, name: 'bar' })
	})
})
