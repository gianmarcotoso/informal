import { renderHook } from '@testing-library/react'
import { createForm } from '../../src/create-form'
import { useFormSelector } from '../../src/react/use-form-selector.hook'
import { createSelector } from 'reselect'

describe('useFormSelector', () => {
	it('allows to access a form using a selector', () => {
		const { result } = renderHook(() => {
			const form = createForm({ name: 'John', address: { city: 'New York' } })
			const citySelector = createSelector(
				(data: any) => data.address.city,
				(city) => city.toUpperCase(),
			)
			return useFormSelector(form, citySelector)
		})

		expect(result.current[0]).toEqual('NEW YORK')
	})
})
