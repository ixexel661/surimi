export interface SurimiPluginOptions {
  /** Files to include for scanning */
  include?: string | string[];

  /** Files to exclude from scanning */
  exclude?: string | string[];

  /** Enable development features like HMR */
  devFeatures?: boolean;

  /** Automatically externalize surimi and postcss in build mode (default: true) */
  autoExternal?: boolean;

  /**
   * CSS processing mode:
   * - 'auto': Automatically scan all files and replace surimi calls with CSS injection
   * - 'manual': Only transform surimi files that are explicitly imported (recommended)
   * - 'virtual': Generate virtual:surimi.css module from auto-discovered files
   */
  mode?: 'auto' | 'manual' | 'virtual';
}

export interface ScanResult {
  files: string[];
  css: string;
  dependencies: Set<string>;
}
