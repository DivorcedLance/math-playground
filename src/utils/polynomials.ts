import Fraction from 'fraction.js';

export interface Term {
  coefficient: Fraction;
  variables: Map<string, number>; // ej: {x: 2, y: 1} representa x²y
}

export interface Polynomial {
  terms: Term[];
}

/**
 * Crea un término a partir de un coeficiente y variables
 */
export function createTerm(coefficient: number | string | Fraction, variables: Record<string, number> = {}): Term {
  if (coefficient instanceof Fraction) {
    return {
      coefficient,
      variables: new Map(Object.entries(variables)),
    };
  }
  return {
    coefficient: new Fraction(coefficient),
    variables: new Map(Object.entries(variables)),
  };
}

/**
 * Combina términos semejantes
 */
export function combineLikeTerms(terms: Term[]): Term[] {
  const grouped = new Map<string, Term>();

  for (const term of terms) {
    const key = Array.from(term.variables.entries())
      .sort()
      .map(([v, p]) => `${v}${p > 1 ? '^' + p : ''}`)
      .join('*');

    if (grouped.has(key)) {
      const existing = grouped.get(key)!;
      existing.coefficient = existing.coefficient.add(term.coefficient) as Fraction;
    } else {
      grouped.set(key, { ...term });
    }
  }

  return Array.from(grouped.values())
    .filter(term => {
      const num = Number(term.coefficient.n);
      return num !== 0;
    }) // Remove zero terms
    .sort((a, b) => {
      // Sort by total degree descending, then by variable order
      const degreeA = Array.from(a.variables.values()).reduce((sum, p) => sum + p, 0);
      const degreeB = Array.from(b.variables.values()).reduce((sum, p) => sum + p, 0);
      return degreeB - degreeA;
    });
}

/**
 * Multiplica dos términos
 */
export function multiplyTerms(t1: Term, t2: Term): Term {
  const coefficient = t1.coefficient.mul(t2.coefficient) as Fraction;
  const variables = new Map<string, number>();

  // Combine powers from both terms
  for (const [v, p1] of t1.variables.entries()) {
    const p2 = t2.variables.get(v) || 0;
    const power = p1 + p2;
    if (power > 0) {
      variables.set(v, power);
    }
  }

  // Add variables only from t2
  for (const [v, p2] of t2.variables.entries()) {
    if (!t1.variables.has(v)) {
      variables.set(v, p2);
    }
  }

  return { coefficient, variables };
}

/**
 * Multiplica dos polinomios
 */
export function multiplyPolynomials(p1: Polynomial, p2: Polynomial): Polynomial {
  const terms: Term[] = [];

  for (const t1 of p1.terms) {
    for (const t2 of p2.terms) {
      terms.push(multiplyTerms(t1, t2));
    }
  }

  return { terms: combineLikeTerms(terms) };
}

/**
 * Suma dos polinomios
 */
export function addPolynomials(p1: Polynomial, p2: Polynomial): Polynomial {
  return { terms: combineLikeTerms([...p1.terms, ...p2.terms]) };
}

/**
 * Resta dos polinomios
 */
export function subtractPolynomials(p1: Polynomial, p2: Polynomial): Polynomial {
  const negatedTerms = p2.terms.map(term => ({
    ...term,
    coefficient: term.coefficient.neg() as Fraction,
  }));
  return { terms: combineLikeTerms([...p1.terms, ...negatedTerms]) };
}

/**
 * Convierte un término a string
 */
export function termToString(term: Term): string {
  let result = term.coefficient.toFraction();
  
  const variables = Array.from(term.variables.entries())
    .sort()
    .map(([v, p]) => (p > 1 ? `${v}^${p}` : v))
    .join('');

  if (variables) {
    result += variables;
  } else if (result === '1') {
    result = '1';
  }

  return result;
}

/**
 * Convierte un polinomio a string
 */
export function polynomialToString(poly: Polynomial): string {
  if (poly.terms.length === 0) return '0';

  return poly.terms
    .map((term, i) => {
      const str = termToString(term);
      if (i === 0) return str;
      const sign = Number(term.coefficient.s) > 0 ? '+ ' : '- ';
      const absN = Math.abs(Number(term.coefficient.n));
      const d = Number(term.coefficient.d);
      return sign + absN + '/' + d + ' ' + str.slice(str.search(/[a-z]/i));
    })
    .join(' ');
}
