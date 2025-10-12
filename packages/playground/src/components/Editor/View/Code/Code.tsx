import type { OnChange, OnMount } from '@monaco-editor/react';
import MonacoEditor from '@monaco-editor/react';

export interface EditorProps {
  value: string;
  filepath: string;
  onChange: OnChange;
  onMount: OnMount;
}

export default function EditorViewCode({ value, filepath, onChange, onMount }: EditorProps) {
  const handleMount: OnMount = (editor, monaco) => {
    onMount(editor, monaco);
  };

  return (
    <MonacoEditor
      className="surimi-editor__code"
      theme="vs-dark"
      path={filepath}
      value={value}
      onMount={handleMount}
      onChange={onChange}
    />
  );
}
