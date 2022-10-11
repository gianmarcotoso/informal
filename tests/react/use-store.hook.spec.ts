import { act, renderHook } from '@testing-library/react'

import { useStore } from '../../src/react/use-store.hook'
import { DeepPartial } from '../../src/types'

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

describe('use-form.hook', () => {
	it('initializes an empty state', () => {
		const { result } = renderHook(() => useStore<TestStoreState>({}))

		expect(result.current[0]).toEqual({})
	})

	it('initializes an empty state even when no initial value is provided', () => {
		const { result } = renderHook(() => useStore<TestStoreState>())

		expect(result.current[0]).toEqual({})
	})

	it('empties the state to a null value when null is passed to the setter function', () => {
		const { result } = renderHook(() => useStore<TestStoreState>({}))
		const [, setData] = result.current

		act(() => {
			setData(null)
		})

		expect(result.current[0]).toEqual(null)
	})

	it('updates the state when the setter function is called with a delta object', () => {
		const { result } = renderHook(() => useStore<TestStoreState>({}))
		const [, setData] = result.current

		act(() => setData({ foo: 'bar' }))

		expect(result.current[0]).toEqual({ foo: 'bar' })
	})

	it('updates a specific property when the setter function is called with a key and a new value for that key', () => {
		const { result } = renderHook(() => useStore<TestStoreState>({}))
		const [, setData] = result.current

		act(() => setData('foo', 'bar'))

		expect(result.current[0]).toEqual({ foo: 'bar' })
	})

	it('applies the middleware function passed to as the second parameter of the hook', () => {
		const middleware = (data: DeepPartial<TestStoreState>) => {
			data.baz = 'qux'

			return data
		}
		const { result } = renderHook(() => useStore<TestStoreState>({}, middleware as any))

		expect(result.current[0].baz).toBe('qux')
	})

	it('applies the middleware on every update', () => {
		const middleware = (data: TestStoreState) => {
			data.baz = 'qux'
			data.num! += 1

			return data
		}
		const { result } = renderHook(() => useStore<TestStoreState>({ num: 0 }, middleware))

		act(() => {
			result.current[1]('foo', 'bar')
			result.current[1]('baz', 'lol')
		})

		expect(result.current[0].baz).toBe('qux')
		expect(result.current[0].num).toBe(3)
	})

	it('updates the value of a nested record when its key is passed using dot notation', () => {
		const { result } = renderHook(() => useStore<TestStoreState>({}))
		const [, setData] = result.current

		act(() => setData('nest.some', 'foo'))

		expect(result.current[0].nest).toEqual({ some: 'foo' })
	})

	it('should not mutate nested objects within the source object when replacing the state', () => {
		function useStoreListHookTest() {
			const [data, setData] = useStore<TestStoreState>({})

			return { data, setData }
		}

		const originalObject: Partial<TestStoreState> = {
			nest: {
				some: 'billy',
				tags: ['foo'],
			},
		}

		const { result } = renderHook(() => useStoreListHookTest())

		act(() => result.current.setData(originalObject))
		act(() => result.current.setData('nest.some', 'hello'))

		expect(result.current.data.nest.some).toEqual('hello')
		expect(originalObject.nest!.some).toEqual('billy')
	})
})
