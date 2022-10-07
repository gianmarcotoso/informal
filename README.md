# Informal

A UI agnostic library for handling local form state. Written in VanillaJS with builtin React bindings - an evolution of
`use-form` (https://github.com/gianmarcotoso/use-form).

## Installation

```bash
npm install @polaritybit/informal
```

## Usage (VanillaJS)

To create a new form instance, use the `createForm` function:

```js
import { createForm } from '@polaritybit/informal'

const form = createForm({
	name: 'Jimmy Doe',
	age: 33,
})
```

The form instance exposes the `getData`, `setData` and `subscribe` methods.

### `getData`

`getData` can be used at any time to get the current form data.

```js
const form = createForm({
	name: 'Jimmy Doe',
	age: 33,
})

const data = form.getData()
console.log(data)

// {
//     name: 'Jimmy Doe',
//     age: 33,
// }
```

While `getData` returns a reference to the internal state tracked by the form, you should _never_ mutate it directly. Instead, you should always use the `setData` function.

`getData` can also be used to get a reference to a specific field:

```js
const form = createForm({
	name: 'Jimmy Doe',
	age: 33,
})

const name = form.getData('name')
console.log(name) // 'Jimmy Doe'
```

If the form is tracking an object with nested fields, you can pass each key of the path as a separate parameter to `getData`:

```js
const form = createForm({
	name: 'Jimmy Doe',
	age: 33,
	address: {
		street: '123 Main St',
		city: 'New York',
	},
})

const street = form.getData('address', 'street')
console.log(street) // '123 Main St'
```

Dot notation is also supported:

```js
const street = form.getData('address.street')
console.log(street) // '123 Main St'
```

Dot notation and path keys can also be mixed:

```js
const form = createForm({
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

const floor = form.getData('address', 'apartment.floor')
console.log(floor) // 2
```

Both path keys and dot notation support indexes to reference array elements:

```js
const form = createForm({
	people: [
		{ name: 'Jimmy Doe', age: 33, address: { city: 'New York' } },
		{ name: 'Jane Doe', age: 31 },
	],
})

const jane = form.getData('people', 1)
console.log(jane) // { name: 'Jane Doe', age: 31 }

const janeAge = form.getData('people', 1, 'age')
console.log(janeAge) // 31

const jimmyCity = form.getData('people.0.address.city')
console.log(jimmyCity) // 'New York'
```

`getData` also supports accessing data through a selector function:

```js
const form = createForm({
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

const floor = form.getData((data) => data.address.apartment.floor)
console.log(floor) // 2
```

### `setData`

`setData` updates the current data tracked by the form.

When calling `setData` with a single parameter, it completely replaces the content of the form:

```js
const form = createForm({
	name: 'Jimmy Doe',
	age: 33,
})

form.setData({ name: 'Jane Doe' })

const data = form.getData()
console.log(data)

// {
//     name: 'Jane Doe',
// }
```

`setData` accepts a _producer_ callback, which receives the current value tracked
by the form and returns the new value.

```js
form.setData((data) => {
	return {
		...data,
		age: data.age + 1,
	}
})
```

A producer callback can also mutate the value of the form, as it uses [`immer`](https://github.com/immerjs/immer) internally:

```js
form.setData((data) => {
	data.age += 1
})
```

`setData` also supports updating inner fields by specifying their path as parameters, with the last parameter being the new value for that field:

```js
const form = createForm({
	name: 'Jimmy Doe',
	age: 33,
	address: {
		street: '123 Main St',
		city: 'New York',
	},
})

form.setData('age', 34)
form.setData('address', 'city', 'Los Angeles')
```

A producer function can also be used to _evolve_ the value of a field:

```js
form.setData('age', (age) => age + 1)
form.setData('address', 'city', (city) => city.toUpperCase())
```

Dot notation is also supported, and can be used to specify either a full path or a partial one:

```js
const form = createForm({
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

form.setData('age', 34)
form.setData('address.city', (city) => city.toUpperCase())
form.setData('address', 'apartment.number', 7)
```

Elements within an array can also be updated by referencing them through their index:

```js
const form = createForm([
	{ name: 'Jimmy Doe', age: 33, address: { city: 'New York' } },
	{ name: 'Jane Doe', age: 31 },
])

form.setData(1, 'age', 34)
form.setData('0.address.city', (city) => city.toUpperCase())
```

### `subscribe`

`subscribe` allows you to subscribe to changes in the form data. It receives a callback that will be called every time any part of the form changes.

```js
const form = createForm({
	name: 'Jimmy Doe',
	age: 33,
})

const unsubscribe = form.subscribe(() => {
	console.log(form.getData())
})

form.setData('age', 34)
// The callback passed to subscribe is called

unsubscribe()
form.setData('age', 35)
// The callback is no longed called
```

### Creating a focus on the form

When dealing with large forms it can be useful to create a _focus_ on a specific part of the form. This allows you to create a form that only tracks a specific part of the data, and only updates that part when calling `setData`.

The `createFocus` function serves this purpose and can be called by passing it the source form and the path to the field that should be focused:

```js
import { createForm, createFocus } from '@polaritybit/informal'

const form = createForm({
	name: 'Jimmy Doe',
	age: 33,
	address: {
		street: '123 Main St',
		city: 'New York',
	},
})

const addressFocus = createFocus(form, 'address')
```

The object returned by `createFocus` has the same API as the `form` object, but it only tracks the part of the form it was focused on.

```js
addressFocus.getData('city') // 'New York'

addressFocus.subscribe(() => {
	console.log(addressFocus.getData())
})

addressFocus.setData('city', 'Los Angeles')
// The subscriber is called
```

Updating data on a focused portion of a form updates the main form, and calls all subscribers of both the form and the focused portion. Creating a focus _does not_ create a new version of the portion of the form that is being focused, but simply allows a more direct access to it.

`createFocus` can be used on both the main form and on other focused portions of the form:

```js
const form = createForm({
	name: 'Jimmy Doe',
	age: 33,
	address: {
		street: '123 Main St',
		city: 'New York',
	},
})

const addressFocus = createFocus(form, 'address')
const cityFocus = createFocus(addressFocus, 'city')

cityFocus.setData('Los Angeles')

form.getData('address.city') // 'Los Angeles'
```

### Handling lists

A form often tracks lists of data. The `createList` function provides an API to handle them. `createList` receives the form (or the focus) that contains the list, and an optional _identifier_ function that can be used to identify elements within the list.

```js
import { createForm, createFocus, createList } from '@polaritybit/informal'

const form = createForm({
	name: 'Jimmy Doe',
	age: 33,
	todos: [
		{ id: 1, text: 'Buy milk' },
		{ id: 2, text: 'Buy eggs' },
	],
})
const todosFocus = createFocus(form, 'todos')
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

`removeItem` allows to remove an item from the list. It should receive a reference to that needs to be removed:

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

A form can be created with an optional middleware function passed as a second parameter; this function will be invoked
after each update and _before_ notifying the subscribers. A middleware is a producer function that
receives the current value of the form and returns a new value that will be used as the new value of the form; since it
uses `immer` behind the scenes, the value of the tracked data can also be mutated directly.

```js
const form = createForm(
	{
		name: 'Jimmy',
		age: 33,
	},
	(value) => {
		value.name = value.name.toUpperCase()
	},
)

form.getData('name') // 'JIMMY'
form.setData('name', 'Bob')
form.getData('name') // 'BOB'
```

Please note that a form's middleware is always called, even if the update comes from a focused portion of the form or
a list handler.

## Usage with React

`informal` comes with React hooks that can be used instead of (or in addition to) the VanillaJS API.

### `useForm`

`useForm` creates a form and returns a tuple with the current form value, the `setData` function and a reference to the form itself:

```js
import { useForm } from '@polaritybit/informal/react'

function MyForm() {
	const [data, setData, form] = useForm({
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
import { useForm } from '@polaritybit/informal/react'

function MyForm() {
	const [data, setData, form] = useForm({
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
import { useForm } from '@polaritybit/informal/react'

function MyForm() {
	const [data, setData, form] = useForm({
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

Just as with `createForm`, `useForm` allows to pass a middleware function as a second parameter:

```js
const [data, setData, form] = useForm(
	{
		name: 'Jimmy Doe',
		age: 33,
	},
	(value) => {
		value.name = value.name.toUpperCase()
	},
)
```

### `useFormFocus`

`useFormFocus` creates a focus on a form (or another focus) and returns a tuple with the current focus value, the `setData` function and a reference to the focus itself:

```js
import { useForm, useFormFocus } from '@polaritybit/informal/react'

function MyForm() {
	const [data, setData, form] = useForm({
		name: 'Jimmy Doe',
		age: 33,
		address: {
			street: '123 Main St',
			city: 'New York',
		},
	})

	const [address, setAddress, addressFocus] = useFormFocus(form, 'address')

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

### `useFormList`

The `useFormList` hook creates a list from a form (or a focus) and returns a tuple with the list and an object containing the methods to read and write on it:

```js
import { wrapHandler } from '@polaritybit/informal'
import { useForm, useFormList } from '@polaritybit/informal/react'

function Todos() {
	const [todos, setTodos, todosForm] = useForm([])
	const [todosList, { setItems, addItem, removeItem, updateItem }] = useFormList(todosForm, (i) => i.id)

	function handleAddItemFormSubmit(e) {
		e.preventDefault()

		const title = e.target.elements.namedItem('title').value
		addItem({ id: Math.random(), title: title, done: false })
	}

	function handleResetItems() {
		setItems([])
	}

	return (
		<div>
			<form onSubmit={handleAddItemFormSubmit}>
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

### `useFormSelector`

In some cases you want to create a form but use a more granular, per-element subscription to its data; this can be useful, for example, when dealing with large tables with many inputs, where subscribing to the whole form means re-rendering the whole table on every change.

The `useFormSelector` hook comes in handy in these cases, as it allows you to create a subscription to a specific part of a form (or a focus) that is not directly tracked by React. It receives the form (or the focus) on which to subscribe, and the selector that will be used to extract the data from the form. It returns a tuple with the current value of the subscription, the update function _of the form or focus_ on which the subscription has been made and a reference to the form (or focus) itself:

```js
import { useRef } from 'react'
import { createForm, wrapHandler } from '@polaritybit/informal'
import { useFormSelector } from '@polaritybit/informal/react'

function HugeTableCell({ row, column, form }) {
	// useFormSelector subscribes this component to the changes of the specific
	// part of the form returned by the selector, making this component update
	// only when the subscribed part updates.
	const [item, setData] = useFormSelector(form, (form) => form[row][column])

	return <input type="text" name={`${row}.${column}.text`} value={item.text} onChange={wrapHandler(setData)} />
}

// This is just a function to create a NxN matrix, used to create the form
function createMatrix(size, defaultItem = (i, j) => ({ i, j, text: '' })) {
	return Array.from({ length: size }, (_, i) => {
		return Array.from({ length: size }, (_, j) => {
			return defaultItem(i, j)
		})
	})
}

function HugeTable() {
	// Since the form is created with `createForm`, React will not subscribe
	// to its changes automatically and this component will not update
	// on every change.

	// Using a ref is required to avoid recreating the form on every render
	// of the component.
	const { current: form } = useRef(createForm(createMatrix(25)))

	return (
		<table>
			<tbody>
				{form.getData().map((row, i) => (
					<tr key={i}>
						{row.map((item, j) => (
							<td key={j}>
								<HugeTableCell row={i} column={j} form={form} />
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}
```

**Note:** the selector function should return either a primitive value or a _stable_ reference, so avoid returning new objects/arrays from the selector or consider using using a library such as [`reselect`](https://github.com/reduxjs/reselect) to create a memoized selector. Not following this rule advice may cause React to throw a "Maximum update depth exceeded" error.

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
