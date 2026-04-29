import React, { useState, useEffect } from 'react';
import Fraction from 'fraction.js';
import { MathText } from '../components';

function fractionToLatex(frac: Fraction): string {
  const num = Number(frac.s * frac.n);
  const den = Number(frac.d);
  if (den === 1) return String(num);
  return `\\frac{${num}}{${den}}`;
}

function fractionToInput(frac: Fraction): string {
  const num = Number(frac.s * frac.n);
  const den = Number(frac.d);
  if (den === 1) return String(num);
  return `${num}/${den}`;
}

function polynomialToLatex(coeffs: Fraction[]): string {
  const terms: string[] = [];

  for (let i = 0; i < coeffs.length; i++) {
    const coeff = coeffs[i];
    if (Number(coeff.n) === 0) continue;

    const power = coeffs.length - 1 - i;
    const coeffLatex = fractionToLatex(coeff);

    if (power === 0) {
      terms.push(coeffLatex);
    } else if (power === 1) {
      terms.push(`${coeffLatex}x`);
    } else {
      terms.push(`${coeffLatex}x^{${power}}`);
    }
  }

  return terms.length > 0 ? terms.join(' + ').replace(/\+ -/g, '- ') : '0';
}

interface DivisionResult {
  grid: (Fraction | null)[][];
  bottomRow: (Fraction | null)[];
  quotient: Fraction[];
  remainder: Fraction[];
  quotientLatex: string;
  remainderLatex: string;
  quotientLen: number;
  divisorLen: number;
  numCols: number;
  separatorIndex: number;
}

const DEFAULT_DIVIDEND = [
  new Fraction(1),
  new Fraction(2),
  new Fraction(3),
  new Fraction(4),
  new Fraction(5),
  new Fraction(6),
];

const DEFAULT_DIVISOR = [
  new Fraction(1),
  new Fraction(1),
  new Fraction(1),
  new Fraction(1),
];

const STORAGE_KEY = 'polynomial-division-tool';

