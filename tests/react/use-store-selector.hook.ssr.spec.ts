/**
 * @jest-environment node
 */
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createSelector } from 'reselect'

import { createStore } from '../../src/create-store'
import { useStoreSelector } from '../../src/react/use-store-selector.hook'

describe('useStoreSelector (server rendering)', () => {
	it('renders using the server snapshot when rendered on the server', () => {
		const store = createStore({ name: 'John', address: { city: 'New York' } })
		const citySelector = createSelector(
			(data: any) => data.address.city,
			(city) => city.toUpperCase(),
		)

		function TestComponent() {
			const [city] = useStoreSelector(store, citySelector)
			return createElement('div', null, city)
		}

		const html = renderToString(createElement(TestComponent))

		expect(html).toContain('NEW YORK')
	})
})
