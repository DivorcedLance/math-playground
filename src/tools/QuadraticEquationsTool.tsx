import React, { useState } from 'react';
import Fraction from 'fraction.js';
import { MathText } from '../components';
import { preferFractions } from '../utils/formatMath';

interface QuadraticSolution {
  discriminant: Fraction;
  root1: Fraction | null;
  root2: Fraction | null;
  formulaLatex: string;
}

function toLatexFraction(fraction: Fraction): string {
  const numerator = Number(fraction.n);
  const denominator = Number(fraction.d);

  if (denominator === 1) {
    return `${numerator}`;
  }

  return `\\frac{${numerator}}{${denominator}}`;
}

export const QuadraticEquationsTool: React.FC = () => {
  const [aCoeff, setACoeff] = useState<Fraction>(new Fraction(1));
  const [bCoeff, setBCoeff] = useState<Fraction>(new Fraction(-5));
  const [cCoeff, setCCoeff] = useState<Fraction>(new Fraction(6));
  const [solution, setSolution] = useState<QuadraticSolution | null>(null);
  const [error, setError] = useState<string>('');

  const updateCoefficient = (setter: (val: Fraction) => void, value: string) => {
    try {
      setter(new Fraction(value.trim() || '0'));
    } catch {
      // Invalid input, skip
    }
  };

  const handleSolve = () => {
    try {
      setError('');

      const aNum = Number(aCoeff.n);
      if (aNum === 0) {
        setError('El coeficiente a no puede ser 0. Esta no es una ecuación cuadrática.');
        setSolution(null);
        return;
      }

      // Calcular discriminante: b² - 4ac
      const discriminant = (bCoeff
        .mul(bCoeff)
        .sub(aCoeff.mul(4).mul(cCoeff)) as Fraction);

      // Si el discriminante es negativo
      const discriminantNum = Number(discriminant.n);
      if (discriminantNum < 0) {
        setSolution({
          discriminant,
          root1: null,
          root2: null,
          formulaLatex: `\\frac{-${toLatexFraction(bCoeff)} \\pm \\sqrt{${toLatexFraction(discriminant)}}}{2 \\cdot ${toLatexFraction(aCoeff)}}`,
        });
        return;
      }

      // Calcular raíz cuadrada del discriminante
      const sqrtDiscriminant = Math.sqrt(discriminantNum / Number(discriminant.d));
      const isPerferctSquare = Number.isInteger(sqrtDiscriminant);

      if (!isPerferctSquare) {
        setSolution({
          discriminant,
          root1: null,
          root2: null,
          formulaLatex: `\\frac{-${toLatexFraction(bCoeff)} \\pm \\sqrt{${toLatexFraction(discriminant)}}}{2 \\cdot ${toLatexFraction(aCoeff)}}`,
        });
        return;
      }

      // Fórmula cuadrática: (-b ± √Δ) / 2a
      const denominator = aCoeff.mul(2) as Fraction;
      const numeratorBase = (bCoeff.neg() as Fraction);

      const sqrtDeltaN = parseInt(sqrtDiscriminant.toString());
      const root1 = ((numeratorBase.add(new Fraction(sqrtDeltaN)) as Fraction).div(denominator)) as Fraction;
      const root2 = ((numeratorBase.sub(new Fraction(sqrtDeltaN)) as Fraction).div(denominator)) as Fraction;

      const formulaLatex = `\\frac{-${toLatexFraction(bCoeff)} \\pm \\sqrt{${toLatexFraction(discriminant)}}}{2 \\cdot ${toLatexFraction(aCoeff)}} = \\frac{${toLatexFraction(numeratorBase)} \\pm ${toLatexFraction(new Fraction(sqrtDeltaN))}}{${toLatexFraction(denominator)}}`;

      setSolution({
        discriminant,
        root1,
        root2,
        formulaLatex,
      });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Error al resolver la ecuación');
      setSolution(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg border px-4 py-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
          <div className="font-medium">Forma:</div>
          <MathText expression="ax^2 + bx + c = 0" className="inline-block" />
        </div>
        <div className="rounded-lg border px-4 py-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
          <div className="font-medium">Salida:</div>
          <span className="text-xs text-slate-600 dark:text-slate-300">Δ, fórmula y raíces</span>
        </div>
        <div className="rounded-lg border px-4 py-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
          <div className="font-medium">Entrada:</div>
          <MathText expression={preferFractions('1/2')} className="inline-block" />
          <span className="ml-2 text-xs text-slate-600 dark:text-slate-300">usa fracciones</span>
        </div>
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            a
          </label>
          <input
            type="text"
            value={toLatexFraction(aCoeff)}
            onChange={(e) => updateCoefficient(setACoeff, e.target.value)}
            placeholder="Ej: 1"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            b
          </label>
          <input
            type="text"
            value={toLatexFraction(bCoeff)}
            onChange={(e) => updateCoefficient(setBCoeff, e.target.value)}
            placeholder="Ej: -5"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            c
          </label>
          <input
            type="text"
            value={toLatexFraction(cCoeff)}
            onChange={(e) => updateCoefficient(setCCoeff, e.target.value)}
            placeholder="Ej: 6"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>
      </div>

      {/* Solve Button */}
      <button
        onClick={handleSolve}
        className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
      >
        Calcular
      </button>

      {/* Error */}
      {error && (
        <div className="p-4 border-2 border-red-400 dark:border-red-600 rounded-lg">
          <p className="text-red-700 dark:text-red-300">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Solution */}
      {solution && (
        <div className="space-y-4">
          {/* Discriminant */}
          <div className="p-6 border-2 border-blue-300 dark:border-blue-600 rounded-lg">
            <div className="space-y-2 text-slate-900 dark:text-white">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                Discriminante
              </p>
              <MathText expression={`\\Delta = b^2 - 4ac = ${toLatexFraction(bCoeff)}^2 - 4 \\cdot ${toLatexFraction(aCoeff)} \\cdot ${toLatexFraction(cCoeff)}`} className="block text-slate-900 dark:text-white" />
              <MathText expression={`\\Delta = ${toLatexFraction(solution.discriminant)}`} className="block text-lg font-semibold text-slate-900 dark:text-white" />
            </div>
          </div>

          {/* Formula */}
          <div className="p-6 border-2 border-purple-300 dark:border-purple-600 rounded-lg">
            <div className="space-y-3 text-slate-900 dark:text-white">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Fórmula cuadrática
              </p>
              <MathText expression={`x = ${solution.formulaLatex}`} className="block text-slate-900 dark:text-white" />
            </div>
          </div>

          {/* Roots */}
          {solution.root1 && solution.root2 ? (
            <div className="p-6 border-2 border-green-300 dark:border-green-600 rounded-lg">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Soluciones
                </p>
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2 font-semibold">Primera raíz</p>
                  <MathText expression={`x_1 = ${toLatexFraction(solution.root1)}`} className="block text-xl text-slate-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2 font-semibold">Segunda raíz</p>
                  <MathText expression={`x_2 = ${toLatexFraction(solution.root2)}`} className="block text-xl text-slate-900 dark:text-white" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg">
              <p className="text-yellow-700 dark:text-yellow-300">
                <strong>Sin soluciones reales:</strong> El discriminante es negativo (Δ = {toLatexFraction(solution.discriminant)} &lt; 0)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
