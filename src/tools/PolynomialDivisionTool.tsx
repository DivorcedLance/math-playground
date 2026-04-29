import React, { useState } from 'react';
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
    const deg = coeffs.length - 1 - i;
    const c = coeffs[i];
    if (Number(c.n) === 0) continue;
    const cLatex = fractionToLatex(c);
    if (deg === 0) terms.push(cLatex);
    else if (deg === 1) terms.push(`${cLatex}x`);
    else terms.push(`${cLatex}x^{${deg}}`);
  }
  return terms.length > 0 ? terms.join(' + ').replace(/\+ -/g, '- ') : '0';
}

interface HornerGrid {
  normalizedDivisor: Fraction[];
  leadingCoeff: Fraction;
  rowLabels: Fraction[];
  productRows: Fraction[][];
  finalRow: Fraction[];
}

interface DivisionResult {
  quotient: Fraction[];
  quotientNorm: Fraction[];
  remainder: Fraction[];
  quotientLatex: string;
  remainderLatex: string;
  horner: HornerGrid;
}

export const PolynomialDivisionTool: React.FC = () => {
  const [dividendCoeffs, setDividendCoeffs] = useState<Fraction[]>([
    new Fraction(5),
    new Fraction(4),
    new Fraction(9),
    new Fraction(-3),
    new Fraction(2),
    new Fraction(10),
    new Fraction(9),
    new Fraction(5),
    new Fraction(1),
  ]);
  const [divisorCoeffs, setDivisorCoeffs] = useState<Fraction[]>([
    new Fraction(1),
    new Fraction(3),
    new Fraction(2),
    new Fraction(1),
    new Fraction(0),
    new Fraction(1),
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
      // invalid input
    }
  };

  const updateDivisorCoeff = (index: number, value: string) => {
    try {
      const newCoeffs = [...divisorCoeffs];
      newCoeffs[index] = new Fraction(value.trim() || '0');
      setDivisorCoeffs(newCoeffs);
      setResult(null);
    } catch {
      // invalid input
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

      if (divisor.length > dividend.length) {
        setError('El grado del divisor debe ser menor o igual al grado del dividendo.');
        return;
      }

      const n = dividend.length - 1;
      const m = divisor.length - 1;
      const leading = divisor[0];
      const normalizedDivisor = divisor.map((c) => (c.div(leading) as Fraction));
      const dTail = normalizedDivisor.slice(1);

      const quotientLen = n - m + 1;

      // Horner generalizado (division sintetica): solo propaga terminos del cociente.
      const out = dividend.map((c) => new Fraction(c));
      const quotientNorm: Fraction[] = [];

      for (let i = 0; i < quotientLen; i++) {
        const qi = out[i];
        quotientNorm.push(qi);
        for (let j = 1; j <= m; j++) {
          out[i + j] = out[i + j].sub(qi.mul(dTail[j - 1]) as Fraction) as Fraction;
        }
      }

      const remainder = out.slice(quotientLen);
      const quotient = quotientNorm.map((q) => (q.div(leading) as Fraction));

      const rowLabels = dTail.map((d) => (d.mul(-1) as Fraction));
      const productRows = quotientNorm.map((q) =>
        dTail.map((d) => (d.mul(q).mul(-1) as Fraction))
      );

      setResult({
        quotient,
        quotientNorm,
        remainder,
        quotientLatex: polynomialToLatex(quotient),
        remainderLatex: polynomialToLatex(remainder),
        horner: {
          normalizedDivisor,
          leadingCoeff: leading,
          rowLabels,
          productRows,
          finalRow: out,
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Error en la division.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-blue-300 dark:border-blue-600 rounded-lg p-4">
        <p className="text-blue-900 dark:text-blue-300 font-semibold mb-2">Division de Polinomios (Horner Generalizado)</p>
        <p className="text-slate-700 dark:text-slate-300 text-sm">
          Se muestra la grilla del procedimiento de Horner para divisores de cualquier grado menor o igual al dividendo.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-4">
          Coeficientes del Dividendo (de mayor grado a termino independiente)
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
            setDividendCoeffs([...dividendCoeffs, new Fraction(0)]);
            setResult(null);
          }}
          className="flex-1 px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors font-semibold text-sm"
        >
          + Grado Dividendo
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
          - Grado Dividendo
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-4">
          Coeficientes del Divisor (de mayor grado a termino independiente)
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
          - Grado Divisor
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
          <p className="text-red-700 dark:text-red-300"><strong>Error:</strong> {error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="p-6 rounded-lg border-2 border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/20 overflow-x-auto">
            <h3 className="font-semibold text-teal-900 dark:text-teal-300 mb-3">Grilla del Procedimiento de Horner</h3>
            {Number(result.horner.leadingCoeff.n) !== Number(result.horner.leadingCoeff.d) && (
              <p className="text-xs text-teal-800 dark:text-teal-300 mb-3">
                Divisor normalizado por el coeficiente lider {fractionToLatex(result.horner.leadingCoeff)} para construir la grilla.
              </p>
            )}
            <table className="min-w-full border-collapse text-sm">
              <tbody>
                <tr>
                  <td className="border-b-2 border-r-2 border-slate-600 dark:border-slate-400 p-3 text-center font-semibold text-blue-700 dark:text-blue-300 w-16">
                    {fractionToLatex(result.horner.normalizedDivisor[0])}
                  </td>
                  {dividendCoeffs.map((c, i) => (
                    <td
                      key={`a-${i}`}
                      className={`border-b-2 border-slate-600 dark:border-slate-400 p-3 text-center font-semibold text-blue-700 dark:text-blue-300 ${
                        i === result.quotient.length - 1 ? 'border-r-2 border-dashed border-r-slate-500 dark:border-r-slate-400' : ''
                      }`}
                    >
                      {fractionToLatex(c)}
                    </td>
                  ))}
                </tr>

                {result.horner.productRows.map((row, rowIdx) => (
                  <tr key={`row-${rowIdx}`}>
                    <td className="border-r-2 border-slate-600 dark:border-slate-400 p-3 text-center font-semibold text-red-600 dark:text-red-400">
                      {fractionToLatex(result.horner.rowLabels[rowIdx])}
                    </td>
                    {Array.from({ length: rowIdx + 1 }).map((_, blankIdx) => (
                      <td key={`blank-${rowIdx}-${blankIdx}`} className="p-3"></td>
                    ))}
                    {row.map((cell, colIdx) => (
                      <td
                        key={`cell-${rowIdx}-${colIdx}`}
                        className="p-3 text-center text-slate-800 dark:text-slate-200"
                      >
                        {cell ? fractionToLatex(cell) : ''}
                      </td>
                    ))}
                    {Array.from({ length: Math.max(0, result.horner.finalRow.length - row.length - rowIdx) }).map((_, tailIdx) => (
                      <td key={`tail-${rowIdx}-${tailIdx}`} className="p-3"></td>
                    ))}
                  </tr>
                ))}

                <tr>
                  <td className="border-t-2 border-r-2 border-slate-600 dark:border-slate-400 p-3"></td>
                  {result.horner.finalRow.map((bVal, i) => (
                    <td
                      key={`b-${i}`}
                      className={`border-t-2 border-slate-600 dark:border-slate-400 p-3 text-center font-semibold text-green-700 dark:text-green-300 ${
                        i === result.quotient.length - 1 ? 'border-r-2 border-dashed border-r-slate-500 dark:border-r-slate-400' : ''
                      }`}
                    >
                      {fractionToLatex(bVal)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-6 border-2 border-blue-300 dark:border-blue-600 rounded-lg">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Polinomio Cociente Q(x)</p>
            <MathText expression={result.quotientLatex} className="block text-lg text-slate-900 dark:text-white" />
          </div>

          <div className="p-6 border-2 border-green-300 dark:border-green-600 rounded-lg">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Polinomio Residuo R(x)</p>
            <MathText expression={result.remainderLatex} className="block text-lg text-slate-900 dark:text-white" />
          </div>
        </div>
      )}
    </div>
  );
};
