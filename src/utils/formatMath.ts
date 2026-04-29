export function preferFractions(input: string): string {
  if (!input) return input;

  // If user already provided a \frac, trust it and skip conversion
  if (input.includes('\\frac')) return input;

  let s = input;

  // Normalize common division symbols to '/'
  s = s.replace(/\\div/g, '/');
  s = s.replace(/\s*÷\s*/g, '/');

  // Match patterns with more care to avoid breaking complex expressions:
  // - Match balanced parentheses/braces as units
  // - Allow underscores and other math symbols
  // But: only for simple cases to avoid confusion with complex nested expressions
  
  // First, try to match simple patterns: number/number, variable/variable
  s = s.replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}');
  
  // Then, match simple variable/variable patterns (but not functions)
  s = s.replace(/([a-zA-Z])\/([a-zA-Z])/g, '\\frac{$1}{$2}');
  
  // For more complex patterns with balanced parentheses, only if clearly separated
  // Match pattern like: {something}/something or something/{something}
  s = s.replace(/(\{[^}]+\})\/([^\/\s]+)/g, '\\frac{$1}{$2}');
  s = s.replace(/([^\/\s]+)\/(\{[^}]+\})/g, '\\frac{$1}{$2}');

  return s;
}

export default preferFractions;
