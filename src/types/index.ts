export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon?: string;
}

export interface Formula {
  id: string;
  title: string;
  category: FormulaCategory;
  content: string;
  latex?: string;
}

export type ToolCategory = 'notable' | 'rationalization' | 'polynomials' | 'equations' | 'systems';

export type FormulaCategory = 'exponents' | 'logarithms' | 'notable-products';

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface PolynomialCoefficient {
  degree: number;
  value: number; // can be stored as fraction internally
}

export interface LinearEquation {
  a: number; // coefficient of x
  b: number; // constant
}

export interface QuadraticEquation {
  a: number; // coefficient of x²
  b: number; // coefficient of x
  c: number; // constant
}
