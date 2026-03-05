import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';

const CONFIG_PATH = './tsconfig.json';

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.cjs', format: 'cjs', exports: 'named', sourcemap: false },
      { file: 'dist/index.mjs', format: 'esm', exports: 'named', sourcemap: false }
    ],
    plugins: [
      typescript({ tsconfig: CONFIG_PATH, compilerOptions: { removeComments: true } }),
      terser({ format: { comments: false }, compress: { drop_console: false } })
    ]
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm', sourcemap: false }],
    plugins: [dts({ tsconfig: CONFIG_PATH })]
  }
]);
