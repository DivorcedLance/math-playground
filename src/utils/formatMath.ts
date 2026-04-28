export function preferFractions(input: string): string {
  if (!input) return input;

  // If user already provided a \frac, trust it and skip conversion
  if (input.includes('\\frac')) return input;

  let s = input;

  // Normalize common division symbols to '/'
  s = s.replace(/\\div/g, '/');
  s = s.replace(/\s*÷\s*/g, '/');

  // Convert simple a/b patterns into LaTeX \frac{a}{b}
  // This targets alphanumeric tokens and grouped parentheses/braces
  s = s.replace(/([0-9A-Za-z\)\}\^\+\-\._\(\{]+)\/([0-9A-Za-z\(\{\^\+\-\._\)\}]+)/g, "\\frac{$1}{$2}");

  return s;
}

export default preferFractions;
