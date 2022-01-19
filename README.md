# brainfuck-compiler

**Compiler** [Brainfuck](https://en.wikipedia.org/wiki/Brainfuck) to Javascript


[demo](https://naecoo.github.io/brainfuck-compiler/index.html)

## Install
```bash
npm install bf-compiler
```

## Command line

```bash
bf-compile -i source.txt -o result.js

// or pass source code directly
br-compile -s '++--..><[]' -o result.js
```


## Javascript API
```javascript
import { compiler } from 'bf-compiler';
// using `require` in node.js

const result = compiler(source);
// pure compile result
result.compiler;        
// compile result and preset function       
result.code;
// Brainfuck tokens
result.tokens;
// Brainfuck ast
result.ast;
// Javascript ast
result.javascriptAst;
```

## Reference
- [the-super-tiny-compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)
- [write-your-own-brainfuck-interpreter](https://levelup.gitconnected.com/write-your-own-brainfuck-interpreter-98e828c72854)
- [ast-explorer](https://astexplorer.net/) 
