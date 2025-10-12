import { useEffect, useState } from 'react';

import { useEditor } from '#context/editor.context';

import EditorPanel from '../Panel/Panel';
import EditorViewCode from './Code/Code';
import EditorViewWelcome from './Welcome/Welcome';

export default function EditorView() {
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

  const handleCodeEditorChange = (value: string | undefined) => {
    if (!state.activeFile) {
      throw new Error('A file edit was done but no file is active. Are you a wizard?');
    }

    if (!value) {
      void state.writeFileHandler?.(state.activeFile, '');
    } else {
      void state.writeFileHandler?.(state.activeFile, value);
    }
  };

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
      {state.activeFile ? (
        <EditorViewCode
          value={editorValue}
          filepath={state.activeFile}
          onChange={handleCodeEditorChange}
          onMount={() => {
            /* unused */
          }}
        />
      ) : (
        <EditorViewWelcome />
      )}
    </EditorPanel>
  );
}
