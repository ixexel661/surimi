import type { Terminal as XTerm } from '@xterm/xterm';
import { useMemo, useState } from 'react';

import * as Editor from '#components/Editor';
import { Runtime } from '#core';
import type { FileSystemTree, TerminalDimensions, WatchCallback, WatchOptions } from '#types';

import './playground.css';

const files = {
  'index.ts': {
    file: {
      contents: `\
import { select } from "surimi";

select('html').style({ backgroundColor: 'red' });
`,
    },
  },
  'index.css': {
    file: {
      contents: '// The output will appear here',
    },
  },
  'package.json': {
    file: {
      contents: `\
{
  "name": "surimi-playground-app",
  "type": "module",
  "dependencies": {
    "surimi": "latest",
    "@surimi/compiler": "latest",
    "@rolldown/binding-wasm32-wasi": "latest"
  },
  "scripts": {
    "build": "surimi compile index.ts --no-js --watch"
  }
}`,
    },
  },
} satisfies FileSystemTree;

export default function Playgroun() {
  const [runtime, setRuntime] = useState<Runtime | undefined>();
  const [status, setStatus] = useState<string | null>('Loading...');

  const compilerState = useMemo(() => {
    return {
      state: 'idle',
      error: null,
      outputFilePath: runtime ? 'index.css' : null,
      duration: null,
    } as const;
  }, [runtime]);

  const handleTerminalMount = async (xterm: XTerm) => {
    const _runtime = new Runtime();
    setStatus('Initializing web container...');
    await _runtime.init('surimi');
    setStatus('Initializing terminal...');
    await _runtime.initTerminal(xterm);
    setStatus('Mounting files...');
    await _runtime.mount(files);

    setRuntime(_runtime);

    setStatus('Installing dependencies...');
    await _runtime.terminal?.command('pnpm', ['install', '--prefer-offline']);

    setStatus('Starting build in watch mode...');
    await _runtime.terminal?.command('export', ['NODE_NO_WARNINGS=1']);
    await _runtime.terminal?.command('clear');
    void _runtime.terminal?.command('pnpm', ['run', 'build']);

    await new Promise(resolve => setTimeout(resolve, 2000));

    setStatus('Done! Enabling editors and terminal...');
    await new Promise(resolve => setTimeout(resolve, 500));

    setStatus(null);
  };

  const handleWriteFile = async (filepath: string, content: string | undefined) => {
    if (content == undefined) return;
    await runtime?.writeFile(filepath, content);
  };

  const handleReadFile = async (filepath: string): Promise<string> => {
    try {
      if (!runtime) throw new Error('Runtime not yet initialized');

      const file = await runtime.readFile(filepath);
      return file;
    } catch (err) {
      throw new Error(`unable to read file ${filepath}: ${err}`);
    }
  };

  const handleWatchFile = (filepath: string, options: WatchOptions, callback: WatchCallback): (() => void) => {
    if (!runtime) throw new Error('Runtime not yet initialized');

    const watcher = runtime.watch(filepath, options, callback);

    return () => {
      watcher.close();
    };
  };

  const handleTerminalResize = (meta: TerminalDimensions) => {
    runtime?.terminal?.setMetadata(meta);
  };

  const handleRestartCompiler = () => {
    runtime?.terminal
      ?.write('\x03')
      .then(async () => {
        console.log('done');
        await runtime.terminal?.command('clear');
        void runtime.terminal?.command('pnpm', ['run', 'build']);
      })
      .catch((err: unknown) => {
        console.log(err);
      });
  };

  return (
    <div className="surimi-playground">
      <Editor.Provider>
        <Editor.Header disabled={status !== null} onRestartCompiler={handleRestartCompiler} />

        <Editor.Root
          tree={files}
          selectedFile="index.ts"
          status={status ?? 'Done'}
          ready={status === null}
          compiler={compilerState}
          writeFile={handleWriteFile}
          readFile={handleReadFile}
          watchFile={handleWatchFile}
        >
          <Editor.View />
          <Editor.Panel
            resizable
            hideOverlay
            defaultSize={{ width: '40%' }}
            enable={false}
            maxWidth="80%"
            minWidth="20%"
            className="surimi-editor__right"
            as="div"
          >
            <Editor.Output />
            <Editor.Terminal onMount={handleTerminalMount} onResize={handleTerminalResize} />
          </Editor.Panel>
        </Editor.Root>
      </Editor.Provider>
    </div>
  );
}
