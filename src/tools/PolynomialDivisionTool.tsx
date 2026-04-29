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
  steps: string[];
}

export const PolynomialDivisionTool: React.FC = () => {
  const [dividendDegree, setDividendDegree] = useState<number>(3);
  const [divisorDegree, setDivisorDegree] = useState<number>(1);
  const [dividendCoeffs, setDividendCoeffs] = useState<Fraction[]>([
    new Fraction(1),
    new Fraction(0),
    new Fraction(-5),
    new Fraction(6),
  ]);
  const [divisorCoeffs, setDivisorCoeffs] = useState<Fraction[]>([
    new Fraction(1),
    new Fraction(-1),
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
      let divisor = [...divisorCoeffs];
      while (divisor.length > 1 && Number(divisor[0].n) === 0) {
        divisor.shift();
      }

      if (divisor.length === 0 || (divisor.length === 1 && Number(divisor[0].n) === 0)) {
        setError('El divisor no puede ser cero');
        return;
      }

      const dividend = [...dividendCoeffs];
      const leadingCoeff = divisor[0];
      const quotient: Fraction[] = [];
      let remainder = [...dividend];

      // Polynomial long division
      while (remainder.length >= divisor.length) {
        const leadingTerm = (remainder[0].div(leadingCoeff) as Fraction);
        quotient.push(leadingTerm);

        // Subtract leadingTerm * divisor from remainder
        for (let i = 0; i < divisor.length; i++) {
          remainder[i] = (remainder[i].sub(leadingTerm.mul(divisor[i]) as Fraction) as Fraction);
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

      setResult({
        quotient,
        remainder,
        steps: [], // Steps generation can be added later
      });
    } catch (err: any) {
      setError(err.message || 'Error en la división');
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
          Divide dos polinomios usando el método de Horner. El divisor puede ser de cualquier grado.
        </p>
      </div>

      {/* Dividend Section */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
          Dividendo
        </label>
        <div className="space-y-2">
          {dividendCoeffs.map((coeff, index) => {
            const deg = dividendCoeffs.length - 1 - index;
            let label = '';
            if (deg === 0) label = 'Término independiente';
            else if (deg === 1) label = 'Coeficiente de x';
            else label = `Coeficiente de x^${deg}`;

            return (
              <div key={index} className="flex items-center gap-2">
                <label className="text-xs text-slate-600 dark:text-slate-400 font-medium w-32">
                  {label}
                </label>
                <input
                  type="text"
                  value={fractionToLatex(coeff)}
                  onChange={(e) => updateDividendCoeff(index, e.target.value)}
                  placeholder="0"
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Divisor Section */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
          Divisor
        </label>
        <div className="space-y-2">
          {divisorCoeffs.map((coeff, index) => {
            const deg = divisorCoeffs.length - 1 - index;
            let label = '';
            if (deg === 0) label = 'Término independiente';
            else if (deg === 1) label = 'Coeficiente de x';
            else label = `Coeficiente de x^${deg}`;

            return (
              <div key={index} className="flex items-center gap-2">
                <label className="text-xs text-slate-600 dark:text-slate-400 font-medium w-32">
                  {label}
                </label>
                <input
                  type="text"
                  value={fractionToLatex(coeff)}
                  onChange={(e) => updateDivisorCoeff(index, e.target.value)}
                  placeholder="0"
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Ejemplos rápidos
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
        <div className="space-y-4">
          {/* Quotient */}
          <div className="p-6 border-2 border-blue-300 dark:border-blue-600 rounded-lg">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              Cociente
            </p>
            {result.quotient.length > 0 ? (
              <MathText
                expression={result.quotient.map(c => fractionToLatex(c)).join(' + ').replace(/\+ -/g, '- ')}
                className="block text-lg text-slate-900 dark:text-white"
              />
            ) : (
              <p className="text-slate-900 dark:text-white">0</p>
            )}
          </div>

          {/* Remainder */}
          <div className="p-6 border-2 border-green-300 dark:border-green-600 rounded-lg">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              Residuo
            </p>
            <MathText
              expression={result.remainder.map(c => fractionToLatex(c)).join(' + ').replace(/\+ -/g, '- ') || '0'}
              className="block text-lg text-slate-900 dark:text-white"
            />
          </div>

          {/* Check if exact division */}
          {result.remainder.length === 1 && Number(result.remainder[0].n) === 0 && (
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
