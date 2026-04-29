import React, { useState } from 'react';
import Fraction from 'fraction.js';
import { MathText } from '../components';
import { fractionToLatex } from '../utils/fractions';

interface PolyResult {
  steps: string[];
  result: Fraction;
  polynomialLatex: string;
}

function fractionOrOneLatex(value: Fraction): string {
  return fractionToLatex({ numerator: Number(value.s * value.n), denominator: Number(value.d) });
}

function fractionToInput(value: Fraction): string {
  const num = Number(value.s * value.n);
  const den = Number(value.d);
  if (den === 1) return String(num);
  return `${num}/${den}`;
}

export const PolynomialEvalTool: React.FC = () => {
  const [coefficients, setCoefficients] = useState<Fraction[]>([
    new Fraction(1),
    new Fraction(0),
    new Fraction(-5),
    new Fraction(6),
  ]);
  const [xValue, setXValue] = useState<string>('2');
  const [result, setResult] = useState<PolyResult | null>(null);
  const [error, setError] = useState<string>('');

  const updateCoefficient = (index: number, value: string) => {
    try {
      const newCoeffs = [...coefficients];
      newCoeffs[index] = new Fraction(value.trim() || '0');
      setCoefficients(newCoeffs);
      setResult(null);
    } catch {
      // Invalid fraction, ignore
    }
  };

  const handleEvaluate = () => {
    try {
      setError('');

      const x = new Fraction(xValue);

      // Build polynomial LaTeX representation
      const polyTerms: string[] = [];
      for (let i = 0; i < coefficients.length; i++) {
        const deg = coefficients.length - 1 - i;
        const coeff = coefficients[i];
        const coeffNum = Number(coeff.n);

        if (coeffNum === 0) continue;

        const coeffLatex = fractionOrOneLatex(coeff);
        if (deg === 0) {
          polyTerms.push(coeffLatex);
        } else if (deg === 1) {
          polyTerms.push(`${coeffLatex}x`);
        } else {
          polyTerms.push(`${coeffLatex}x^{${deg}}`);
        }
      }
      const polynomialLatex = polyTerms.join(' + ').replace(/\+ -/g, '- ');

      // Evaluate polynomial
      let value = new Fraction(0);
      const steps: string[] = [];

      for (let i = 0; i < coefficients.length; i++) {
        const degree = coefficients.length - 1 - i;
        const coeff = coefficients[i];
        const coeffLatex = fractionOrOneLatex(coeff);
        const coeffNum = Number(coeff.s * coeff.n);
        const sign = coeffNum < 0 ? '' : '+ ';

        if (degree === 0) {
          value = value.add(coeff) as Fraction;
          steps.push(`${sign}${coeffLatex}`);
        } else {
          let xPower = new Fraction(1);
          for (let p = 0; p < degree; p++) {
            xPower = xPower.mul(x) as Fraction;
          }
          const term = coeff.mul(xPower) as Fraction;
          value = value.add(term) as Fraction;

          if (degree === 1) {
            steps.push(`${sign}${coeffLatex}\\cdot ${fractionToLatex({ numerator: Number(x.s * x.n), denominator: Number(x.d) })}`);
          } else {
            steps.push(`${sign}${coeffLatex}\\cdot ${fractionToLatex({ numerator: Number(x.s * x.n), denominator: Number(x.d) })}^{${degree}}`);
          }
        }
      }

      setResult({
        steps,
        result: value,
        polynomialLatex,
      });
    } catch (err: any) {
      setError(err.message || 'Error al evaluar el polinomio');
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Coefficients Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-4">
          Coeficientes
        </label>
        <div className="overflow-x-auto">
          <div className="grid gap-4 min-w-min" style={{ gridTemplateColumns: `repeat(${coefficients.length}, minmax(92px, 1fr))` }}>
          {coefficients.map((coeff, index) => {
            const deg = coefficients.length - 1 - index;

            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-2 text-center min-h-12 flex items-center justify-center">
                  {deg === 0 ? (
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Indep.</span>
                  ) : (
                    <MathText expression={`x^{${deg}}`} className="text-slate-900 dark:text-white font-semibold" />
                  )}
                </div>
                <input
                  type="text"
                  value={fractionToInput(coeff)}
                  onChange={(e) => updateCoefficient(index, e.target.value)}
                  placeholder="0"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
            );
          })}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            if (coefficients.length > 1) {
              setCoefficients(coefficients.slice(0, -1));
              setResult(null);
            }
          }}
          disabled={coefficients.length === 1}
          className="flex-1 px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-sm"
        >
          - Grado
        </button>
        <button
          onClick={() => {
            setCoefficients([...coefficients, new Fraction(0)]);
            setResult(null);
          }}
          className="flex-1 px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors font-semibold text-sm"
        >
          + Grado
        </button>
      </div>

      {/* X Value */}
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

      {/* Evaluate Button */}
      <button
        onClick={handleEvaluate}
        className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
      >
        Evaluar
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
        <div className="space-y-4">
          {/* Polynomial */}
          <div className="p-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              Polinomio
            </p>
            <MathText expression={`P(x) = ${result.polynomialLatex}`} className="block text-slate-900 dark:text-white" />
          </div>

          {/* Steps */}
          <div className="p-6 rounded-lg border border-slate-300 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
              Evaluación paso a paso
            </h3>
            <div className="text-slate-700 dark:text-slate-300 text-sm">
              <MathText expression={result.steps.join(' ')} className="block text-slate-900 dark:text-white" />
            </div>
          </div>

          {/* Final Result */}
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
              Resultado
            </h3>
            <div className="p-4 bg-white dark:bg-slate-900 rounded border border-green-300 dark:border-green-700">
                <MathText
                  expression={`P(${fractionToLatex({ numerator: Number(new Fraction(xValue).s * new Fraction(xValue).n), denominator: Number(new Fraction(xValue).d) })}) = ${fractionOrOneLatex(result.result)}`}
                  className="block text-xl text-slate-900 dark:text-white"
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
