import React, { useState } from 'react';
import { MathText } from '../components';

function sqrtToLatex(expr: string): string {
  // Convert sqrt(2) to \sqrt{2}, no nested roots
  return expr.replace(/sqrt\((\w+)\)/g, '\\sqrt{$1}');
}

export const RationalizationTool: React.FC = () => {
  const [numerator, setNumerator] = useState<string>('1');
  const [denominator, setDenominator] = useState<string>('sqrt(2)');
  const [result, setResult] = useState<{ steps: string[]; final: string } | null>(null);
  const [error, setError] = useState<string>('');

  const handleRationalize = () => {
    try {
      setError('');
      setResult(null);

      const num = numerator.trim();
      const denom = denominator.trim();

      if (!denom.includes('sqrt')) {
        setError('El denominador debe contener una raíz: sqrt(2), sqrt(3), etc.');
        return;
      }

      // Extract the radicand (what's inside sqrt)
      const match = denom.match(/sqrt\((\w+)\)/);
      if (!match) {
        setError('Formato inválido. Usa: sqrt(2), sqrt(3)');
        return;
      }

      const radicand = match[1];

      // Build the steps
      const denomLatex = sqrtToLatex(denom);
      const step1 = `\\frac{${num}}{${denomLatex}}`;
      
      const step2Mult = `\\frac{${denomLatex}}{${denomLatex}}`;
      
      const step3Num = `${num} \\cdot ${denomLatex}`;
      const step3Denom = `(${denomLatex})^2 = ${radicand}`;
      const step3 = `\\frac{${step3Num}}{${step3Denom}}`;

      const finalNum = `${num}${radicand === '1' ? '' : '\\sqrt{' + radicand + '}'}`;
      const finalExpr = `\\frac{${finalNum}}{${radicand}}`;

      const steps_temp = [
        `\\text{Paso 1 - Expresión original:} \\quad ${step1}`,
        `\\text{Paso 2 - Multiplicar por:} \\quad ${step2Mult}`,
        `\\text{Paso 3 - Simplificado:} \\quad ${step3}`,
      ];

      setResult({
        steps: steps_temp,
        final: finalExpr,
      });
    } catch (err: any) {
      setError(err.message || 'Error al racionalizar');
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border px-4 py-3 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
          Escribe raíces como: <code>sqrt(2), sqrt(3)</code>
        </div>
        <div className="rounded-lg border px-4 py-3 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
          Resultado: <MathText expression="\\frac{\\sqrt{2}}{2}" className="inline-block" />
        </div>
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Numerador
          </label>
          <input
            type="text"
            value={numerator}
            onChange={(e) => setNumerator(e.target.value)}
            placeholder="Ej: 1"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Denominador (con raíz)
          </label>
          <input
            type="text"
            value={denominator}
            onChange={(e) => setDenominator(e.target.value)}
            placeholder="Ej: sqrt(2)"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Rationalize Button */}
      <button
        onClick={handleRationalize}
        className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
      >
        Racionalizar
      </button>

      {/* Error */}
      {error && (
        <div className="p-4 border-2 border-red-400 dark:border-red-600 rounded-lg">
          <p className="text-red-700 dark:text-red-300">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Steps */}
      {result && (
        <div className="space-y-3">
          {result.steps.map((step, i) => (
            <div key={i} className="p-4 rounded-lg border border-slate-300 dark:border-slate-700">
              <MathText expression={step} className="block text-slate-900 dark:text-white" />
            </div>
          ))}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="p-6 border-2 border-green-300 dark:border-green-600 rounded-lg">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
            Resultado Final
          </p>
          <MathText expression={result.final} className="block text-lg text-slate-900 dark:text-white" />
        </div>
      )}
    </div>
  );
};
