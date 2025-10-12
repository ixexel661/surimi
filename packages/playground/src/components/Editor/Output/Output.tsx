import { useEffect, useState } from 'react';

import { useEditor } from '#context/editor.context';

import Code from '../Code/Code';
import Panel from '../Panel/Panel';

import './Output.css';

export default function EditorOutput() {
  const { state } = useEditor();
  const [outputValue, setOutputValue] = useState<string>('');
  const [outputFilePath, setOutputFilePath] = useState<string>('dist/index.css');

  useEffect(() => {
    const getFileContent = async () => {
      if (!state.compiler.outputFilePath) return undefined;

      const content = await state.readFileHandler?.(state.compiler.outputFilePath);
      setOutputFilePath(state.compiler.outputFilePath);
      setOutputValue(content ?? '');
    };

    void getFileContent();
  }, [state.compiler.outputFilePath, state.readFileHandler]);

  return (
    <Panel
      resizable
      enable={{
        bottom: true,
      }}
      defaultSize={{
        height: '70%',
      }}
      maxHeight="90%"
      minHeight="50%"
      className="surimi-editor__output"
      as="div"
    >
      <Code
        value={outputValue}
        filepath={outputFilePath}
        onChange={() => {
          /* unused */
        }}
        onMount={() => {
          /* unused */
        }}
      />
    </Panel>
  );
}
