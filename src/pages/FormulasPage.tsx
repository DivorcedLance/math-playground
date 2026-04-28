import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';

interface Formula {
  id: string;
  title: string;
  category: string;
  content: React.ReactNode;
}

const FORMULAS: Formula[] = [
  {
    id: 'exp-product',
    title: 'Producto de potencias de la misma base',
    category: 'Leyes de Exponentes',
    content: (
      <div className="space-y-4">
        <p className="font-semibold">a^m · a^n = a^(m+n)</p>
        <p className="text-slate-600 dark:text-slate-400">
          Cuando multiplicamos potencias de la misma base, sumamos los exponentes.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">Ejemplo: x³ · x² = x⁵</p>
      </div>
    ),
  },
  {
    id: 'exp-quotient',
    title: 'Cociente de potencias de la misma base',
    category: 'Leyes de Exponentes',
    content: (
      <div className="space-y-4">
        <p className="font-semibold">a^m ÷ a^n = a^(m-n)</p>
        <p className="text-slate-600 dark:text-slate-400">
          Cuando dividimos potencias de la misma base, restamos los exponentes.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">Ejemplo: x⁵ ÷ x² = x³</p>
      </div>
    ),
  },
  {
    id: 'exp-power',
    title: 'Potencia de una potencia',
    category: 'Leyes de Exponentes',
    content: (
      <div className="space-y-4">
        <p className="font-semibold">(a^m)^n = a^(m·n)</p>
        <p className="text-slate-600 dark:text-slate-400">
          La potencia de una potencia se obtiene multiplicando los exponentes.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">Ejemplo: (x²)³ = x⁶</p>
      </div>
    ),
  },
  {
    id: 'exp-product-base',
    title: 'Potencia de un producto',
    category: 'Leyes de Exponentes',
    content: (
      <div className="space-y-4">
        <p className="font-semibold">(a·b)^n = a^n · b^n</p>
        <p className="text-slate-600 dark:text-slate-400">
          La potencia de un producto es igual al producto de las potencias.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">Ejemplo: (2x)³ = 2³ · x³ = 8x³</p>
      </div>
    ),
  },
  {
    id: 'log-def',
    title: 'Definición de Logaritmo',
    category: 'Logaritmos',
    content: (
      <div className="space-y-4">
        <p className="font-semibold">a^x = b ⟺ log_a(b) = x</p>
        <p className="text-slate-600 dark:text-slate-400">
          El logaritmo es la operación inversa de la exponenciación.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">Ejemplo: 2³ = 8 ⟺ log₂(8) = 3</p>
      </div>
    ),
  },
  {
    id: 'log-product',
    title: 'Logaritmo de un producto',
    category: 'Logaritmos',
    content: (
      <div className="space-y-4">
        <p className="font-semibold">log_a(x·y) = log_a(x) + log_a(y)</p>
        <p className="text-slate-600 dark:text-slate-400">
          El logaritmo de un producto es suma de logaritmos.
        </p>
      </div>
    ),
  },
  {
    id: 'log-quotient',
    title: 'Logaritmo de un cociente',
    category: 'Logaritmos',
    content: (
      <div className="space-y-4">
        <p className="font-semibold">log_a(x/y) = log_a(x) - log_a(y)</p>
        <p className="text-slate-600 dark:text-slate-400">
          El logaritmo de un cociente es diferencia de logaritmos.
        </p>
      </div>
    ),
  },
  {
    id: 'notable-binomio',
    title: 'Cuadrado de un Binomio (a ± b)²',
    category: 'Productos Notables',
    content: (
      <div className="space-y-4">
        <p className="font-semibold">(a + b)² = a² + 2ab + b²</p>
        <p className="font-semibold">(a - b)² = a² - 2ab + b²</p>
        <p className="text-slate-600 dark:text-slate-400">
          El cuadrado de un binomio es: cuadrado del primero, más o menos el doble producto, más cuadrado del segundo.
        </p>
      </div>
    ),
  },
  {
    id: 'notable-diff-squares',
    title: 'Diferencia de Cuadrados a² - b²',
    category: 'Productos Notables',
    content: (
      <div className="space-y-4">
        <p className="font-semibold">a² - b² = (a + b)(a - b)</p>
        <p className="text-slate-600 dark:text-slate-400">
          La diferencia de cuadrados se factoriza como suma por diferencia.
        </p>
      </div>
    ),
  },
  {
    id: 'notable-cubo',
    title: 'Cubo de un Binomio (a ± b)³',
    category: 'Productos Notables',
    content: (
      <div className="space-y-4">
        <p className="font-semibold">(a + b)³ = a³ + 3a²b + 3ab² + b³</p>
        <p className="font-semibold">(a - b)³ = a³ - 3a²b + 3ab² - b³</p>
        <p className="text-slate-600 dark:text-slate-400">
          El cubo de un binomio se desarrolla usando coeficientes binomiales.
        </p>
      </div>
    ),
  },
];

export const FormulasPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const categories = Array.from(new Set(FORMULAS.map(f => f.category)));
  const filteredFormulas = selectedCategory
    ? FORMULAS.filter(f => f.category === selectedCategory)
    : FORMULAS;

  const handlePrintPDF = () => {
    // Aquí iría la generación del PDF
    alert('Descarga de PDF: Se implementará próximamente');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          📊 Compendio de Fórmulas
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Consulta las principales fórmulas matemáticas organizadas por tema.
        </p>
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
            className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 transition-colors"
          >
            <div className="flex items-start gap-3 mb-4">
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
            <div className="ml-8 text-slate-700 dark:text-slate-300">
              {formula.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
