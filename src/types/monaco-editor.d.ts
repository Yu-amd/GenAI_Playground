declare module '@monaco-editor/react' {
  import { ComponentType } from 'react';
  import { EditorProps as MonacoEditorProps } from 'monaco-editor';

  export interface EditorProps extends Partial<MonacoEditorProps> {
    height?: string | number;
    defaultLanguage?: string;
    defaultValue?: string;
    theme?: string;
    options?: Record<string, any>;
  }

  const Editor: ComponentType<EditorProps>;
  export default Editor;
} 