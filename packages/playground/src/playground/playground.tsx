import type { Terminal as XTerm } from '@xterm/xterm';
import { use, useState } from 'react';

import * as Editor from '#components/Editor';
import { Runtime, UUID } from '#core';
import type { FileSystemTree, TerminalDimensions } from '#types';

import './playground.css';

const files = {
  'index.ts': {
    file: {
      contents: `
import { select } from "surimi";

select('html').style({ backgroundColor: 'red' });
`,
    },
  },
  'package.json': {
    file: {
      contents: `
{
  "name": "surimi-playground-app",
  "type": "module",
  "dependencies": {
    "@surimi/compiler": "latest"
  },
  "scripts": {
    "build": "surimi compile index.ts --outDir dist --no-js"
  }
}`,
    },
  },
} satisfies FileSystemTree;

export default function Playgroun() {
  const [runtime, setRuntime] = useState<Runtime | undefined>();

  const handleTerminalMount = async (xterm: XTerm) => {
    const _runtime = new Runtime();
    await _runtime.init('surimi');
    await _runtime.initTerminal(xterm);
    setRuntime(_runtime);

    await _runtime.mount(files);
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

  const handleTerminalResize = (meta: TerminalDimensions) => {
    runtime?.terminal?.setMetadata(meta);
  };

  return (
    <Editor.Provider>
      <Editor.Root tree={files} writeFile={handleWriteFile} readFile={handleReadFile}>
        <Editor.View />
        <Editor.Output filepath="./dist/index.css" value={'Output will appear here...'} />
        <Editor.Terminal onMount={handleTerminalMount} onResize={handleTerminalResize} />
      </Editor.Root>
    </Editor.Provider>
  );
}
