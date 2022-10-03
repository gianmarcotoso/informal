import { flatten } from 'ramda'
import { PathElement } from './types'

function normalizePathElement(pathElement: PathElement): PathElement | PathElement[] {
	if (!isNaN(+pathElement)) {
		return +pathElement
	}

	if (typeof pathElement === 'string' && pathElement.includes('.')) {
		const elements = pathElement.split('.')
		return flatten(elements.map((p) => normalizePathElement(p)))
	}

	return pathElement
}

export function normalizePath(...path: PathElement[]): PathElement[] {
	return flatten(path.map((p) => normalizePathElement(p)))
}
