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
    formulaLatex: '(a^m)^n = a^{m n}',
    exampleLatex: '(x^2)^3 = x^6',
  },
  {
    id: 'exp-product-base',
    title: 'Potencia de un producto',
    category: 'Leyes de Exponentes',
    formulaLatex: '(a b)^n = a^n b^n',
    exampleLatex: '(2x)^3 = 8x^3',
  },
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
    id: 'notable-binomio',
    title: 'Cuadrado de un Binomio (a ± b)²',
    category: 'Productos Notables',
    formulaLatex: '(a + b)^2 = a^2 + 2ab + b^2',
    exampleLatex: '(x + 3)^2 = x^2 + 6x + 9',
  },
  {
    id: 'notable-diff-squares',
    title: 'Diferencia de Cuadrados a² - b²',
    category: 'Productos Notables',
    formulaLatex: 'a^2 - b^2 = (a + b)(a - b)',
    exampleLatex: 'x^2 - 9 = (x + 3)(x - 3)',
  },
  {
    id: 'notable-cubo',
    title: 'Cubo de un Binomio (a ± b)³',
    category: 'Productos Notables',
    formulaLatex: '(a + b)^3 = a^3 + 3a^2 b + 3 a b^2 + b^3',
    exampleLatex: '(x + 1)^3 = x^3 + 3x^2 + 3x + 1',
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
    </div>
  );
};
