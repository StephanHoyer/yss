import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'

export default [
  {
    input: './index.js',
    output: {
      file: 'yss.js',
      exports: 'default',
      format: 'umd',
      name: 'Yss',
      sourcemap: true,
    },
    plugins: process.env.TEST ? [] : [buble(), filesize()],
  },
  {
    input: './index.js',
    output: {
      file: 'yss.min.js',
      exports: 'default',
      format: 'umd',
      name: 'Yss',
      sourcemap: true,
    },
    plugins: [buble(), uglify({ mangle: true, compress: true }), filesize()],
  },
]
