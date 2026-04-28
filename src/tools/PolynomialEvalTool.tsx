import React, { useState } from 'react';
import Fraction from 'fraction.js';
import { fractionToString } from '../utils/fractions';

interface PolyResult {
  steps: string[];
  result: Fraction;
}

export const PolynomialEvalTool: React.FC = () => {
  const [coefficients, setCoefficients] = useState<string>('1,0,-5,6');
  const [xValue, setXValue] = useState<string>('2');
  const [result, setResult] = useState<PolyResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleEvaluate = () => {
    try {
      setError('');

      const coeffs = coefficients
        .split(',')
        .map(c => c.trim())
        .map(c => new Fraction(c));

      const x = new Fraction(xValue);

      // Descartes' method: evaluate polynomial
      let value = new Fraction(0);
      const steps: string[] = [];

      for (let i = 0; i < coeffs.length; i++) {
        const degree = coeffs.length - 1 - i;
        const coeff = coeffs[i];

        if (degree === 0) {
          value = value.add(coeff) as Fraction;
          steps.push(`+ ${fractionToString(coeff as any)}`);
        } else {
          let xPower = new Fraction(1);
          for (let p = 0; p < degree; p++) {
            xPower = xPower.mul(x) as Fraction;
          }
          let term = coeff.mul(xPower) as Fraction;
          value = value.add(term) as Fraction;

          if (degree === 1) {
            steps.push(`+ ${fractionToString(coeff as any)} × ${fractionToString(x as any)}`);
          } else {
            steps.push(`+ ${fractionToString(coeff as any)} × ${fractionToString(x as any)}^${degree}`);
          }
        }
      }

      setResult({
        steps,
        result: value,
      });
    } catch (err: any) {
      setError(err.message || 'Error al evaluar el polinomio');
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-900 dark:text-blue-300 font-semibold mb-2">
          Evaluación de Polinomios
        </p>
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          Ingresa los coeficientes del polinomio de mayor a menor grado, separados por comas.
        </p>
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Coeficientes (de mayor a menor grado)
          </label>
          <input
            type="text"
            value={coefficients}
            onChange={(e) => setCoefficients(e.target.value)}
            placeholder="Ej: 1,0,-5,6"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Para x³ - 5x + 6, ingresa: 1,0,-5,6
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Valor de x
          </label>
          <input
            type="text"
            value={xValue}
            onChange={(e) => setXValue(e.target.value)}
            placeholder="Ej: 2, 1/2, -3"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>
      </div>

      {/* Evaluate Button */}
      <button
        onClick={handleEvaluate}
        className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
      >
        Evaluar
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
        <div className="space-y-4">
          {/* Steps */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
              Evaluación
            </h3>
            <div className="space-y-2 font-mono text-slate-700 dark:text-slate-300 text-sm">
              {result.steps.map((step, i) => (
                <p key={i}>{step}</p>
              ))}
            </div>
          </div>

          {/* Final Result */}
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
              Resultado
            </h3>
            <div className="p-4 bg-white dark:bg-slate-900 rounded border border-green-300 dark:border-green-700">
              <p className="font-mono text-slate-900 dark:text-white text-lg">
                P({fractionToString(new Fraction(xValue) as any)}) = {fractionToString(result.result as any)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
