# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
