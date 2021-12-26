import { codePresets } from './preset.js';

const TOKENS = {
  INCREMENT: 'Increment',
  DECREASE: 'Decrease',
  MOVE_NEXT: 'MoveNext',
  MOVE_PREV: 'MovePrev',
  INPUT: 'Input',
  ONTPUT: 'Output',
  LOOP_OPEN: 'LoopOpen',
  LOOP_CLOSE: 'LoopClose'
};

const decapitalize = (s) => (s ? `${s[0].toLowerCase()}${s.slice(1)}` : s);

const tokenier = (str) => {
  const tokens = [];
  let current = 0;
  while (current < str.length) {
    const char = str[current++];

    switch (char) {
      case '+':
        tokens.push({
          type: TOKENS.INCREMENT,
          value: '+'
        });
        break;
      case '-':
        tokens.push({
          type: TOKENS.DECREASE,
          value: '-'
        });
        break;
      case '>':
        tokens.push({
          type: TOKENS.MOVE_NEXT,
          value: '>'
        });
        break;
      case '<':
        tokens.push({
          type: TOKENS.MOVE_PREV,
          value: '<'
        });
        break;
      case '.':
        tokens.push({
          type: TOKENS.ONTPUT,
          value: '.'
        });
        break;
      case ',':
        tokens.push({
          type: TOKENS.INPUT,
          value: ','
        });
        break;
      case '[':
        tokens.push({
          type: TOKENS.LOOP_OPEN,
          value: '['
        });
        break;
      case ']':
        tokens.push({
          type: TOKENS.LOOP_CLOSE,
          value: ']'
        });
        break;
    }
  }
  return tokens;
};

const parser = (tokens) => {
  const ast = {
    type: 'Program',
    body: []
  };

  const nodeStask = [];
  let currentNode = ast.body;

  const walk = (token) => {
    switch (token.type) {
      case TOKENS.INCREMENT:
      case TOKENS.DECREASE:
      case TOKENS.MOVE_NEXT:
      case TOKENS.MOVE_PREV:
      case TOKENS.INPUT:
      case TOKENS.ONTPUT:
        currentNode.push({
          type: 'ExpressionStatement',
          value: token.type
        });
        return;
    }

    if (token.type === TOKENS.LOOP_OPEN) {
      const astNode = {
        type: 'LoopStatement',
        body: []
      };
      currentNode.push(astNode);

      nodeStask.push(currentNode);
      currentNode = astNode.body;
    }

    if (token.type === TOKENS.LOOP_CLOSE) {
      if (nodeStask.length <= 0) {
        throw new Error('Uncaught SyntaxError: Loop syntax error');
      }

      currentNode = nodeStask.pop();
    }
  };

  tokens.forEach(walk);

  if (nodeStask.length > 0) {
    throw new Error('Uncaught SyntaxError: Loop syntax error');
  }

  return ast;
};

const traverse = (ast, visitor) => {
  const traverseNode = (node, parent) => {
    let method = visitor[node.type] || {};
    if (typeof method === 'function') {
      method = {
        enter: method
      };
    }

    if (method.enter) method.enter(node, parent);

    switch (node.type) {
      case 'Program':
        traverseArray(node.body, node);
        break;

      case 'LoopStatement':
        traverseArray(node.body, node);
        break;

      case 'ExpressionStatement':
        break;

      default:
        throw new Error('Unknown Ast node type: ', node.type);
    }

    if (method.exit) method.exit(node, parent);
  };

  const traverseArray = (array, parent) => {
    array.forEach((child) => {
      traverseNode(child, parent);
    });
  };

  traverseNode(ast, null);
};

const transformer = (ast) => {
  const newAst = {
    type: 'Program',
    body: []
  };

  ast._context = newAst.body;

  traverse(ast, {
    ExpressionStatement: (node, parent) => {
      parent._context.push({
        type: 'ExpressionStatement',
        expression: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: decapitalize(node.value)
          }
        }
      });
    },
    LoopStatement: (node, parent) => {
      const whileNode = {
        type: 'WhileStatement',
        test: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'getValue'
          }
        },
        body: {
          type: 'BlockStatement',
          body: []
        }
      };
      parent._context.push(whileNode);
      node._context = whileNode.body.body;
    }
  });

  return newAst;
};

class Generator {
  constructor() {
    this.output = '';
  }

  write(code) {
    this.output += code;
  }

  Program(node) {
    this.write('function brainMain() { ');
    node.body.forEach((child) => {
      this[child.type](child);
    });
    this.write(' }');
  }

  ExpressionStatement(node) {
    this[node.expression.type](node.expression);
    this.write(';');
  }

  BlockStatement(node) {
    this.write(' {');

    node.body.forEach((child) => {
      this[child.type](child);
    });

    this.write('} ');
  }

  WhileStatement(node) {
    this.write(' while(');
    this[node.test.type](node.test);
    this.write(')');
    this[node.body.type](node.body);
  }

  CallExpression(node) {
    this[node.callee.type](node.callee);
    this.write('()');
  }

  Identifier(node) {
    this.write(node.name);
  }
}

const codeGenerator = (ast, preset = codePresets) => {
  const generator = new Generator();
  generator[ast.type](ast);

  const result = `
(function () {
${preset}

// compiler result
${generator.output}

// return function
return brainMain;
})();
	`;

  return {
    result,
    compileResult: generator.output
  };
};

export const compiler = (sourceCode, preset) => {
  const tokens = tokenier(sourceCode);
  const ast = parser(tokens);
  const newAst = transformer(ast);
  const code = codeGenerator(newAst, preset);
  return {
    tokens,
    ast,
    javascriptAst: newAst,
    compiler: code.compileResult,
    code: code.result,
  }
};