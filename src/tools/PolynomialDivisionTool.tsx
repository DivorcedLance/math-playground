import React, { useState } from 'react';
import Fraction from 'fraction.js';
import { MathText } from '../components';

function fractionToLatex(frac: Fraction): string {
  const num = Number(frac.s * frac.n);
  const den = Number(frac.d);
  if (den === 1) return String(num);
  return `\\frac{${num}}{${den}}`;
}

interface HornerStep {
  row: Fraction;
  values: Fraction[];
}

interface DivisionResult {
  quotient: Fraction[];
  remainder: Fraction;
  steps: HornerStep[];
  divisor: Fraction;
  quotientLatex: string;
}

export const PolynomialDivisionTool: React.FC = () => {
  const [dividendCoeffs, setDividendCoeffs] = useState<Fraction[]>([
    new Fraction(1),
    new Fraction(2),
    new Fraction(-5),
    new Fraction(-6),
  ]);
  const [divisorRoot, setDivisorRoot] = useState<string>('2');
  const [result, setResult] = useState<DivisionResult | null>(null);
  const [error, setError] = useState<string>('');

  const updateDividendCoeff = (index: number, value: string) => {
    try {
      const newCoeffs = [...dividendCoeffs];
      newCoeffs[index] = new Fraction(value.trim() || '0');
      setDividendCoeffs(newCoeffs);
      setResult(null);
    } catch {
      // Invalid input
    }
  };

  const handleDivide = () => {
    try {
      setError('');
      setResult(null);

      const a = new Fraction(divisorRoot);
      const coeffs = [...dividendCoeffs];

      // Horner's method
      const quotient: Fraction[] = [];
      const steps: HornerStep[] = [];

      let value = new Fraction(0);

      // First step
      value = (coeffs[0] as Fraction);
      steps.push({
        row: a,
        values: [value],
      });

      // Remaining steps
      for (let i = 1; i < coeffs.length; i++) {
        value = (value.mul(a).add(coeffs[i]) as Fraction);
        quotient.push((value as Fraction));
        steps.push({
          row: a,
          values: [...steps[steps.length - 1].values, value],
        });
      }

      const remainder = quotient.pop() || new Fraction(0);
      quotient.unshift(coeffs[0]);

      // Build quotient LaTeX
      let quotientLatex = '';
      if (quotient.length > 1) {
        const terms = quotient.slice(0, -1).map((c, i) => {
          const deg = quotient.length - 2 - i;
          const cLatex = fractionToLatex(c);
          if (deg === 0) return cLatex;
          if (deg === 1) return `${cLatex}x`;
          return `${cLatex}x^{${deg}}`;
        });
        quotientLatex = terms.join(' + ').replace(/\+ -/g, '- ');
      } else {
        quotientLatex = '0';
      }

      setResult({
        quotient: quotient.slice(0, -1),
        remainder,
        steps,
        divisor: a,
        quotientLatex,
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Error al dividir');
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="border-2 border-blue-300 dark:border-blue-600 rounded-lg p-4">
        <p className="text-blue-900 dark:text-blue-300 font-semibold mb-2">
          División de Polinomios (Método de Horner)
        </p>
        <p className="text-slate-700 dark:text-slate-300 text-sm">
          Divide un polinomio entre un divisor lineal (x - a) usando el método de Horner. Ingresa los coeficientes del polinomio y el valor de la raíz.
        </p>
      </div>

      {/* Dividend Coefficients - Visual Grid */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-4">
          Coeficientes del Dividendo (del grado mayor al término independiente):
        </label>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${dividendCoeffs.length}, minmax(100px, 1fr))` }}>
          {dividendCoeffs.map((coeff, index) => {
            const deg = dividendCoeffs.length - 1 - index;
            let degLabel = '';
            if (deg === 0) degLabel = 'Indep.';
            else if (deg === 1) degLabel = 'x¹';
            else degLabel = `x^${deg}`;

            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="bg-slate-200 dark:bg-slate-700 rounded-t-lg p-2 text-center">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{degLabel}</p>
                </div>
                <input
                  type="text"
                  value={fractionToLatex(coeff)}
                  onChange={(e) => updateDividendCoeff(index, e.target.value)}
                  placeholder="0"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-b-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Remove degree buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setDividendCoeffs([...dividendCoeffs, new Fraction(0)]);
            setResult(null);
          }}
          className="flex-1 px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors font-semibold text-sm"
        >
          + Grado
        </button>
        <button
          onClick={() => {
            if (dividendCoeffs.length > 1) {
              setDividendCoeffs(dividendCoeffs.slice(0, -1));
              setResult(null);
            }
          }}
          disabled={dividendCoeffs.length === 1}
          className="flex-1 px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-sm"
        >
          − Grado
        </button>
      </div>

      {/* Divisor Root */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Raíz del divisor (valor de a en x - a):
        </label>
        <input
          type="text"
          value={divisorRoot}
          onChange={(e) => {
            setDivisorRoot(e.target.value);
            setResult(null);
          }}
          placeholder="Ej: 2, 1/2, -3"
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
        />
      </div>

      {/* Quick Presets */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Ejemplos rápidos
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => {
              setDividendCoeffs([new Fraction(1), new Fraction(2), new Fraction(-5), new Fraction(-6)]);
              setDivisorRoot('2');
              setResult(null);
            }}
            className="px-3 py-2 text-xs font-semibold border-2 border-slate-300 dark:border-slate-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-600 transition-colors text-slate-900 dark:text-white"
          >
            x³ + 2x² - 5x - 6 ÷ (x - 2)
          </button>
          <button
            onClick={() => {
              setDividendCoeffs([new Fraction(1), new Fraction(0), new Fraction(-5), new Fraction(6)]);
              setDivisorRoot('1');
              setResult(null);
            }}
            className="px-3 py-2 text-xs font-semibold border-2 border-slate-300 dark:border-slate-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-600 transition-colors text-slate-900 dark:text-white"
          >
            x³ - 5x + 6 ÷ (x - 1)
          </button>
          <button
            onClick={() => {
              setDividendCoeffs([new Fraction(1), new Fraction(0), new Fraction(-1)]);
              setDivisorRoot('-1');
              setResult(null);
            }}
            className="px-3 py-2 text-xs font-semibold border-2 border-slate-300 dark:border-slate-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-600 transition-colors text-slate-900 dark:text-white"
          >
            x² - 1 ÷ (x + 1)
          </button>
          <button
            onClick={() => {
              setDividendCoeffs([new Fraction(1), new Fraction(2), new Fraction(1)]);
              setDivisorRoot('-1');
              setResult(null);
            }}
            className="px-3 py-2 text-xs font-semibold border-2 border-slate-300 dark:border-slate-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-600 transition-colors text-slate-900 dark:text-white"
          >
            x² + 2x + 1 ÷ (x + 1)
          </button>
        </div>
      </div>

      {/* Divide Button */}
      <button
        onClick={handleDivide}
        className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
      >
        Dividir usando Horner
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
        <div className="space-y-6">
          {/* Horner's Grid */}
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-200 mb-4">
              Grilla del Procedimiento
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {/* Header row with coefficients */}
                  <tr>
                    <td className="border border-teal-300 dark:border-teal-700 p-2 bg-teal-100 dark:bg-teal-800 font-semibold text-center w-12">
                      {fractionToLatex(result.divisor)}
                    </td>
                    {dividendCoeffs.map((coeff, i) => (
                      <td
                        key={i}
                        className={`border border-teal-300 dark:border-teal-700 p-3 font-semibold text-center ${
                          i === 0 ? 'bg-teal-100 dark:bg-teal-800' : 'bg-sky-50 dark:bg-sky-900/30'
                        }`}
                      >
                        <span className="text-blue-700 dark:text-blue-300">
                          {fractionToLatex(coeff)}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {/* Empty row for visual separation  */}
                  <tr>
                    <td className="h-2 border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900"></td>
                    {dividendCoeffs.map((_, i) => (
                      <td
                        key={i}
                        className="h-2 border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900"
                      ></td>
                    ))}
                  </tr>
                  {/* Multiplication rows */}
                  {result.steps.slice(0, -1).map((step, rowIdx) => (
                    <tr key={`mult-${rowIdx}`}>
                      <td className="border border-teal-300 dark:border-teal-700 p-2 bg-red-100 dark:bg-red-900/30 font-semibold text-center text-red-700 dark:text-red-400 w-12">
                        {rowIdx === 0 ? '' : fractionToLatex(step.row)}
                      </td>
                      {dividendCoeffs.map((_, i) => (
                        <td key={i} className="border border-teal-300 dark:border-teal-700 p-3 text-center">
                          {i > 0 && rowIdx < result.steps.length - 1 && i < result.steps[rowIdx + 1].values.length ? (
                            <span className="text-red-600 dark:text-red-400">
                              {fractionToLatex(result.steps[rowIdx + 1].values[i - 1])}
                            </span>
                          ) : (
                            ''
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Result row */}
                  <tr>
                    <td className="border-t-2 border-teal-400 dark:border-teal-600 p-2 font-semibold text-center w-12"></td>
                    {result.quotient.map((coeff, i) => (
                      <td
                        key={i}
                        className="border-t-2 border-teal-400 dark:border-teal-600 p-3 font-semibold text-center bg-teal-100 dark:bg-teal-800"
                      >
                        <span className="text-green-700 dark:text-green-300">
                          {fractionToLatex(coeff)}
                        </span>
                      </td>
                    ))}
                    <td className="border-t-2 border-teal-400 dark:border-teal-600 p-3 font-semibold text-center bg-teal-100 dark:bg-teal-800">
                      <span className="text-green-700 dark:text-green-300">
                        {fractionToLatex(result.remainder)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quotient */}
          <div className="p-6 border-2 border-blue-300 dark:border-blue-600 rounded-lg">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              Polinomio Cociente Q(x):
            </p>
            <MathText
              expression={result.quotientLatex}
              className="block text-lg text-slate-900 dark:text-white"
            />
          </div>

          {/* Remainder */}
          <div className="p-6 border-2 border-green-300 dark:border-green-600 rounded-lg">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              Residuo R(x):
            </p>
            <MathText
              expression={fractionToLatex(result.remainder)}
              className="block text-lg text-slate-900 dark:text-white"
            />
          </div>

          {/* Check if exact division */}
          {Number(result.remainder.n) === 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-700 dark:text-yellow-300 font-semibold">
                ✓ División exacta: (x - {fractionToLatex(result.divisor)}) es un factor del polinomio.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
