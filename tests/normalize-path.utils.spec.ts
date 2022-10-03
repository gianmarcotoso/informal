import { normalizePath } from '../src/normalize-path.util'

describe('normalizePath', () => {
	it('normalizes a path to an array of strings', () => {
		expect(normalizePath('user.name')).toEqual(['user', 'name'])
	})

	it('normalizes multiple strings to an array of strings', () => {
		expect(normalizePath('user', 'name')).toEqual(['user', 'name'])
	})

	it('handles numbers in paths as indexes', () => {
		expect(normalizePath('users.0.name')).toEqual(['users', 0, 'name'])
	})

	it('handles mixed paths', () => {
		expect(normalizePath('users.0', 'name')).toEqual(['users', 0, 'name'])
	})

	it('handles empty paths', () => {
		expect(normalizePath()).toEqual([])
	})
})
