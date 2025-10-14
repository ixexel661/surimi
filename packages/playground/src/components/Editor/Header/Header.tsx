import { useEditor } from '#context/editor.context.js';

import './Header.css';

export interface HeaderProps {
  disabled?: boolean;
  onRestartCompiler?: () => void;
}

export default function Header({ disabled, onRestartCompiler }: HeaderProps) {
  const { state } = useEditor();

  return (
    <div className="surimi-editor__header">
      <h1>Surimi playground</h1>
      <div className="surimi-editor__header-right">
        <button disabled={disabled} onClick={onRestartCompiler}>
          Restart compiler{' '}
        </button>
      </div>
    </div>
  );
}
