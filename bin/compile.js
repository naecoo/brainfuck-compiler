const { compiler } = require('../dist/bundle');
const path = require('path')
const fs = require('fs');

const getOptions = (args) => {
  let source, input, output;
  let i = 0;
  while (i < args.length) {
    if (!source && ['-s', '--source'].includes(args[i])) {
      source = args[i + 1];
      i = i + 2;
      continue;
    }

    if (!input && ['-i', '--input'].includes(args[i])) {
      input = args[i + 1];
      i = i + 2;
      continue;
    }

    if (!output && ['-o', '--output'].includes(args[i])) {
      output = args[i + 1];
      i = i + 2;
      continue;
    }

    ++i;
  }

  if (!input && !source) {
    console.log('Please provide input or source option');
    process.exit(-1);
  }

  if (!output) {
    console.log('Please provide output option');
    process.exit(-1);
  }

  return { source, input, output };
}

const run = () => {
  const args = process.argv.slice(2);
  if (args.includes('-h') || args.includes('--help')) {
    [
      'Usage: brainfuck-compiler [options]',
      'brainfuck-compiler -i index.txt -o result.js',
      'options:',
      '-i, --input\tSingle Input file',
      '-s, --source\tBrainfuck\'s source code string replaces the input file',
      '-o, --output\tSingle output file'
    ].forEach(line => console.log(line));
    process.exit(0)
  }

  const { source, input, output } = getOptions(args);
  let sourceCode = '';
  if (source) {
    sourceCode = source;
  } else {
    sourceCode = fs.readFileSync(path.resolve(input), 'utf8');
  }

  const { code } = compiler(sourceCode);
  fs.writeFileSync(path.resolve(output), code, 'utf8');
};

run();