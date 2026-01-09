import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';

const CONFIG_PATH = './tsconfig.json';

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.cjs', format: 'cjs', exports: 'named' },
      { file: 'dist/index.mjs', format: 'esm', exports: 'named' }
    ],
    plugins: [
      typescript({ tsconfig: CONFIG_PATH, compilerOptions: { removeComments: true } }),
      terser({ format: { comments: false } })
    ]
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts({ tsconfig: CONFIG_PATH })]
  }
]);
