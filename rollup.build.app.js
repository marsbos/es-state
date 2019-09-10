import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: './example/todo-app.js',
    output: {
        file: __dirname + '/app/todo-app.js',
        format: 'esm',
    },
    plugins: [
      resolve(),
      //terser(),
    ]
  }
]