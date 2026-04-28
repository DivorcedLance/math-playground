import Fraction from 'fraction.js';

export interface SimpleFraction {
  numerator: number;
  denominator: number;
}

/**
 * Convierte un número a fracción simplificada
 */
export function toFraction(value: number | string): SimpleFraction {
  const frac = new Fraction(value);
  return {
    numerator: Number(frac.s * frac.n), // s es el signo, n es el numerador
    denominator: Number(frac.d),
  };
}

/**
 * Suma de fracciones
 */
export function addFractions(a: SimpleFraction, b: SimpleFraction): SimpleFraction {
  const frac = new Fraction(a.numerator, a.denominator).add(new Fraction(b.numerator, b.denominator));
  return {
    numerator: Number(frac.s * frac.n),
    denominator: Number(frac.d),
  };
}

/**
 * Resta de fracciones
 */
export function subtractFractions(a: SimpleFraction, b: SimpleFraction): SimpleFraction {
  const frac = new Fraction(a.numerator, a.denominator).sub(new Fraction(b.numerator, b.denominator));
  return {
    numerator: Number(frac.s * frac.n),
    denominator: Number(frac.d),
  };
}

/**
 * Multiplicación de fracciones
 */
export function multiplyFractions(a: SimpleFraction, b: SimpleFraction): SimpleFraction {
  const frac = new Fraction(a.numerator, a.denominator).mul(new Fraction(b.numerator, b.denominator));
  return {
    numerator: Number(frac.s * frac.n),
    denominator: Number(frac.d),
  };
}

/**
 * División de fracciones
 */
export function divideFractions(a: SimpleFraction, b: SimpleFraction): SimpleFraction {
  const frac = new Fraction(a.numerator, a.denominator).div(new Fraction(b.numerator, b.denominator));
  return {
    numerator: Number(frac.s * frac.n),
    denominator: Number(frac.d),
  };
}

/**
 * Convierte fracción a string formato "numerador/denominador"
 */
export function fractionToString(frac: SimpleFraction | Fraction): string {
  if (frac instanceof Fraction) {
    const num = Number(frac.s * frac.n);
    const den = Number(frac.d);
    if (den === 1) {
      return num.toString();
    }
    return `${num}/${den}`;
  }
  
  if (frac.denominator === 1) {
    return frac.numerator.toString();
  }
  return `${frac.numerator}/${frac.denominator}`;
}

/**
 * Convierte fracción a string en formato LaTeX
 */
export function fractionToLatex(frac: SimpleFraction): string {
  if (frac.denominator === 1) {
    return frac.numerator.toString();
  }
  return `\\frac{${frac.numerator}}{${frac.denominator}}`;
}

/**
 * Convierte fracción a decimal
 */
export function fractionToDecimal(frac: SimpleFraction): number {
  return frac.numerator / frac.denominator;
}

/**
 * Comprueba si una fracción es cero
 */
export function isZero(frac: SimpleFraction): boolean {
  return frac.numerator === 0;
}

/**
 * Comprueba si dos fracciones son iguales
 */
export function areFractionsEqual(a: SimpleFraction, b: SimpleFraction): boolean {
  return a.numerator * b.denominator === b.numerator * a.denominator;
}
