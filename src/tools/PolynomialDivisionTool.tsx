import React, { useState } from 'react';
import Fraction from 'fraction.js';
import { MathText } from '../components';

function fractionToLatex(frac: Fraction): string {
  const num = Number(frac.s * frac.n);
  const den = Number(frac.d);
  if (den === 1) return String(num);
  return `\\frac{${num}}{${den}}`;
}

const PRESET_POLYNOMIALS = {
  'x3-5x+6': { name: 'x³ - 5x + 6', coeffs: '1,0,-5,6', root: '1' },
  'x3+2x2-5x-6': { name: 'x³ + 2x² - 5x - 6', coeffs: '1,2,-5,-6', root: '-1' },
  'x2-1': { name: 'x² - 1', coeffs: '1,0,-1', root: '1' },
  'x2-4': { name: 'x² - 4', coeffs: '1,0,-4', root: '2' },
};

export const PolynomialDivisionTool: React.FC = () => {
  const [dividend, setDividend] = useState<string>('1,0,-5,6');
  const [root, setRoot] = useState<string>('1');
  const [hornerSteps, setHornerSteps] = useState<Fraction[] | null>(null);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlePreset = (key: string) => {
    const preset = PRESET_POLYNOMIALS[key as keyof typeof PRESET_POLYNOMIALS];
    setDividend(preset.coeffs);
    setRoot(preset.root);
    setHornerSteps(null);
    setResult('');
    setError('');
  };

  const handleDivide = () => {
    try {
      setError('');
      setHornerSteps(null);
      setResult('');

      const coeffs = dividend.split(',').map(c => new Fraction(c.trim()));
      const r = new Fraction(root.trim());

      if (coeffs.length === 0) {
        setError('Ingresa al menos un coeficiente');
        return;
      }

      // Horner's method (synthetic division)
      const steps: Fraction[] = [coeffs[0]];

      for (let i = 1; i < coeffs.length; i++) {
        const newVal = (steps[i - 1].mul(r) as Fraction).add(coeffs[i]) as Fraction;
        steps.push(newVal);
      }

      setHornerSteps(steps);

      const remainder = steps[steps.length - 1];
      const quotient = steps.slice(0, -1);

      let resultStr = '';
      if (quotient.length > 0) {
        resultStr = quotient.map(c => fractionToLatex(c)).join(' \\ \\text{, } \\ ');
      }

      if (Number(remainder.n) === 0) {
        setResult(
          `\\text{Cociente: } ${resultStr} \\\\
           \\text{Residuo: } 0 \\text{ (raíz exacta)}`
        );
      } else {
        setResult(
          `\\text{Cociente: } ${resultStr} \\\\
           \\text{Residuo: } ${fractionToLatex(remainder)}`
        );
      }
    } catch (err: any) {
      setError(err.message || 'Error en la división');
      setHornerSteps(null);
      setResult('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border px-4 py-3 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
          Método de Horner (divisor lineal)
        </div>
        <div className="rounded-lg border px-4 py-3 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
          O usa un preset rápido abajo
        </div>
      </div>

      {/* Presets */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Ejemplos rápidos
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(PRESET_POLYNOMIALS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handlePreset(key)}
              className="px-3 py-2 text-xs font-semibold border-2 border-slate-300 dark:border-slate-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-600 transition-colors text-slate-900 dark:text-white"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
          O ingresa manualmente
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Coeficientes (mayor a menor grado)
            </label>
            <input
              type="text"
              value={dividend}
              onChange={(e) => setDividend(e.target.value)}
              placeholder="Ej: 1,0,-5,6"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Raíz (x=?)
            </label>
            <input
              type="text"
              value={root}
              onChange={(e) => setRoot(e.target.value)}
              placeholder="Ej: 1"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* Divide Button */}
      <button
        onClick={handleDivide}
        className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
      >
        Aplicar Horner
      </button>

      {/* Error */}
      {error && (
        <div className="p-4 border-2 border-red-400 dark:border-red-600 rounded-lg">
          <p className="text-red-700 dark:text-red-300">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Horner Grid */}
      {hornerSteps && (
        <div className="p-4 rounded-lg border-2 border-blue-300 dark:border-blue-600 overflow-x-auto">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
            Grilla de Horner
          </p>
          <table className="w-full text-sm border-collapse text-slate-900 dark:text-white">
            <tbody>
              <tr>
                <td className="border border-slate-300 dark:border-slate-700 px-3 py-2 font-semibold text-center">
                  {dividend.split(',')[0]}
                </td>
                {dividend.split(',').slice(1).map((_, i) => (
                  <td
                    key={`mult-${i}`}
                    className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-center text-xs text-slate-500 dark:text-slate-400"
                  >
                    ×{fractionToLatex(new Fraction(root))}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-slate-300 dark:border-slate-700 px-3 py-2" />
                {hornerSteps.slice(0, -1).map((val, i) => (
                  <td
                    key={`step-${i}`}
                    className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-center font-mono"
                  >
                    {fractionToLatex(val)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-slate-300 dark:border-slate-700 px-3 py-2 font-semibold text-center">
                  {dividend.split(',')[0]}
                </td>
                {hornerSteps.map((val, i) => (
                  <td
                    key={`result-${i}`}
                    className={`border font-mono font-semibold px-3 py-2 text-center ${
                      i === hornerSteps.length - 1
                        ? 'border-green-400 dark:border-green-600 bg-green-100 dark:bg-green-900/20'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {fractionToLatex(val)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="p-6 border-2 border-green-300 dark:border-green-600 rounded-lg">
          <MathText expression={result} className="block text-lg text-slate-900 dark:text-white" />
        </div>
      )}
    </div>
  );
};
