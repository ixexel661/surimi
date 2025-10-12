import MonacoEditor from '@monaco-editor/react';
import { useEffect, useState } from 'react';

import { useEditor } from '#context/editor.context';

import EditorPanel from '../Panel/Panel';

export default function EditorOutput() {
  const { state } = useEditor();
  const [editorValue, setEditorValue] = useState<string>('');

  useEffect(() => {
    const getFileContent = async () => {
      if (!state.activeFile) return undefined;

      const content = await state.readFileHandler?.(state.activeFile);
      setEditorValue(content ?? '');
    };

    void getFileContent();
  }, [state.activeFile, state.readFileHandler]);

  return (
    <EditorPanel
      resizable
      enable={{
        right: true,
      }}
      defaultSize={{
        width: '60%',
      }}
      maxWidth="80%"
      minWidth="20%"
      className="surimi-editor__view"
      as="div"
    >
      <MonacoEditor className="surimi-editor__code" theme="vs-dark" path={'./dist/index.css'} value={editorValue} />
    </EditorPanel>
  );
}
