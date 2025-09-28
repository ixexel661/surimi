export interface SurimiPluginOptions {
  /**
   * Files to include for scanning. Only used in 'virtual' mode.
   * @default ['**\/*.css.{ts,js}']
   */
  include?: string | string[];

  /**
   * Files to exclude from scanning. Only used in 'virtual' mode.
   * @default ['node_modules/**', '**\/*.d.ts']
   */
  exclude?: string | string[];

  /**
   * Automatically externalize surimi and postcss in build mode (default: true)
   * This makes sure to not include any useless code in the final bundle.
   * If using surimi in runtime node (to generate CSS on the client), needs to be disabled
   */
  autoExternal?: boolean;

  /**
   * CSS processing mode:
   * - 'manual': Only transform surimi CSS files that are explicitly imported (default)
   * - 'virtual': Generate virtual CSS module from auto-discovered surimi CSS files
   */
  mode?: 'manual' | 'virtual';

  /**
   * Virtual module name that needs to be imported to include all discovered CSS.
   * @default 'virtual:surimi.css'
   */
  virtualModuleId?: string;
}

export interface ScanResult {
  files: string[];
  css: string;
  dependencies: Set<string>;
}
