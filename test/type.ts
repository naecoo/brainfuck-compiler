import { compiler } from '..';

type Equal<V, T> = V extends T ? true : false;

const { code, tokens } = compiler('>><<>><+.+>');

type Case = [
  Equal<typeof code, string>
]
