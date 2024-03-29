import typescript from '@rollup/plugin-typescript'
import multiInput from 'rollup-plugin-multi-input'

export default {
	input: ['src/index.ts', 'src/react.ts'],
	output: {
		dir: './dist',
		entryFileNames: '[name].js',
		format: 'es',
	},
	external: ['react', 'ramda', 'immer'],
	plugins: [multiInput.default(), typescript()],
}
