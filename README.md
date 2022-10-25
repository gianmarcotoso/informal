# Informal

A UI agnostic library for handling local transient state. Written in VanillaJS with builtin React bindings - an evolution of
`use-form` (https://github.com/gianmarcotoso/use-form).

## Installation

```bash
npm install @polaritybit/informal
```

## Usage (VanillaJS)

To create a new store instance, use the `createStore` function:

```js
import { createStore } from '@polaritybit/informal'

const store = createStore({
	name: 'Jimmy Doe',
	age: 33,
})
```

The store instance exposes the `getData`, `setData` and `subscribe` methods.

### `getData`

`getData` can be used at any time to get the current store data.

```js
const store = createStore({
	name: 'Jimmy Doe',
	age: 33,
})

const data = store.getData()
console.log(data)

// {
//     name: 'Jimmy Doe',
//     age: 33,
// }
```

While `getData` returns a reference to the internal state tracked by the store, you should _never_ mutate it directly. Instead, you should always use the `setData` function.

`getData` can also be used to get a reference to a specific field:

```js
const store = createStore({
	name: 'Jimmy Doe',
	age: 33,
})

const name = store.getData('name')
console.log(name) // 'Jimmy Doe'
```

If the store is tracking an object with nested fields, you can pass each key of the path as a separate parameter to `getData`:

```js
const store = createStore({
	name: 'Jimmy Doe',
	age: 33,
	address: {
		street: '123 Main St',
		city: 'New York',
	},
})

const street = store.getData('address', 'street')
console.log(street) // '123 Main St'
```

Dot notation is also supported:

```js
const street = store.getData('address.street')
console.log(street) // '123 Main St'
```

Dot notation and path keys can also be mixed:

```js
const store = createStore({
	name: 'Jimmy Doe',
	age: 33,
	address: {
		street: '123 Main St',
		city: 'New York',
		apartment: {
			number: 6,
			floor: 2,
		},
	},
})

const floor = store.getData('address', 'apartment.floor')
console.log(floor) // 2
```

Both path keys and dot notation support indexes to reference array elements:

```js
const store = createStore({
	people: [
		{ name: 'Jimmy Doe', age: 33, address: { city: 'New York' } },
		{ name: 'Jane Doe', age: 31 },
	],
})

const jane = store.getData('people', 1)
console.log(jane) // { name: 'Jane Doe', age: 31 }

const janeAge = store.getData('people', 1, 'age')
console.log(janeAge) // 31

const jimmyCity = store.getData('people.0.address.city')
console.log(jimmyCity) // 'New York'
```

`getData` also supports accessing data through a selector function:

```js
const store = createStore({
	name: 'Jimmy Doe',
	age: 33,
	address: {
		street: '123 Main St',
		city: 'New York',
		apartment: {
			number: 6,
			floor: 2,
		},
	},
})

const floor = store.getData((data) => data.address.apartment.floor)
console.log(floor) // 2
```

### `setData`

`setData` updates the current data tracked by the store.

When calling `setData` with a single parameter, it completely replaces the content of the store:

```js
const store = createStore({
	name: 'Jimmy Doe',
	age: 33,
})

store.setData({ name: 'Jane Doe' })

const data = store.getData()
console.log(data)

// {
//     name: 'Jane Doe',
// }
```

`setData` accepts a _producer_ callback, which receives the current value tracked
by the store and returns the new value.

```js
store.setData((data) => {
	return {
		...data,
		age: data.age + 1,
	}
})
```

A producer callback can also mutate the value of the store, as it uses [`immer`](https://github.com/immerjs/immer) internally:

```js
store.setData((data) => {
	data.age += 1
})
```

`setData` also supports updating inner fields by specifying their path as parameters, with the last parameter being the new value for that field:

```js
const store = createStore({
	name: 'Jimmy Doe',
	age: 33,
	address: {
		street: '123 Main St',
		city: 'New York',
	},
})

store.setData('age', 34)
store.setData('address', 'city', 'Los Angeles')
```

A producer function can also be used to _evolve_ the value of a field:

```js
store.setData('age', (age) => age + 1)
store.setData('address', 'city', (city) => city.toUpperCase())
```

Dot notation is also supported, and can be used to specify either a full path or a partial one:

```js
const store = createStore({
	name: 'Jimmy Doe',
	age: 33,
	address: {
		street: '123 Main St',
		city: 'New York',
		apartment: {
			number: 6,
			floor: 2,
		},
	},
})

store.setData('age', 34)
store.setData('address.city', (city) => city.toUpperCase())
store.setData('address', 'apartment.number', 7)
```

Elements within an array can also be updated by referencing them through their index:

```js
const store = createStore([
	{ name: 'Jimmy Doe', age: 33, address: { city: 'New York' } },
	{ name: 'Jane Doe', age: 31 },
])

store.setData(1, 'age', 34)
store.setData('0.address.city', (city) => city.toUpperCase())
```

### `subscribe`

`subscribe` allows you to subscribe to changes in the store data. It receives a callback that will be called every time any part of the store changes.

```js
const store = createStore({
	name: 'Jimmy Doe',
	age: 33,
})

const unsubscribe = store.subscribe(() => {
	console.log(store.getData())
})

store.setData('age', 34)
// The callback passed to subscribe is called

unsubscribe()
store.setData('age', 35)
// The callback is no longed called
```

### Creating a focus on the store

When dealing with large forms it can be useful to create a _focus_ on a specific part of the store. This allows you to create a store that only tracks a specific part of the data, and only updates that part when calling `setData`.

The `createFocus` function serves this purpose and can be called by passing it the source store and the path to the field that should be focused:

```js
import { createStore, createFocus } from '@polaritybit/informal'

const store = createStore({
	name: 'Jimmy Doe',
	age: 33,
	address: {
		street: '123 Main St',
		city: 'New York',
	},
})

const addressFocus = createFocus(store, 'address')
```

The object returned by `createFocus` has the same API as the `store` object, but it only tracks the part of the store it was focused on.

```js
addressFocus.getData('city') // 'New York'

addressFocus.subscribe(() => {
	console.log(addressFocus.getData())
})

addressFocus.setData('city', 'Los Angeles')
// The subscriber is called
```

Updating data on a focused portion of a store updates the main store, and calls all subscribers of both the store and the focused portion. Creating a focus _does not_ create a new version of the portion of the store that is being focused, but simply allows a more direct access to it.

`createFocus` can be used on both the main store and on other focused portions of the store:

```js
const store = createStore({
	name: 'Jimmy Doe',
	age: 33,
	address: {
		street: '123 Main St',
		city: 'New York',
	},
})

const addressFocus = createFocus(store, 'address')
const cityFocus = createFocus(addressFocus, 'city')

cityFocus.setData('Los Angeles')

store.getData('address.city') // 'Los Angeles'
```

### Handling lists

A store often tracks lists of data. The `createList` function provides an API to handle them. `createList` receives the store (or the focus) that contains the list, and an optional _identifier_ function that can be used to identify elements within the list.

```js
import { createStore, createFocus, createList } from '@polaritybit/informal'

const store = createStore({
	name: 'Jimmy Doe',
	age: 33,
	todos: [
		{ id: 1, text: 'Buy milk' },
		{ id: 2, text: 'Buy eggs' },
	],
})
const todosFocus = createFocus(store, 'todos')
const todosList = createList(todosFocus, (todo) => todo.id)
```

If not specified, the _identifier_ function is the identity function `item => item`. While this can work in some cases, it is recommended to provide a custom identifier function to avoid issues with duplicate elements in the list.

`createList` returns an object with methods to read and write on the list.

### `getItems`

`getItems` returns all the elements tracked by the list.

```js
todosList.getItems()
// [{ id: 1, text: 'Buy milk' }, { id: 2, text: 'Buy eggs' }]
```

### `setItems`

`setItems` replaces the list with a new one.

```js
todosList.setItems([])
todosList.getItems() // []
```

### `addItem`

`addItem` allows to add an item to the list:

```js
todosList.addItem({ id: 3, text: 'Buy bread' })
```

### `removeItem`

`removeItem` allows to remove an item from the list. It should receive a reference to the item that needs to be removed:

```js
const todos = todosList.getItems()
const itemToRemove = todos[0]

todosList.removeItem(itemToRemove)
```

### `updateItem`

`updateItem` allows to update an item in the list. It has the same API of the `setData` function, but receives a reference to the item that needs to be updated as the first parameter:

```js
const todos = todosList.getItems()

todos.updateItem(todos[0], 'text', 'Buy milk and eggs')
todos.updateItem(todos[0], (item) => {
	item.done = true
})

const updateFirstTodo = todos.updateItem.bind(undefined, todos[0])
updateFirstTodo('text', 'Buy milk and eggs')
```

### Middleware

A store can be created with an optional middleware function passed as a second parameter; this function will be invoked
after each update and _before_ notifying the subscribers. A middleware is a producer function that
receives the current value of the store and returns a new value that will be used as the new value of the store; since it
uses `immer` behind the scenes, the value of the tracked data can also be mutated directly.

```js
const store = createStore(
	{
		name: 'Jimmy',
		age: 33,
	},
	(value) => {
		value.name = value.name.toUpperCase()
	},
)

store.getData('name') // 'JIMMY'
store.setData('name', 'Bob')
store.getData('name') // 'BOB'
```

Please note that a store's middleware is always called, even if the update comes from a focused portion of the store or
a list handler.

## Usage with React

`informal` comes with React hooks that can be used instead of (or in addition to) the VanillaJS API.

### `useStore`

`useStore` creates a store and returns a tuple with the current store value, the `setData` function and a reference to the store itself:

```js
import { useStore } from '@polaritybit/informal/react'

function MyStore() {
	const [data, setData, store] = useStore({
		name: 'Jimmy Doe',
		age: 33,
	})

	function handleInputChange(event) {
		setData(event.target.name, event.target.value)
	}

	return (
		<form>
			<input name="name" type="text" value={data.name} onChange={handleInputChange} />
			<input name="age" type="number" value={data.age} onChange={handleInputChange} />
		</form>
	)
}
```

The `wrapHandler` function can be used to wrap the `setData` function in an event handler, making it easier to pass it to `onChange` events:

```js
import { wrapHandler } from '@polaritybit/informal'
import { useStore } from '@polaritybit/informal/react'

function MyStore() {
	const [data, setData, store] = useStore({
		name: 'Jimmy Doe',
		age: 33,
	})

	return (
		<form>
			<input name="name" type="text" value={data.name} onChange={wrapHandler(setData)} />
			<input name="age" type="number" value={data.age} onChange={wrapHandler(setData)} />
		</form>
	)
}
```

When dealing with nested fields, the `name` attribute of an input can be used to specify the path to the field:

```js
import { wrapHandler } from '@polaritybit/informal'
import { useStore } from '@polaritybit/informal/react'

function MyStore() {
	const [data, setData, store] = useStore({
		name: 'Jimmy Doe',
		age: 33,
		address: {
			street: '123 Main St',
			city: 'New York',
		},
	})

	return (
		<form>
			<input name="name" type="text" value={data.name} onChange={wrapHandler(setData)} />
			<input name="age" type="number" value={data.age} onChange={wrapHandler(setData)} />
			<input name="address.street" type="text" value={data.address.street} onChange={wrapHandler(setData)} />
			<input name="address.city" type="text" value={data.address.city} onChange={wrapHandler(setData)} />
		</form>
	)
}
```

Just as with `createStore`, `useStore` allows to pass a middleware function as a second parameter:

```js
const [data, setData, store] = useStore(
	{
		name: 'Jimmy Doe',
		age: 33,
	},
	(value) => {
		value.name = value.name.toUpperCase()
	},
)
```

### `useStoreFocus`

`useStoreFocus` creates a focus on a store (or another focus) and returns a tuple with the current focus value, the `setData` function and a reference to the focus itself:

```js
import { useStore, useStoreFocus } from '@polaritybit/informal/react'

function MyStore() {
	const [data, setData, store] = useStore({
		name: 'Jimmy Doe',
		age: 33,
		address: {
			street: '123 Main St',
			city: 'New York',
		},
	})

	const [address, setAddress, addressFocus] = useStoreFocus(store, 'address')

	return (
		<form>
			<input name="name" type="text" value={data.name} onChange={wrapHandler(setData)} />
			<input name="age" type="number" value={data.age} onChange={wrapHandler(setData)} />
			<input name="street" type="text" value={address.street} onChange={wrapHandler(setAddress)} />
			<input name="city" type="text" value={address.city} onChange={wrapHandler(setAddress)} />
		</form>
	)
}
```

### `useStoreList`

The `useStoreList` hook creates a list from a store (or a focus) and returns a tuple with the list and an object containing the methods to read and write on it:

```js
import { wrapHandler } from '@polaritybit/informal'
import { useStore, useStoreList } from '@polaritybit/informal/react'

function Todos() {
	const [todos, setTodos, todosStore] = useStore([])
	const [todosList, { setItems, addItem, removeItem, updateItem }] = useStoreList(todosStore, (i) => i.id)

	function handleAddItemStoreSubmit(e) {
		e.preventDefault()

		const title = e.target.elements.namedItem('title').value
		addItem({ id: Math.random(), title: title, done: false })
	}

	function handleResetItems() {
		setItems([])
	}

	return (
		<div>
			<store onSubmit={handleAddItemStoreSubmit}>
				<input name="title" type="text" />
				<button type="submit">Add</button>
			</form>
			<button onClick={handleResetItems}>Reset</button>
			<ul>
				{todosList.map((todo) => {
					const onEditTodo = wrapHandler(updateItem.bind(undefined, todo))
					const onRemoveTodo = () => removeItem(todo)

					return (
						<li key={todo.id}>
							<input name="done" type="checkbox" checked={todo.done} onChange={onEditTodo} />
							<input name="title" type="text" value={todo.title} onChange={onEditTodo} />
							<button onClick={onRemoveTodo}>Remove</button>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
```

### `useStoreSelector`

In some cases you want to create a store but use a more granular, per-element subscription to its data; this can be useful, for example, when dealing with large tables with many inputs, where subscribing to the whole store means re-rendering the whole table on every change.

The `useStoreSelector` hook comes in handy in these cases, as it allows you to create a subscription to a specific part of a store (or a focus) that is not directly tracked by React. It receives the store (or the focus) on which to subscribe, and the selector that will be used to extract the data from the store. It returns a tuple with the current value of the subscription, the update function _of the store or focus_ on which the subscription has been made and a reference to the store (or focus) itself:

```js
import { useRef } from 'react'
import { createStore, wrapHandler } from '@polaritybit/informal'
import { useStoreSelector } from '@polaritybit/informal/react'

function HugeTableCell({ row, column, store }) {
	// useStoreSelector subscribes this component to the changes of the specific
	// part of the store returned by the selector, making this component update
	// only when the subscribed part updates.
	const [item, setData] = useStoreSelector(store, (store) => store[row][column])

	return <input type="text" name={`${row}.${column}.text`} value={item.text} onChange={wrapHandler(setData)} />
}

// This is just a function to create a NxN matrix, used to create the store
function createMatrix(size, defaultItem = (i, j) => ({ i, j, text: '' })) {
	return Array.from({ length: size }, (_, i) => {
		return Array.from({ length: size }, (_, j) => {
			return defaultItem(i, j)
		})
	})
}

function HugeTable() {
	// Since the store is created with `createStore`, React will not subscribe
	// to its changes automatically and this component will not update
	// on every change.

	// Using a ref is required to avoid recreating the store on every render
	// of the component.
	const { current: store } = useRef(createStore(createMatrix(25)))

	return (
		<table>
			<tbody>
				{store.getData().map((row, i) => (
					<tr key={i}>
						{row.map((item, j) => (
							<td key={j}>
								<HugeTableCell row={i} column={j} store={store} />
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}
```

**Note:** the selector function should return either a primitive value or a _stable_ reference, so avoid returning new objects/arrays from the selector or consider using using a library such as [`reselect`](https://github.com/reduxjs/reselect) to create a memoized selector. Not following this advice may cause React to throw a "Maximum update depth exceeded" error.

## FAQ

### Is this a _state management_ library?

No, at least it's not what I intend it as. It lacks composability as you cannot define separate parts of the store individually and compose them together, it does not handle async
operations or side effects and does not have any way to abstract logic from specific parts of the store the way you would for example with a reducer. It's not meant to be a _global_ single source of truth but rather a _local_ source of truth for a specific part of your application, and a transient one at that. I personally use Redux in most projects,
and use this to handle forms or other local state where `useState` is not enough and the Redux state is out of scope.

### Does a store need to be an object?

No, a store can contain any serializable value, such as arrays and primitive values. The `createList` function itself simply exposes a different API to interact with a store containing an array instead of an object, for example.

### Why not use `useState`?

You can indeed use `useState` to handle local state, as it was meant to do exactly that, but sometimes React's way of batching changes gets in the way. Having an _external_ store
allows you to have more control over when the state is updated and how it is updated, and the API I've used to build this thing allows for a more granular control over what
`useState` gives you.

### Does this work with Angular/Vue/Svelte/...?

It should, as it's written in plain JS and does not depend on React in any way. I don't currently use other libraries/frameworks, so you'll have to write the bindings yourself.
If you do, tell me so that I can link them here!

### Does this work in Node.js?

Yes, it should.

## Maintenance Status

I am developing this library for my own projects, and I do use it in production. I try to keep a 100% coverage in unit tests, but the library may be missing some features or have some bugs, so if you find any issue please open an issue or propose a pull request.

**The current status of TypeScript typings is quite poor, I'll need to improve them in the future. Can you help? :)**

## Acknowledgements

-   [`ramda`](https://ramdajs.com/), on which this library is heavily reliant upon;
-   [`immer`](https://github.com/immerjs/immer), for the very same reason;
-   [`reselect`](https://github.com/reduxjs/reselect), for making the creation of selectors easy;
-   [`solidjs`](https://www.solidjs.com/), for its Store API, which heavily influenced the API of this library;

## Previous Work

-   [use-form](https://github.com/gianmarcotoso/use-form), a similar, React-only library I currently use/develop;
-   [react-attire](https://github.com/gianmarcotoso/react-attire) was my attempt at doing something similar using render props. It was much more limited but it did its job, even though I haven't used it since hooks have become available.
-   [react-ui-formalize](https://github.com/gianmarcotoso/react-ui-formalize) was my first attempt at tackling the "form" issue, using higher order components. Very old, very deprecated...

## License

MIT
