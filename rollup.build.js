import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: './src/es-state.js',
    output: {
        file: __dirname + '/dist/es-state.min.js',
        format: 'esm',
    },
    plugins: [
     terser(),
    ]
  }
]