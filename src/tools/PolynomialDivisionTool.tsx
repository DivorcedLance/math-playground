import React, { useState } from 'react';
import Fraction from 'fraction.js';
import { MathText } from '../components';

function fractionToLatex(frac: Fraction): string {
  const num = Number(frac.s * frac.n);
  const den = Number(frac.d);
  if (den === 1) return String(num);
  return `\\frac{${num}}{${den}}`;
}

interface DivisionResult {
  quotient: Fraction[];
  remainder: Fraction[];
  quotientLatex: string;
  remainderLatex: string;
}

export const PolynomialDivisionTool: React.FC = () => {
  const [dividendCoeffs, setDividendCoeffs] = useState<Fraction[]>([
    new Fraction(1),
    new Fraction(2),
    new Fraction(-5),
    new Fraction(-6),
  ]);
  const [divisorCoeffs, setDivisorCoeffs] = useState<Fraction[]>([
    new Fraction(1),
    new Fraction(-2),
  ]);
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

  const updateDivisorCoeff = (index: number, value: string) => {
    try {
      const newCoeffs = [...divisorCoeffs];
      newCoeffs[index] = new Fraction(value.trim() || '0');
      setDivisorCoeffs(newCoeffs);
      setResult(null);
    } catch {
      // Invalid input
    }
  };

  const handleDivide = () => {
    try {
      setError('');
      setResult(null);

      // Remove leading zeros from divisor
      const divisor = [...divisorCoeffs];
      while (divisor.length > 1 && Number(divisor[0].n) === 0) {
        divisor.shift();
      }

      if (divisor.length === 0 || (divisor.length === 1 && Number(divisor[0].n) === 0)) {
        setError('El divisor no puede ser cero');
        return;
      }

      if (divisor.length > dividendCoeffs.length) {
        setError('El divisor debe tener grado menor o igual al dividendo');
        return;
      }

      const coeffs = [...dividendCoeffs];
      const quotient: Fraction[] = [];
      let remainder = [...coeffs];

      // Polynomial long division
      while (remainder.length >= divisor.length) {
        const leadingRatio = remainder[0].div(divisor[0]) as Fraction;
        quotient.push(leadingRatio);

        // Subtract leadingRatio * divisor from remainder
        for (let i = 0; i < divisor.length; i++) {
          remainder[i] = (remainder[i].sub(leadingRatio.mul(divisor[i]) as Fraction) as Fraction);
        }

        remainder.shift();
      }

      // Remove leading zeros from remainder
      while (remainder.length > 0 && Number(remainder[0].n) === 0) {
        remainder.shift();
      }

      if (remainder.length === 0) {
        remainder = [new Fraction(0)];
      }

      // Build quotient LaTeX
      let quotientLatex = '';
      if (quotient.length > 0) {
        const terms = quotient.map((c, i) => {
          const deg = quotient.length - 1 - i;
          const cLatex = fractionToLatex(c);
          if (deg === 0) return cLatex;
          if (deg === 1) return `${cLatex}x`;
          return `${cLatex}x^{${deg}}`;
        });
        quotientLatex = terms.join(' + ').replace(/\+ -/g, '- ');
      } else {
        quotientLatex = '0';
      }

      // Build remainder LaTeX
      let remainderLatex = '';
      if (remainder.length > 0 && !(remainder.length === 1 && Number(remainder[0].n) === 0)) {
        const terms = remainder.map((c, i) => {
          const deg = remainder.length - 1 - i;
          const cLatex = fractionToLatex(c);
          if (deg === 0) return cLatex;
          if (deg === 1) return `${cLatex}x`;
          return `${cLatex}x^{${deg}}`;
        });
        remainderLatex = terms.join(' + ').replace(/\+ -/g, '- ');
      } else {
        remainderLatex = '0';
      }

      setResult({
        quotient,
        remainder,
        quotientLatex,
        remainderLatex,
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
          División de Polinomios
        </p>
        <p className="text-slate-700 dark:text-slate-300 text-sm">
          Divide dos polinomios usando división polinómica. El divisor puede ser de cualquier grado menor o igual al dividendo.
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

      {/* Add/Remove degree buttons for dividend */}
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

      {/* Divisor Coefficients - Visual Grid */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-4">
          Coeficientes del Divisor (del grado mayor al término independiente):
        </label>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${divisorCoeffs.length}, minmax(100px, 1fr))` }}>
          {divisorCoeffs.map((coeff, index) => {
            const deg = divisorCoeffs.length - 1 - index;
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
                  onChange={(e) => updateDivisorCoeff(index, e.target.value)}
                  placeholder="0"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-b-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Remove degree buttons for divisor */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setDivisorCoeffs([...divisorCoeffs, new Fraction(0)]);
            setResult(null);
          }}
          className="flex-1 px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors font-semibold text-sm"
        >
          + Grado Divisor
        </button>
        <button
          onClick={() => {
            if (divisorCoeffs.length > 1) {
              setDivisorCoeffs(divisorCoeffs.slice(0, -1));
              setResult(null);
            }
          }}
          disabled={divisorCoeffs.length === 1}
          className="flex-1 px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-sm"
        >
          − Grado Divisor
        </button>
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
              setDivisorCoeffs([new Fraction(1), new Fraction(-2)]);
              setResult(null);
            }}
            className="px-3 py-2 text-xs font-semibold border-2 border-slate-300 dark:border-slate-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-600 transition-colors text-slate-900 dark:text-white"
          >
            x³ + 2x² - 5x - 6 ÷ (x - 2)
          </button>
          <button
            onClick={() => {
              setDividendCoeffs([new Fraction(1), new Fraction(0), new Fraction(-5), new Fraction(6)]);
              setDivisorCoeffs([new Fraction(1), new Fraction(-1)]);
              setResult(null);
            }}
            className="px-3 py-2 text-xs font-semibold border-2 border-slate-300 dark:border-slate-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-600 transition-colors text-slate-900 dark:text-white"
          >
            x³ - 5x + 6 ÷ (x - 1)
          </button>
          <button
            onClick={() => {
              setDividendCoeffs([new Fraction(1), new Fraction(0), new Fraction(-1)]);
              setDivisorCoeffs([new Fraction(1), new Fraction(1)]);
              setResult(null);
            }}
            className="px-3 py-2 text-xs font-semibold border-2 border-slate-300 dark:border-slate-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-600 transition-colors text-slate-900 dark:text-white"
          >
            x² - 1 ÷ (x + 1)
          </button>
          <button
            onClick={() => {
              setDividendCoeffs([new Fraction(1), new Fraction(2), new Fraction(1)]);
              setDivisorCoeffs([new Fraction(1), new Fraction(1)]);
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
        Dividir
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
          {/* Quotient */}
          <div className="p-6 border-2 border-blue-300 dark:border-blue-600 rounded-lg">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              Cociente Q(x):
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
              expression={result.remainderLatex}
              className="block text-lg text-slate-900 dark:text-white"
            />
          </div>

          {/* Check if exact division */}
          {result.remainderLatex === '0' && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-700 dark:text-yellow-300 font-semibold">
                ✓ División exacta: el divisor es un factor del dividendo.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
