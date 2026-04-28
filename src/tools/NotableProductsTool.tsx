import React, { useState } from 'react';
import { expandExpression } from '../utils/parser';
import { polynomialToString } from '../utils/polynomials';
import { MathText } from '../components';
import { preferFractions } from '../utils/formatMath';

type ProductType = 'binomial-square' | 'difference-squares' | 'binomial-cube' | 'custom';

const PRODUCT_TEMPLATES: Record<Exclude<ProductType, 'custom'>, { name: string; example: string; template: string }> = {
  'binomial-square': {
    name: 'Cuadrado de un Binomio',
    example: '(x+2)^2',
    template: '(a+b)^2',
  },
  'difference-squares': {
    name: 'Diferencia de Cuadrados',
    example: '(x+3)(x-3)',
    template: '(a+b)(a-b)',
  },
  'binomial-cube': {
    name: 'Cubo de un Binomio',
    example: '(x+1)^3',
    template: '(a+b)^3',
  },
};

// preferFractions is imported from utils/formatMath and applied before rendering

export const NotableProductsTool: React.FC = () => {
  const [productType, setProductType] = useState<ProductType>('binomial-square');
  const [expression, setExpression] = useState<string>('(x+2)^2');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleExpand = () => {
    try {
      setError('');
      const expanded = expandExpression(expression);
      setResult(polynomialToString(expanded));
    } catch (err: any) {
      setError(err.message || 'Error al expandir la expresión');
      setResult('');
    }
  };

  const handleTemplateClick = (template: ProductType) => {
    setProductType(template);
    const example = PRODUCT_TEMPLATES[template as keyof typeof PRODUCT_TEMPLATES]?.example || '';
    setExpression(example);
    setResult('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg border px-4 py-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
          Usa ^, +, -, y paréntesis.
        </div>
        <div className="rounded-lg border px-4 py-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
          Escribe ejemplo: <MathText expression="(x+2)^2" className="inline-block" />
        </div>
        <div className="rounded-lg border px-4 py-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
          Resultado en forma desarrollada.
        </div>
      </div>

      {/* Template Selection */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(PRODUCT_TEMPLATES).map(([key, template]) => (
            <button
              key={key}
              onClick={() => handleTemplateClick(key as ProductType)}
              className={`p-4 rounded-lg border-2 transition-all text-left text-slate-900 dark:text-white ${
                productType === key
                  ? 'border-primary-600 dark:border-primary-400'
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600'
              }`}
            >
              <div className="font-semibold text-slate-900 dark:text-white mb-1">
                {template.name}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-200">
                <MathText expression={template.template} className="inline-block text-sm" />
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                <MathText expression={template.example} className="inline-block text-xs" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Expresión
        </label>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Ej: (x+2)^2"
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
        />
      </div>

      {/* Expand Button */}
      <button
        onClick={handleExpand}
        className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
      >
        Desarrollar
      </button>

      {/* Error */}
      {error && (
        <div className="p-4 border-2 border-red-400 dark:border-red-600 rounded-lg">
          <p className="text-red-700 dark:text-red-300">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="p-6 border-2 border-green-300 dark:border-green-600 rounded-lg">
          <div className="p-4 rounded border border-green-300 dark:border-green-600">
            <p className="text-slate-900 dark:text-white text-lg break-words font-mono">
              <MathText expression={preferFractions(expression)} className="inline-block" />
              <span className="px-2">=</span>
              <MathText expression={preferFractions(result)} className="inline-block" />
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
