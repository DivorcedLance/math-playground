import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { MathText } from '../components';
import { preferFractions } from '../utils/formatMath';

interface Formula {
  id: string;
  title: string;
  category: string;
  formulaLatex: string;
  exampleLatex: string;
}

const FORMULAS: Formula[] = [
  // Leyes de Exponentes
  {
    id: 'exp-product',
    title: 'Producto de potencias',
    category: 'Leyes de Exponentes',
    formulaLatex: 'a^m \\cdot a^n = a^{m+n}',
    exampleLatex: 'x^3 \\cdot x^2 = x^5',
  },
  {
    id: 'exp-quotient',
    title: 'Cociente de potencias',
    category: 'Leyes de Exponentes',
    formulaLatex: 'a^m \\div a^n = a^{m-n}',
    exampleLatex: 'x^5 \\div x^2 = x^3',
  },
  {
    id: 'exp-power',
    title: 'Potencia de una potencia',
    category: 'Leyes de Exponentes',
    formulaLatex: '(a^m)^n = a^{mn}',
    exampleLatex: '(x^2)^3 = x^6',
  },
  {
    id: 'exp-product-base',
    title: 'Potencia de un producto',
    category: 'Leyes de Exponentes',
    formulaLatex: '(ab)^n = a^n b^n',
    exampleLatex: '(2x)^3 = 8x^3',
  },
  {
    id: 'exp-quotient-base',
    title: 'Potencia de un cociente',
    category: 'Leyes de Exponentes',
    formulaLatex: '\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}',
    exampleLatex: '\\left(\\frac{x}{2}\\right)^2 = \\frac{x^2}{4}',
  },
  {
    id: 'exp-negative',
    title: 'Exponente negativo',
    category: 'Leyes de Exponentes',
    formulaLatex: 'a^{-n} = \\frac{1}{a^n}',
    exampleLatex: 'x^{-2} = \\frac{1}{x^2}',
  },
  {
    id: 'exp-negative-fraction',
    title: 'Cociente con exponente negativo',
    category: 'Leyes de Exponentes',
    formulaLatex: '\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n',
    exampleLatex: '\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^2 = \\frac{9}{4}',
  },
  {
    id: 'exp-zero',
    title: 'Exponente cero',
    category: 'Leyes de Exponentes',
    formulaLatex: 'a^0 = 1 \\quad (a \\neq 0)',
    exampleLatex: 'x^0 = 1',
  },
  {
    id: 'exp-negative-even',
    title: 'Negativo elevado a exponente par',
    category: 'Leyes de Exponentes',
    formulaLatex: '(-a)^{2n} = a^{2n}',
    exampleLatex: '(-3)^2 = 9, \\quad (-2)^4 = 16',
  },
  {
    id: 'exp-negative-odd',
    title: 'Negativo elevado a exponente impar',
    category: 'Leyes de Exponentes',
    formulaLatex: '(-a)^{2n+1} = -a^{2n+1}',
    exampleLatex: '(-2)^3 = -8, \\quad (-5)^1 = -5',
  },

  // Leyes de Raíces
  {
    id: 'root-definition',
    title: 'Definición de raíz enésima',
    category: 'Raíces',
    formulaLatex: '\\sqrt[n]{a} = a^{1/n}',
    exampleLatex: '\\sqrt[3]{8} = 8^{1/3} = 2',
  },
  {
    id: 'root-product',
    title: 'Raíz de un producto',
    category: 'Raíces',
    formulaLatex: '\\sqrt[n]{ab} = \\sqrt[n]{a} \\cdot \\sqrt[n]{b}',
    exampleLatex: '\\sqrt{8} = \\sqrt{4 \\cdot 2} = 2\\sqrt{2}',
  },
  {
    id: 'root-quotient',
    title: 'Raíz de un cociente',
    category: 'Raíces',
    formulaLatex: '\\sqrt[n]{\\frac{a}{b}} = \\frac{\\sqrt[n]{a}}{\\sqrt[n]{b}}',
    exampleLatex: '\\sqrt{\\frac{1}{4}} = \\frac{1}{2}',
  },
  {
    id: 'root-power',
    title: 'Potencia de una raíz',
    category: 'Raíces',
    formulaLatex: '(\\sqrt[n]{a})^n = a',
    exampleLatex: '(\\sqrt{5})^2 = 5',
  },
  {
    id: 'root-nested',
    title: 'Raíz de una raíz',
    category: 'Raíces',
    formulaLatex: '\\sqrt[n]{\\sqrt[m]{a}} = \\sqrt[nm]{a}',
    exampleLatex: '\\sqrt{\\sqrt{16}} = \\sqrt[4]{16} = 2',
  },
  {
    id: 'root-fractional-exponent',
    title: 'Exponente fraccionario',
    category: 'Raíces',
    formulaLatex: 'a^{m/n} = \\sqrt[n]{a^m} = (\\sqrt[n]{a})^m',
    exampleLatex: 'x^{2/3} = \\sqrt[3]{x^2}',
  },

  // Productos Notables
  {
    id: 'notable-square-plus',
    title: 'Cuadrado de suma: (a + b)²',
    category: 'Productos Notables',
    formulaLatex: '(a + b)^2 = a^2 + 2ab + b^2',
    exampleLatex: '(x + 3)^2 = x^2 + 6x + 9',
  },
  {
    id: 'notable-square-minus',
    title: 'Cuadrado de resta: (a - b)²',
    category: 'Productos Notables',
    formulaLatex: '(a - b)^2 = a^2 - 2ab + b^2',
    exampleLatex: '(x - 5)^2 = x^2 - 10x + 25',
  },
  {
    id: 'notable-diff-squares',
    title: 'Diferencia de cuadrados: a² - b²',
    category: 'Productos Notables',
    formulaLatex: 'a^2 - b^2 = (a + b)(a - b)',
    exampleLatex: 'x^2 - 9 = (x + 3)(x - 3)',
  },
  {
    id: 'notable-cube-plus',
    title: 'Cubo de suma: (a + b)³',
    category: 'Productos Notables',
    formulaLatex: '(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3',
    exampleLatex: '(x + 1)^3 = x^3 + 3x^2 + 3x + 1',
  },
  {
    id: 'notable-cube-minus',
    title: 'Cubo de resta: (a - b)³',
    category: 'Productos Notables',
    formulaLatex: '(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3',
    exampleLatex: '(x - 2)^3 = x^3 - 6x^2 + 12x - 8',
  },
  {
    id: 'notable-diff-cubes',
    title: 'Diferencia de cubos: a³ - b³',
    category: 'Productos Notables',
    formulaLatex: 'a^3 - b^3 = (a - b)(a^2 + ab + b^2)',
    exampleLatex: 'x^3 - 8 = (x - 2)(x^2 + 2x + 4)',
  },
  {
    id: 'notable-sum-cubes',
    title: 'Suma de cubos: a³ + b³',
    category: 'Productos Notables',
    formulaLatex: 'a^3 + b^3 = (a + b)(a^2 - ab + b^2)',
    exampleLatex: 'x^3 + 27 = (x + 3)(x^2 - 3x + 9)',
  },

  // Logaritmos
  {
    id: 'log-def',
    title: 'Definición de logaritmo',
    category: 'Logaritmos',
    formulaLatex: 'a^x = b \\leftrightarrow \\log_a(b) = x',
    exampleLatex: '2^3 = 8 \\leftrightarrow \\log_2(8) = 3',
  },
  {
    id: 'log-product',
    title: 'Logaritmo de un producto',
    category: 'Logaritmos',
    formulaLatex: '\\log_a(xy) = \\log_a(x) + \\log_a(y)',
    exampleLatex: '\\log(xy) = \\log(x) + \\log(y)',
  },
  {
    id: 'log-quotient',
    title: 'Logaritmo de un cociente',
    category: 'Logaritmos',
    formulaLatex: '\\log_a(x/y) = \\log_a(x) - \\log_a(y)',
    exampleLatex: '\\log(x/y) = \\log(x) - \\log(y)',
  },
  {
    id: 'log-power',
    title: 'Logaritmo de una potencia',
    category: 'Logaritmos',
    formulaLatex: '\\log_a(x^n) = n \\log_a(x)',
    exampleLatex: '\\log(x^3) = 3\\log(x)',
  },
  {
    id: 'log-base-a-a',
    title: 'Logaritmo de la base',
    category: 'Logaritmos',
    formulaLatex: '\\log_a(a) = 1',
    exampleLatex: '\\log_5(5) = 1',
  },
  {
    id: 'log-base-a-1',
    title: 'Logaritmo de la unidad',
    category: 'Logaritmos',
    formulaLatex: '\\log_a(1) = 0',
    exampleLatex: '\\log(1) = 0',
  },
  {
    id: 'log-change-base',
    title: 'Cambio de base',
    category: 'Logaritmos',
    formulaLatex: '\\log_a(x) = \\frac{\\log_b(x)}{\\log_b(a)}',
    exampleLatex: '\\log_2(8) = \\frac{\\log(8)}{\\log(2)}',
  },
  {
    id: 'log-inverse',
    title: 'Propiedad inversa',
    category: 'Logaritmos',
    formulaLatex: 'a^{\\log_a(x)} = x',
    exampleLatex: '2^{\\log_2(5)} = 5',
  },
  {
    id: 'log-reciprocal',
    title: 'Logaritmo recíproco',
    category: 'Logaritmos',
    formulaLatex: '\\frac{1}{\\log_b(a)} = \\log_a(b)',
    exampleLatex: '\\frac{1}{\\log_2(5)} = \\log_5(2)',
  },
];

