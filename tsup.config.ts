import { defineConfig } from 'tsup';
import { glob } from 'glob';

export default defineConfig(async () => {
  const iconFiles = await glob('src/icons/*.ts');

  const iconEntries = Object.fromEntries(
    iconFiles.map(file => [
      `icons/${file.split('/').pop()!.replace('.ts', '')}`,
      file,
    ])
  );

  return {
    entry: {
      index: 'src/index.ts',
      'tailwind-preset': 'src/tailwind-preset.ts',
      ...iconEntries,
      utils: 'src/utils/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom'],
    injectStyle: false,
  };
});