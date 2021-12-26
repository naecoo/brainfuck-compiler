export interface CompilerResult {
  compiler: string;
  code: string;
  tokens: [
    {
      type: 'Increment' | 'Decrease' | 'Input' | 'Output' | 'MoveNext' | 'MovePrev' | 'LoopOpen' | 'LoopClose',
      value: '+' | '-' | ',' | '.' | '>' | '<' | '[' | ']'
    }
  ];
  ast: any[];
  javascriptAst: any[];
}

export function compiler(sourceCode: string, presets?: string): CompilerResult;