export const FormulasPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const categories = Array.from(new Set(FORMULAS.map(f => f.category)));
  const filteredFormulas = selectedCategory
    ? FORMULAS.filter(f => f.category === selectedCategory)
    : FORMULAS;

  const handlePrintPDF = () => {
    const printableWindow = window.open('', '_blank', 'width=1024,height=768');

    if (!printableWindow) {
      alert('No se pudo abrir la ventana de impresión. Verifica los pop-ups del navegador.');
      return;
    }

    const styles = `
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
        h1 { font-size: 24px; margin-bottom: 8px; }
        h2 { font-size: 18px; margin: 24px 0 12px; }
        h3 { font-size: 16px; margin: 0 0 6px; }
        p { margin: 0 0 6px; line-height: 1.45; }
        .card { border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 14px; }
        .category { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; margin-bottom: 10px; }
        .formula { break-inside: avoid; }
        @media print { button { display: none; } }
      </style>
    `;

    const content = filteredFormulas
      .map(formula => `
        <div class="card formula">
          <div class="category">${formula.category}</div>
          <h3>${formula.title}</h3>
        </div>
      `)
      .join('');

    printableWindow.document.open();
    printableWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Compendio de fórmulas</title>
          ${styles}
        </head>
        <body>
          <h1>Compendio de Fórmulas</h1>
          <p>Listado generado desde Math Playground.</p>
          <h2>${selectedCategory || 'Todas las categorías'}</h2>
          ${content}
        </body>
      </html>
    `);
    printableWindow.document.close();
    printableWindow.focus();
    printableWindow.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">📊 Fórmulas</h1>
        <p className="text-slate-600 dark:text-slate-400">Referencia rápida, sin teoría larga.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-primary-600 dark:bg-primary-700 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            Todas
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 dark:bg-primary-700 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrintPDF}
          className="flex items-center gap-2 px-4 py-2 bg-secondary-600 dark:bg-secondary-700 text-white rounded-lg hover:bg-secondary-700 dark:hover:bg-secondary-600 transition-colors font-medium"
        >
          <Download size={18} />
          Descargar PDF
        </button>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFormulas.map(formula => (
          <div
            key={formula.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              <FileText className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {formula.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formula.category}
                </p>
              </div>
            </div>
            <div className="ml-8 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <MathText expression={preferFractions(formula.formulaLatex)} className="block text-base text-slate-900 dark:text-white" />
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Ejemplo</p>
              <MathText expression={preferFractions(formula.exampleLatex)} className="block text-sm text-slate-700 dark:text-slate-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Tables Section */}
      {!selectedCategory && (
        <div className="space-y-8 mt-12 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">📊 Tablas de Referencia</h2>

          {/* Powers Table (Base 2) */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Potencias de 2</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left font-semibold text-slate-900 dark:text-white">Exponente</th>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <th key={n} className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-center font-semibold text-slate-900 dark:text-white">
                        <MathText expression={`2^{${n}}`} className="text-slate-900 dark:text-white" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-900 dark:text-white">2ⁿ</td>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <td key={n} className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-center text-slate-700 dark:text-slate-300">
                        {Math.pow(2, n)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Powers Table (Base 3) */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Potencias de 3</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left font-semibold text-slate-900 dark:text-white">Exponente</th>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <th key={n} className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-center font-semibold text-slate-900 dark:text-white">
                        <MathText expression={`3^{${n}}`} className="text-slate-900 dark:text-white" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-900 dark:text-white">3ⁿ</td>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <td key={n} className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-center text-slate-700 dark:text-slate-300">
                        {Math.pow(3, n)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Perfect Squares */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Cuadrados Perfectos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left font-semibold text-slate-900 dark:text-white">
                      <MathText expression="n^2" className="text-slate-900 dark:text-white" />
                    </th>
                    {Array.from({ length: 15 }, (_, i) => i + 1).map(n => (
                      <th key={n} className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-center font-semibold text-slate-900 dark:text-white text-xs">
                        <MathText expression={`${n}^2`} className="text-slate-900 dark:text-white" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-900 dark:text-white">
                      <MathText expression="n^2" className="text-slate-900 dark:text-white" />
                    </td>
                    {Array.from({ length: 15 }, (_, i) => i + 1).map(n => (
                      <td key={n} className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-center text-slate-700 dark:text-slate-300 text-xs">
                        {n * n}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Perfect Cubes */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Cubos Perfectos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left font-semibold text-slate-900 dark:text-white">
                      <MathText expression="n^3" className="text-slate-900 dark:text-white" />
                    </th>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <th key={n} className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-center font-semibold text-slate-900 dark:text-white text-xs">
                        <MathText expression={`${n}^3`} className="text-slate-900 dark:text-white" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-900 dark:text-white">
                      <MathText expression="n^3" className="text-slate-900 dark:text-white" />
                    </td>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <td key={n} className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-center text-slate-700 dark:text-slate-300 text-xs">
                        {n * n * n}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Negative Exponents Table */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Exponentes Negativos (Base 2)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left font-semibold text-slate-900 dark:text-white">Exponente</th>
                    {[-1, -2, -3, -4, -5, -6].map(n => (
                      <th key={n} className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-center font-semibold text-slate-900 dark:text-white">
                        <MathText expression={`2^{(${n})}`} className="text-slate-900 dark:text-white" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-900 dark:text-white">
                      <MathText expression="2^n" className="text-slate-900 dark:text-white" />
                      <span className="ml-2 text-slate-500 dark:text-slate-400">(fracción)</span>
                    </td>
                    {[-1, -2, -3, -4, -5, -6].map(n => (
                      <td key={n} className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-center text-slate-700 dark:text-slate-300 text-xs">
                        <MathText expression={`2^{(${n})}`} className="text-slate-900 dark:text-white" />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
