import type { RolldownWatcher, RolldownWatcherEvent } from 'rolldown';
import { watch } from 'rolldown';

import { BuildCache } from '#cache';
import { getCompileResult, getRolldownInput, getRolldownInstance } from '#compiler';
import { BuildError, ExecutionError } from '#errors';
import type { CompilerError } from '#errors';

export interface CompileOptions {
  inputPath: string;
  cwd: string;
  include: string[];
  exclude: string[];
  cache?: CacheOptions;
}

export interface CacheOptions {
  enabled?: boolean;
  maxSize?: number;
}

export interface WatchOptions {
  onChange: (result: CompileResult, event: RolldownWatcherEvent) => void;
  onError?: (error: CompilerError, event: RolldownWatcherEvent) => void;
}

export interface CompileResult {
  css: string;
  js: string;
  dependencies: string[];
  duration: number;
  errors?: CompilerError[];
}

export async function compile(options: CompileOptions): Promise<CompileResult | undefined> {
  const startTime = Date.now();
  const rolldownInput = getRolldownInput(options);
  await using rolldownCompiler = await getRolldownInstance(rolldownInput);
  const rolldownOutput = await rolldownCompiler.generate();
  const chunk = rolldownOutput.output[0];

  const result = await getCompileResult(chunk.code, chunk.imports, chunk.dynamicImports, chunk.moduleIds);
  const duration = Date.now() - startTime;

  return result ? { ...result, duration } : undefined;
}

// Compiles and watches for file changes with incremental caching
export function compileWatch(options: CompileOptions, watchOptions: WatchOptions): RolldownWatcher {
  const rolldownInput = getRolldownInput(options);
  const cacheEnabled = options.cache?.enabled !== false;
  const buildCache = cacheEnabled ? new BuildCache(options.cache?.maxSize) : null;

  const watcher = watch({
    ...rolldownInput,
    watch: {
      skipWrite: true,
      include: options.include,
      exclude: options.exclude,
    },
  });

  watcher.on('event', async event => {
    if (event.code === 'BUNDLE_START' && buildCache) {
      if ('input' in event && typeof event.input === 'string') {
        buildCache.invalidateDependents(event.input);
      }
    }

    if (event.code === 'BUNDLE_END') {
      const startTime = Date.now();
      const output = await event.result.generate();

      if ('errors' in output) {
        watchOptions.onError?.(
          new BuildError('Build failed with errors', options.inputPath),
          event,
        );
        return;
      }

      const chunk = output.chunks[0];

      if (!chunk) {
        watchOptions.onError?.(
          new BuildError('No output chunk generated', options.inputPath),
          event,
        );
        return;
      }

      const moduleIds = chunk.getModuleIds();
      const imports = chunk.getImports();
      const dynamicImports = chunk.getDynamicImports();

      if (buildCache) {
        const cachedResult = await buildCache.get(options.inputPath);

        if (cachedResult) {
          const duration = Date.now() - startTime;

          void event.result.close();

          watchOptions.onChange(
            {
              ...cachedResult,
              duration: duration + event.duration,
            },
            event,
          );
          return;
        }
      }

      const result = await getCompileResult(chunk.getCode(), imports, dynamicImports, moduleIds);

      if (!result) {
        watchOptions.onError?.(
          new ExecutionError('Failed to execute compiled code', options.inputPath),
          event,
        );
        return;
      }

      if (buildCache) {
        await buildCache.set(options.inputPath, result);
      }

      const duration = Date.now() - startTime;

      void event.result.close();

      watchOptions.onChange(
        {
          ...result,
          duration: duration + event.duration,
        },
        event,
      );
    }
  });

  return watcher;
}
