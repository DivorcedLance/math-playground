import type { Tool } from '../types';

export const TOOLS: Tool[] = [
  {
    id: 'notable-products',
    name: 'Productos Notables',
    description: 'Desarrolla productos notables y expresiones algebraicas',
    category: 'notable',
    icon: 'Zap',
  },
  {
    id: 'rationalization',
    name: 'Racionalización',
    description: 'Racionaliza denominadores con raíces',
    category: 'rationalization',
    icon: 'Divide',
  },
  {
    id: 'polynomial-eval',
    name: 'Evaluación de Polinomios',
    description: 'Evalúa polinomios en valores específicos',
    category: 'polynomials',
    icon: 'Function',
  },
  {
    id: 'polynomial-division',
    name: 'División de Polinomios (Horner)',
    description: 'Divide polinomios usando el método de Horner',
    category: 'polynomials',
    icon: 'GitBranch',
  },
  {
    id: 'linear-equations',
    name: 'Ecuaciones Lineales',
    description: 'Resuelve ecuaciones lineales mostrando el procedimiento',
    category: 'equations',
    icon: 'LineChart',
  },
  {
    id: 'quadratic-equations',
    name: 'Ecuaciones Cuadráticas',
    description: 'Resuelve ecuaciones de segundo grado',
    category: 'equations',
    icon: 'PlusCircle',
  },
  {
    id: 'systems-equations',
    name: 'Sistemas de Ecuaciones',
    description: 'Resuelve sistemas de ecuaciones lineales',
    category: 'systems',
    icon: 'Grid',
  },
];

export const TOOL_CATEGORIES = {
  notable: {
    label: 'Productos Notables',
    tools: ['notable-products'],
  },
  rationalization: {
    label: 'Racionalización',
    tools: ['rationalization'],
  },
  polynomials: {
    label: 'Polinomios',
    tools: ['polynomial-eval', 'polynomial-division'],
  },
  equations: {
    label: 'Ecuaciones',
    tools: ['linear-equations', 'quadratic-equations'],
  },
  systems: {
    label: 'Sistemas',
    tools: ['systems-equations'],
  },
};
