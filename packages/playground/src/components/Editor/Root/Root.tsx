import { useEffect } from 'react';

import { useEditor } from '#context/editor.context';
import type { FileSystemTree, ReadFileHandler, WriteFileHandler } from '#types';

export interface RootProps extends React.PropsWithChildren {
  tree: FileSystemTree;
  selectedFile: string;
  runtimeReady: boolean;
  readFile: ReadFileHandler;
  writeFile: WriteFileHandler;
}

export default function Root({ children, tree, selectedFile, runtimeReady, readFile, writeFile }: RootProps) {
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

  useEffect(() => {
    if (runtimeReady) {
      dispatch({ type: 'setActiveFile', data: { filepath: selectedFile } });
    }
  }, [runtimeReady, selectedFile]);

  return <div className="surimi-editor">{children}</div>;
}
