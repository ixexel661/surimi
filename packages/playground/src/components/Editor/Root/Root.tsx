import { useEffect } from 'react';

import { useEditor } from '#context/editor.context';
import type { FileSystemTree, ReadFileHandler, WriteFileHandler } from '#types';

import './Root.css';

export interface EditorProps extends React.PropsWithChildren {
  tree: FileSystemTree;
  readFile: ReadFileHandler;
  writeFile: WriteFileHandler;
}

export default function Editor({ children, tree, readFile, writeFile }: EditorProps) {
  const { dispatch } = useEditor();

  useEffect(() => {
    dispatch({ type: 'setReadFileHandler', data: { handler: readFile } });
  }, [readFile]);

  useEffect(() => {
    dispatch({ type: 'setWriteFileHandler', data: { handler: writeFile } });
  }, [writeFile]);

  useEffect(() => {
    dispatch({ type: 'setFileTree', data: { tree: tree } });
  }, [tree]);

  return <div className="surimi-editor">{children}</div>;
}
