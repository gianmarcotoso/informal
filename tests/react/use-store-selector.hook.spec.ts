import { renderHook } from '@testing-library/react'
import { createStore } from '../../src/create-store'
import { useStoreSelector } from '../../src/react/use-store-selector.hook'
import { createSelector } from 'reselect'

describe('useStoreSelector', () => {
	it('allows to access a form using a selector', () => {
		const { result } = renderHook(() => {
			const form = createStore({ name: 'John', address: { city: 'New York' } })
			const citySelector = createSelector(
				(data: any) => data.address.city,
				(city) => city.toUpperCase(),
			)
			return useStoreSelector(form, citySelector)
		})

		expect(result.current[0]).toEqual('NEW YORK')
	})
})
