import ts from 'typescript'

const root = ts.sys.getCurrentDirectory()
const fixture = ts.sys.resolvePath('tests/types/fixtures/order-store.ts')
const probe = ts.sys.resolvePath('tests/types/fixtures/__completion-probe__.ts')

const INSTANTIATION_BUDGET = 100_000

function compilerOptions() {
	const { config } = ts.readConfigFile(ts.sys.resolvePath('tsconfig.json'), ts.sys.readFile)

	return ts.parseJsonConfigFileContent(config, ts.sys, root).options
}

function createLanguageService(files: Record<string, string>) {
	const options = compilerOptions()
	const host: ts.LanguageServiceHost = {
		getScriptFileNames: () => Object.keys(files),
		getScriptVersion: () => '1',
		getScriptSnapshot: (fileName) => {
			const text = files[fileName] ?? ts.sys.readFile(fileName)

			return text === undefined ? undefined : ts.ScriptSnapshot.fromString(text)
		},
		getCurrentDirectory: () => root,
		getCompilationSettings: () => options,
		getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
		fileExists: (fileName) => fileName in files || ts.sys.fileExists(fileName),
		readFile: (fileName) => files[fileName] ?? ts.sys.readFile(fileName),
	}

	return ts.createLanguageService(host)
}

function completionsAt(call: string) {
	const cursor = call.indexOf('|')
	const source = `import { store } from './order-store'\n\ndeclare const i: number\n\n${call.replace('|', '')}\n`
	const position = source.indexOf(call.replace('|', '')) + cursor
	const service = createLanguageService({ [probe]: source })

	return (service.getCompletionsAtPosition(probe, position, {})?.entries ?? []).map((entry) => entry.name)
}

describe('store path types', () => {
	it('type-checks the fixture without errors, within the instantiation budget', () => {
		const program = ts.createProgram([fixture], compilerOptions())
		const diagnostics = ts.getPreEmitDiagnostics(program)

		expect(diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'))).toEqual([])
		expect(program.getInstantiationCount()).toBeLessThan(INSTANTIATION_BUDGET)
	})

	it('completes the first segment of a dotted path', () => {
		const entries = completionsAt(`store.setData('|', 1)`)

		expect(entries).toEqual(
			expect.arrayContaining(['id', 'price', 'customer', 'lines', 'shipments', 'payment', 'metadata', 'createdAt']),
		)
	})

	it('completes nested segments of a dotted path', () => {
		expect(completionsAt(`store.setData('customer.address.|', 1)`)).toEqual(
			expect.arrayContaining(['customer.address.street', 'customer.address.city']),
		)
		expect(completionsAt(`store.getData('payment.intent.|')`)).toEqual(
			expect.arrayContaining(['payment.intent.amount', 'payment.intent.customer', 'payment.intent.charges']),
		)
	})

	it('completes array indices and the fields of array elements', () => {
		expect(completionsAt(`store.setData('lines.|', 1)`)).toEqual(
			expect.arrayContaining(['lines.0', 'lines.1', 'lines.19']),
		)
		expect(completionsAt(`store.setData('lines.0.|', 1)`)).toEqual(
			expect.arrayContaining(['lines.0.sku', 'lines.0.qty', 'lines.0.price', 'lines.0.tags']),
		)
	})

	it('does not complete into opaque leaves', () => {
		expect(completionsAt(`store.setData('createdAt.|', 1)`).filter((name) => name.startsWith('createdAt.'))).toEqual([])
	})
})
