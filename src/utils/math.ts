export function easeInCubic(x: number): number {
  return x * x * x;
}

export function lerp(a: number, b: number, alpha: number) {
  return a + alpha * (b - a);
}
