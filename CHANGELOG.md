# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v1.0.1] - 2026-10-02

### Fixed

- Path types for `getData`/`setData` no longer enumerate every possible path of the store type. Paths are validated as written, at a cost linear in their length. Stores that contain large or self-referential types (e.g. Stripe's `PaymentIntent`) no longer cause TS2589/TS2590/TS2859, multi-minute `tsc` runs or spurious "No overload matches this call" errors.
- The value type at a path that goes through an optional field is now the field's actual type instead of `any`, so mistyped values there are reported.

### Changed

- Dotted-string paths autocomplete one level at a time (`'customer.'` → `customer.name`, `customer.address`) and accept any numeric array index (`'todos.42.title'`). Completion still suggests indices `0`-`19`.
- The segment-per-argument form (`setData('todos', i, 'title', value)`) is still fully type-checked but no longer offers autocompletion.
- No depth limit on paths.

### Removed

- The `PathString` and `PathTuple` helper types from `types` (replaced by `DottedPath` and `ValidPath`). They weren't exported from the package entry points.

### Tests

- Type-level tests for path typing (`tests/types`): a fixture store with nested objects, arrays of objects and a large self-referential type, checked for zero diagnostics, an instantiation budget and dotted-path autocompletion. `npm run test:types` type-checks the whole project.

## [v1.0.0] - 2026-07-22

### Added

- Autocomplete and type-checking for nested paths passed to `setData`/`getData`. TypeScript now derives, from the store's data shape, every valid path and offers editor completion for both supported styles:
    - a single dotted string: `setData('address.street.name', value)`
    - one segment per argument, which can itself be a dotted fragment: `setData('address', 'street', value)` / `setData('address', 'street.name', value)`

    The value/producer argument is also checked against the type resolved at that path (e.g. `setData('address.street.name', 42)` is now a type error). Array elements are supported both ways; the dotted-string form completes indices `0`-`19` (arbitrary and dynamic indices still work through the multi-argument form, e.g. `setData('todos', i, 'title', value)`).

- `tsconfig.build.json`, used only by the Rollup build, so the root `tsconfig.json` can include `tests/**` without changing the published output layout.

### Fixed

- `createStore('foo')` (and `useStore('foo')`) no longer infer the store's type as the literal `'foo'` instead of `string`, which previously made `setData` reject any other value of the same primitive type.
- Test files are no longer excluded from the root `tsconfig.json`, which caused editors to analyze them without the project's real compiler options (missing `strict`, `jsx`, Jest globals, etc.), showing spurious errors.

### Changed

- `Producer<T>` now allows a `void` return (`(data: T) => T | void`), matching the Immer-recipe style already used when passing a mutating callback to `setData`.

### Tests

- Reached 100% statement/branch/function/line coverage; added an SSR-rendering test for `useStoreSelector` to exercise the `getServerSnapshot` path passed to `useSyncExternalStore`, which client-only tests never triggered.