export const PolynomialDivisionTool: React.FC = () => {
  const [dividendCoeffs, setDividendCoeffs] = useState<Fraction[]>(DEFAULT_DIVIDEND);
  const [divisorCoeffs, setDivisorCoeffs] = useState<Fraction[]>(DEFAULT_DIVISOR);
  const [result, setResult] = useState<DivisionResult | null>(null);
  const [error, setError] = useState<string>('');

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.dividend && data.dividend.length > 0) {
          setDividendCoeffs(data.dividend.map((c: any) => new Fraction(c.n || 0, c.d || 1)));
        }
        if (data.divisor && data.divisor.length > 0) {
          setDivisorCoeffs(data.divisor.map((c: any) => new Fraction(c.n || 0, c.d || 1)));
        }
      }
    } catch (err) {
      console.error('Error cargando datos del localStorage:', err);
    }
  }, []);

  // Guardar datos en localStorage cuando cambien los coeficientes
  useEffect(() => {
    try {
      const data = {
        dividend: dividendCoeffs.map(f => ({ n: f.n, d: f.d })),
        divisor: divisorCoeffs.map(f => ({ n: f.n, d: f.d })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error guardando datos en localStorage:', err);
    }
  }, [dividendCoeffs, divisorCoeffs]);

  const updateDividendCoeff = (index: number, value: string) => {
    try {
      const next = [...dividendCoeffs];
      next[index] = new Fraction(value.trim() || '0');
      setDividendCoeffs(next);
      setResult(null);
    } catch {
      // Ignore invalid input while typing.
    }
  };

  const updateDivisorCoeff = (index: number, value: string) => {
    try {
      const next = [...divisorCoeffs];
      next[index] = new Fraction(value.trim() || '0');
      setDivisorCoeffs(next);
      setResult(null);
    } catch {
      // Ignore invalid input while typing.
    }
  };

  const handleDivide = () => {
    try {
      setError('');
      setResult(null);

      const dividend = [...dividendCoeffs];
      const divisor = [...divisorCoeffs];

      while (dividend.length > 1 && Number(dividend[0].n) === 0) dividend.shift();
      while (divisor.length > 1 && Number(divisor[0].n) === 0) divisor.shift();

      if (divisor.length === 0 || (divisor.length === 1 && Number(divisor[0].n) === 0)) {
        setError('El divisor no puede ser cero.');
        return;
      }

      if (dividend.length < divisor.length) {
        setError('El grado del dividendo no puede ser menor que el grado del divisor.');
        return;
      }

      const degDividend = dividend.length - 1;
      const degDivisor = divisor.length - 1;
      const quotientLen = degDividend - degDivisor + 1;
      const numCols = degDividend + 2;
      const gridRows = Math.max(degDivisor, quotientLen) + 1;
      const separatorIndex = quotientLen;

      const grid: (Fraction | null)[][] = Array.from({ length: gridRows }, () => Array(numCols).fill(null));
      const bottomRow: (Fraction | null)[] = Array(numCols).fill(null);

      grid[0][0] = divisor[0];
      for (let i = 0; i <= degDividend; i++) {
        grid[0][i + 1] = dividend[i];
      }

      for (let i = 1; i <= degDivisor; i++) {
        grid[i][0] = divisor[i].mul(-1) as Fraction;
      }

      const quotient: Fraction[] = [];

      for (let step = 1; step <= quotientLen; step++) {
        let sum = new Fraction(0);
        for (let row = 0; row < gridRows; row++) {
          const value = grid[row][step];
          if (value) {
            sum = sum.add(value) as Fraction;
          }
        }

        const q = sum.div(divisor[0]) as Fraction;
        quotient.push(q);
        bottomRow[step] = q;

        for (let k = 1; k <= degDivisor; k++) {
          const prod = q.mul(divisor[k]).mul(-1) as Fraction;
          const targetRow = step;
          const targetCol = step + k;
          if (targetRow < gridRows && targetCol < numCols) {
            grid[targetRow][targetCol] = prod;
          }
        }
      }

      const remainder: Fraction[] = [];
      for (let col = quotientLen + 1; col <= degDividend + 1; col++) {
        let sum = new Fraction(0);
        for (let row = 0; row < gridRows; row++) {
          const value = grid[row][col];
          if (value) {
            sum = sum.add(value) as Fraction;
          }
        }
        remainder.push(sum);
        bottomRow[col] = sum;
      }

      if (remainder.length === 0) {
        remainder.push(new Fraction(0));
      }

      setResult({
        grid,
        bottomRow,
        quotient,
        remainder,
        quotientLatex: polynomialToLatex(quotient),
        remainderLatex: polynomialToLatex(remainder),
        quotientLen,
        divisorLen: degDivisor,
        numCols,
        separatorIndex,
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Error en la división.');
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-blue-300 dark:border-blue-600 rounded-lg p-4">
        <p className="text-blue-900 dark:text-blue-300 font-semibold mb-2">
          División de Polinomios (Horner Generalizado)
        </p>
        <p className="text-slate-700 dark:text-slate-300 text-sm">
          La grilla sigue la misma estructura del HTML de referencia, con los productos desplazados una columna por cada paso.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-4">
          Coeficientes del Dividendo (de mayor grado a término independiente)
        </label>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${dividendCoeffs.length}, minmax(92px, 1fr))` }}>
          {dividendCoeffs.map((coeff, index) => {
            const deg = dividendCoeffs.length - 1 - index;
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
                  onChange={(e) => updateDividendCoeff(index, e.target.value)}
                  placeholder="0"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
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
          - Grado Dividendo
        </button>
        <button
          onClick={() => {
            setDividendCoeffs([...dividendCoeffs, new Fraction(0)]);
            setResult(null);
          }}
          className="flex-1 px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors font-semibold text-sm"
        >
          + Grado Dividendo
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-4">
          Coeficientes del Divisor (de mayor grado a término independiente)
        </label>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${divisorCoeffs.length}, minmax(92px, 1fr))` }}>
          {divisorCoeffs.map((coeff, index) => {
            const deg = divisorCoeffs.length - 1 - index;
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
                  onChange={(e) => updateDivisorCoeff(index, e.target.value)}
                  placeholder="0"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
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
          - Grado Divisor
        </button>
        <button
          onClick={() => {
            setDivisorCoeffs([...divisorCoeffs, new Fraction(0)]);
            setResult(null);
          }}
          className="flex-1 px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors font-semibold text-sm"
        >
          + Grado Divisor
        </button>
      </div>

      <button
        onClick={handleDivide}
        className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
      >
        Dividir
      </button>

      {error && (
        <div className="p-4 border-2 border-red-400 dark:border-red-600 rounded-lg">
          <p className="text-red-700 dark:text-red-300">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="p-6 rounded-lg border-2 border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/20 overflow-x-auto">
            <h3 className="font-semibold text-teal-900 dark:text-teal-300 mb-3">
              Grilla del Procedimiento de Horner
            </h3>
            <table className="min-w-full border-collapse text-sm">
              <tbody>
                <tr>
                  <td className="border-b-2 border-r-2 border-slate-600 dark:border-slate-400 p-3 text-center font-semibold text-blue-700 dark:text-blue-300 w-16">
                    {fractionToLatex(new Fraction(1))}
                  </td>
                  {Array.from({ length: result.numCols - 1 }).map((_, i) => {
                    const value = result.grid[0][i + 1];
                    const isSeparator = i === result.separatorIndex - 1;
                    return (
                      <td
                        key={`top-${i}`}
                        className={`border-b-2 border-slate-600 dark:border-slate-400 p-3 text-center font-semibold text-blue-700 dark:text-blue-300 ${
                          isSeparator ? 'border-r-2 border-dashed border-r-slate-500 dark:border-r-slate-400' : ''
                        }`}
                      >
                        {value ? fractionToLatex(value) : ''}
                      </td>
                    );
                  })}
                </tr>

                {result.grid.slice(1).map((row, rowIdx) => {
                  const rowNumber = rowIdx + 1;
                  const leftValue = row[0];
                  const isProductRow = rowNumber <= result.quotientLen;

                  return (
                    <tr key={`row-${rowIdx}`}>
                      <td className="border-r-2 border-slate-600 dark:border-slate-400 p-3 text-center font-semibold text-red-600 dark:text-red-400">
                        {rowNumber <= result.divisorLen && leftValue ? fractionToLatex(leftValue) : ''}
                      </td>
                      {row.slice(1).map((cell, colIdx) => {
                        const isSeparator = colIdx === result.separatorIndex - 1;
                        return (
                          <td
                            key={`cell-${rowIdx}-${colIdx}`}
                            className={`p-3 text-center text-slate-800 dark:text-slate-200 ${
                              isSeparator ? 'border-r-2 border-dashed border-r-slate-500 dark:border-r-slate-400' : ''
                            }`}
                          >
                            {isProductRow && cell ? fractionToLatex(cell) : ''}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                <tr>
                  <td className="border-t-2 border-r-2 border-slate-600 dark:border-slate-400 p-3"></td>
                  {result.bottomRow.slice(1).map((value, i) => {
                    const isSeparator = i === result.separatorIndex - 1;
                    return (
                      <td
                        key={`bottom-${i}`}
                        className={`border-t-2 border-slate-600 dark:border-slate-400 p-3 text-center font-semibold text-green-700 dark:text-green-300 ${
                          isSeparator ? 'border-r-2 border-dashed border-r-slate-500 dark:border-r-slate-400' : ''
                        }`}
                      >
                        {value ? fractionToLatex(value) : ''}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-6 border-2 border-blue-300 dark:border-blue-600 rounded-lg">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              Polinomio Cociente Q(x)
            </p>
            <MathText expression={result.quotientLatex} className="block text-lg text-slate-900 dark:text-white" />
          </div>

          <div className="p-6 border-2 border-green-300 dark:border-green-600 rounded-lg">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              Polinomio Residuo R(x)
            </p>
            <MathText expression={result.remainderLatex} className="block text-lg text-slate-900 dark:text-white" />
          </div>
        </div>
      )}
    </div>
  );
};
