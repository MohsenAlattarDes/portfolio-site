export function wrapIndex(value: number, length: number) {
  return ((value % length) + length) % length;
}
