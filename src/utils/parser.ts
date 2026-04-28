import Fraction from 'fraction.js';
import type { Polynomial } from './polynomials';
import { createTerm, multiplyPolynomials, addPolynomials } from './polynomials';

/**
 * Expande una expresión algebraica como (x+1)^2
 * Input: cadena como "(x+1)^2" o "2x^3"
 * Output: Polynomial expandido
 */
export function expandExpression(expr: string): Polynomial {
  // Limpiar espacios
  expr = expr.replace(/\s+/g, '');

  // Tokenizar la expresión
  const tokens = tokenize(expr);

  // Parsear y evaluar
  return parseExpression(tokens);
}

interface Token {
  type: 'number' | 'variable' | 'operator' | 'lparen' | 'rparen' | 'power';
  value: string;
}

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expr.length) {
    const char = expr[i];

    // Skip whitespace
    if (char === ' ') {
      i++;
      continue;
    }

    // Numbers and fractions
    if (/[\d]/.test(char) || (char === '.' && i + 1 < expr.length && /[\d]/.test(expr[i + 1]))) {
      let num = '';
      while (i < expr.length && /[\d.]/.test(expr[i])) {
        num += expr[i];
        i++;
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    // Variables
    if (/[a-z]/i.test(char)) {
      let variable = '';
      while (i < expr.length && /[a-z]/i.test(expr[i])) {
        variable += expr[i];
        i++;
      }
      tokens.push({ type: 'variable', value: variable });
      continue;
    }

    // Operators and parentheses
    if ('+-*/'.includes(char)) {
      tokens.push({ type: 'operator', value: char });
      i++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'lparen', value: '(' });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'rparen', value: ')' });
      i++;
      continue;
    }

    if (char === '^') {
      tokens.push({ type: 'power', value: '^' });
      i++;
      continue;
    }

    i++;
  }

  return tokens;
}

function parseExpression(tokens: Token[], startIdx = 0): Polynomial {
  let poly: Polynomial = { terms: [] };
  let i = startIdx;
  let currentOp = '+';

  while (i < tokens.length && tokens[i].type !== 'rparen') {
    const term = parseTerm(tokens, i);

    // Apply operation
    if (currentOp === '+') {
      poly = addPolynomials(poly, term.polynomial);
    } else if (currentOp === '-') {
      const negated = {
        terms: term.polynomial.terms.map(t => ({
          ...t,
          coefficient: t.coefficient.neg() as Fraction,
        })),
      };
      poly = addPolynomials(poly, negated);
    } else if (currentOp === '*') {
      poly = multiplyPolynomials(poly, term.polynomial);
    }

    i = term.endIdx;

    // Check for next operator
    if (i < tokens.length) {
      if (tokens[i].type === 'operator') {
        currentOp = tokens[i].value;
        i++;
      } else if (tokens[i].type === 'lparen' || tokens[i].type === 'variable' || tokens[i].type === 'number') {
        // Implicit multiplication: (x+1)(x-1), 2x, x(x+1)
        currentOp = '*';
      }
    }
  }

  return poly;
}

interface ParseResult {
  polynomial: Polynomial;
  endIdx: number;
}

function parseTerm(tokens: Token[], startIdx = 0): ParseResult {
  let i = startIdx;
  let basePoly: Polynomial | null = null;
  let coefficient = new Fraction(1);

  // Parse coefficient
  if (i < tokens.length && tokens[i].type === 'number') {
    coefficient = new Fraction(tokens[i].value);
    i++;
  }

  // Handle negative
  if (i > startIdx && tokens[startIdx].type === 'operator' && tokens[startIdx].value === '-') {
    coefficient = coefficient.neg() as Fraction;
  }

  // Parse base (variable or parenthesized expression)
  if (i < tokens.length) {
    if (tokens[i].type === 'lparen') {
      i++; // skip '('
      basePoly = parseExpression(tokens, i);
      // Find matching rparen
      let depth = 1;
      while (depth > 0 && i < tokens.length) {
        if (tokens[i].type === 'lparen') depth++;
        if (tokens[i].type === 'rparen') depth--;
        i++;
      }
    } else if (tokens[i].type === 'variable') {
      const variableName = tokens[i].value;
      let power = 1;
      i++;

      // Check for power
      if (i < tokens.length && tokens[i].type === 'power') {
        i++; // skip '^'
        if (i < tokens.length && tokens[i].type === 'number') {
          power = parseInt(tokens[i].value);
          i++;
        }
      }

      basePoly = {
        terms: [createTerm(1, { [variableName]: power })],
      };
    }
  }

  if (!basePoly) {
    basePoly = { terms: [createTerm(coefficient)] };
  } else {
    // Apply coefficient
    basePoly.terms = basePoly.terms.map(t => ({
      ...t,
      coefficient: t.coefficient.mul(coefficient) as Fraction,
    }));
  }

  // Check for power after parentheses
  if (
    i < tokens.length &&
    tokens[i].type === 'power' &&
    i - 1 >= startIdx &&
    tokens[i - 1].type === 'rparen'
  ) {
    i++; // skip '^'
    if (i < tokens.length && tokens[i].type === 'number') {
      const power = parseInt(tokens[i].value);
      i++;

      // Raise polynomial to power
      let result = basePoly;
      for (let p = 1; p < power; p++) {
        result = multiplyPolynomials(result, basePoly);
      }
      basePoly = result;
    }
  }

  return { polynomial: basePoly, endIdx: i };
}
