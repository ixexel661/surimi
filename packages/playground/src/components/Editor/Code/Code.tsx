import type { OnChange, OnMount } from '@monaco-editor/react';
import MonacoEditor from '@monaco-editor/react';
import type { ComponentProps } from 'react';

type MonacoEditorOptions = ComponentProps<typeof MonacoEditor>['options'];

const defaultEditorOptions = {
  minimap: { enabled: false },
  readOnly: false,
  glyphMargin: false,
  lineNumbersMinChars: 1,
  folding: false,
} as const satisfies MonacoEditorOptions;

export interface CodeProps {
  value: string;
  filepath: string;
  options?: MonacoEditorOptions;
  onChange: OnChange;
  onMount: OnMount;
}

export default function Code({ value, filepath, options, onChange, onMount }: CodeProps) {
  const handleMount: OnMount = (editor, monaco) => {
    onMount(editor, monaco);
  };

  const editorOptions = { ...defaultEditorOptions, ...options };

  return (
    <MonacoEditor
      className="surimi-editor__code"
      path={filepath}
      value={value}
      options={editorOptions}
      onMount={handleMount}
      onChange={onChange}
    />
  );
}
