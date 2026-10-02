import { createStore } from '../../../src/create-store'
import { useStore } from '../../../src/react/use-store.hook'
import { ExternalIntent } from './external-intent'

export type Order = {
	id: string
	price: number
	customer: {
		name: string
		address: { street: { name: string; number: number }; city: string }
		notes?: { text: string }
	}
	lines: { sku: string; qty: number; price: { amount: number; currency: string }; tags: string[] }[]
	shipments: { carrier: string; parcels: { weight: number; items: { sku: string; qty: number }[] }[] }[]
	payment: { intent: ExternalIntent | null; history: ExternalIntent[] }
	metadata: Record<string, { value: string }>
	createdAt: Date
}

type Equal<A, B> = (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false
function expectType<T extends true>() {}

declare const order: Order
declare const i: number
declare const key: string

export const store = createStore(order)

store.setData(order)
store.setData((current) => ({ ...current, price: current.price + 1 }))
store.setData((current) => {
	current.price = 1
})

store.setData('price', 10)
store.setData('price', (price) => price + 1)
store.setData('customer.address.street.name', 'Main St')
store.setData('lines.0.price.amount', 3)
store.setData('lines.42.price.amount', 3)
store.setData('shipments.1.parcels.0.items.2.qty', (qty) => qty * 2)
store.setData('customer.notes.text', 'fragile')
store.setData('payment.intent.customer', null)
store.setData('payment.history.3.last_payment_error.charge.payment_intent', 'pi_123')
store.setData('metadata.anything.value', 'x')

store.setData('lines', i, 'price', 'amount', 3)
store.setData('lines', i, 'price.amount', (amount) => amount + 1)
store.setData('shipments', i, 'parcels', i, 'items', i, 'sku', 'abc')
store.setData('payment', 'history', i, 'customer.default_intent.charges.data', i, 'amount', 1)
store.setData('metadata', key, 'value', 'x')

const price = store.getData('price')
expectType<Equal<typeof price, number>>()
const city = store.getData('customer', 'address', 'city')
expectType<Equal<typeof city, string>>()
const line = store.getData('lines', i)
expectType<Equal<typeof line, Order['lines'][number]>>()
const streetNumber: number = store.getData('customer.address.street.number')
const amount: number = store.getData('lines', i, 'price.amount')
const qty: number = store.getData('shipments', i, 'parcels', i, 'items', i, 'qty')
const tags: string[] = store.getData('lines.0.tags')
const intentAmount: number | undefined = store.getData('payment.history', i, 'amount')
const total: number = store.getData((data) => data.price)

// @ts-expect-error
store.setData('customer.nope', 1)
// @ts-expect-error
store.setData('customer.address.street.name.length', 1)
// @ts-expect-error
store.setData('lines.first.sku', 'x')
// @ts-expect-error
store.setData('createdAt.getTime', 1)
// @ts-expect-error
store.setData('lines', i, 'nope', 1)
// @ts-expect-error
store.setData('payment', 'history', i, 'nope', 1)
// @ts-expect-error
store.setData('price', 'ten')
// @ts-expect-error
store.setData('lines', i, 'price', 'amount', 'ten')
// @ts-expect-error
store.setData({ id: 'only-id' })
// @ts-expect-error
store.getData('customer.nope')
// @ts-expect-error
store.getData('lines', i, 'nope')
// @ts-expect-error
const wrongType: string = store.getData('price')

export function useOrder() {
	const [data, setData] = useStore(order)

	setData('customer.address.city', 'Rome')
	setData('lines', i, 'qty', (qty) => qty + 1)
	// @ts-expect-error
	setData('lines', i, 'qty', 'many')

	return data
}
