import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { expandExpression } from '../utils/parser';
import { polynomialToString } from '../utils/polynomials';

type ProductType = 'binomial-square' | 'difference-squares' | 'binomial-cube' | 'custom';

const PRODUCT_TEMPLATES: Record<Exclude<ProductType, 'custom'>, { name: string; example: string; template: string }> = {
  'binomial-square': {
    name: 'Cuadrado de un Binomio',
    example: '(x+2)²',
    template: '(a+b)²',
  },
  'difference-squares': {
    name: 'Diferencia de Cuadrados',
    example: '(x+3)(x-3)',
    template: '(a+b)(a-b)',
  },
  'binomial-cube': {
    name: 'Cubo de un Binomio',
    example: '(x+1)³',
    template: '(a+b)³',
  },
};

export const NotableProductsTool: React.FC = () => {
  const [productType, setProductType] = useState<ProductType>('binomial-square');
  const [expression, setExpression] = useState<string>('(x+2)^2');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showHelp, setShowHelp] = useState<boolean>(false);

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
      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-300 w-full text-left"
        >
          <ChevronDown size={20} className={`transform transition-transform ${showHelp ? 'rotate-180' : ''}`} />
          Cómo usar esta herramienta
        </button>
        {showHelp && (
          <div className="mt-3 text-blue-800 dark:text-blue-200 space-y-2 text-sm">
            <p>Ingresa una expresión algebraica y te mostraremos su desarrollo:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Usa ^ para potencias: x^2</li>
              <li>Usa * o justaposición para multiplicación: 2*x o 2x</li>
              <li>Usa + y - para suma y resta</li>
              <li>Usa () para agrupar: (x+1)^2</li>
            </ul>
          </div>
        )}
      </div>

      {/* Template Selection */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
          Ejemplos de Productos Notables
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(PRODUCT_TEMPLATES).map(([key, template]) => (
            <button
              key={key}
              onClick={() => handleTemplateClick(key as ProductType)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                productType === key
                  ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600'
              }`}
            >
              <div className="font-semibold text-slate-900 dark:text-white mb-1">
                {template.name}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                {template.template}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                Ejemplo: {template.example}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Expresión a Expandir
        </label>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Ej: (x+2)^2, (a-b)^3, 2x(x+1)"
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
        />
      </div>

      {/* Expand Button */}
      <button
        onClick={handleExpand}
        className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
      >
        Expandir Expresión
      </button>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="font-semibold text-green-900 dark:text-green-200 mb-3">
            Resultado
          </h3>
          <div className="p-4 bg-white dark:bg-slate-900 rounded border border-green-300 dark:border-green-700">
            <p className="font-mono text-slate-900 dark:text-white text-lg break-words">
              {expression} = {result}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
