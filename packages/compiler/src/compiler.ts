import { createFilter } from '@rollup/pluginutils';
import type { OutputChunk } from 'rolldown';
import { build } from 'rolldown';

export interface CompileOptions {
  inputPath: string;
  cwd: string;
  include?: string | string[];
  exclude?: string | string[];
}

export interface CompileResult {
  /* The generated CSS output */
  css: string;
  watchFiles: string[];
}

export default async function compile(options: CompileOptions): Promise<CompileResult> {
  const { inputPath, cwd, include, exclude } = options;

  const filter = createFilter(include, exclude);

  const buildRes = await build({
    input: inputPath,
    cwd,
    write: false,
    output: {
      esModule: true,
    },
    plugins: [
      {
        name: 'surimi:compiler-transform',
        transform(code, id) {
          if (filter(id)) {
            const finalCode = `${code}\nexport default s.build();\n`;
            return finalCode;
          }
          return null;
        },
      },
    ],
  });

  const output = buildRes.output[0];
  const css = await execute(output.code);

  // Extract all imported modules as watch files
  const watchFiles = getModuleDependencies(output);

  return {
    css,
    watchFiles: [...new Set(watchFiles)],
  };
}

async function execute(code: string) {
  try {
    console.log('Executing Surimi code in sandboxed environment...');

    const dataUrl = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
    const module = (await import(dataUrl)) as { default: string };
    return module.default;
  } catch (error) {
    console.error('Error executing Surimi code:', error);
    throw error;
  }
}

function getModuleDependencies(module: OutputChunk): string[] {
  const watchFiles: string[] = [];

  // Add the main input file
  watchFiles.push(module.fileName);

  // Add all imports from the rolldown output
  if (module.imports.length > 0) {
    watchFiles.push(...module.imports);
  }

  // Add dynamic imports if any
  if (module.dynamicImports.length > 0) {
    watchFiles.push(...module.dynamicImports);
  }

  if ('modules' in module && Object.keys(module.modules).length > 0) {
    for (const moduleId of Object.keys(module.modules)) {
      if (!moduleId.includes('node_modules')) {
        watchFiles.push(moduleId);
      }
    }
  }

  return watchFiles;
}
