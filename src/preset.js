export const codePresets = `
// preset vars
var t = [0];
var p = 0;

// preset functions
function getValue() {
  return t[p];
}
function increment() {
  t[p]++;
}
function decrease() {
  t[p]--;
}
function movePrev() {
  p--;
  if (p < 0) throw new Error('Pointer less then 0 ', p);
}
function moveNext() {
  p++;
  if (t[p] === undefined) t[p] = 0;
}
function output() {
  console.log(String.fromCharCode(t[p]));
}
function input() {
  var c = prompt('Input one Ascii character');
  if (typeof c !== 'string' || c.length <= 0) throw new Error('Invalid input: ', c);
  t[p] = c[0].charCodeAt();
}
`;
