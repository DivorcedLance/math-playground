import React, { useState } from 'react';
import Fraction from 'fraction.js';
import { fractionToString } from '../utils/fractions';

interface QuadraticSolution {
  discriminant: Fraction;
  root1: Fraction | null;
  root2: Fraction | null;
}

export const QuadraticEquationsTool: React.FC = () => {
  const [aCoeff, setACoeff] = useState<string>('1');
  const [bCoeff, setBCoeff] = useState<string>('-5');
  const [cCoeff, setCCoeff] = useState<string>('6');
  const [solution, setSolution] = useState<QuadraticSolution | null>(null);
  const [error, setError] = useState<string>('');

  const handleSolve = () => {
    try {
      setError('');
      const a = new Fraction(aCoeff);
      const b = new Fraction(bCoeff);
      const c = new Fraction(cCoeff);

      const aNum = Number(a.n);
      if (aNum === 0) {
        setError('El coeficiente a no puede ser 0. Esta no es una ecuación cuadrática.');
        setSolution(null);
        return;
      }

      // Calcular discriminante: b² - 4ac
      const discriminant = (b
        .mul(b)
        .sub(a.mul(4).mul(c)) as Fraction);

      // Si el discriminante es negativo
      const discriminantNum = Number(discriminant.n);
      if (discriminantNum < 0) {
        setSolution({
          discriminant,
          root1: null,
          root2: null,
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
        });
        return;
      }

      // Fórmula cuadrática: (-b ± √Δ) / 2a
      const denominator = a.mul(2) as Fraction;
      const numeratorBase = (b.neg() as Fraction);

      const sqrtDeltaN = parseInt(sqrtDiscriminant.toString());
      const root1 = ((numeratorBase.add(new Fraction(sqrtDeltaN)) as Fraction).div(denominator)) as Fraction;
      const root2 = ((numeratorBase.sub(new Fraction(sqrtDeltaN)) as Fraction).div(denominator)) as Fraction;

      setSolution({
        discriminant,
        root1,
        root2,
      });
    } catch (err: any) {
      setError(err.message || 'Error al resolver la ecuación');
      setSolution(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-900 dark:text-blue-300 font-semibold">
          Resuelve ecuaciones cuadráticas de la forma: ax² + bx + c = 0
        </p>
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Coeficiente a (x²)
          </label>
          <input
            type="text"
            value={aCoeff}
            onChange={(e) => setACoeff(e.target.value)}
            placeholder="Ej: 1, 2, 1/2"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Coeficiente b (x)
          </label>
          <input
            type="text"
            value={bCoeff}
            onChange={(e) => setBCoeff(e.target.value)}
            placeholder="Ej: -5, 3, 1/2"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Coeficiente c
          </label>
          <input
            type="text"
            value={cCoeff}
            onChange={(e) => setCCoeff(e.target.value)}
            placeholder="Ej: 6, -1, 1/4"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>
      </div>

      {/* Solve Button */}
      <button
        onClick={handleSolve}
        className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
      >
        Resolver
      </button>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Solution */}
      {solution && (
        <div className="space-y-4">
          {/* Discriminant */}
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
              Discriminante (Δ)
            </h3>
            <div className="space-y-2 font-mono text-slate-900 dark:text-white">
              <p>Δ = b² - 4ac</p>
              <p>Δ = {fractionToString(solution.discriminant as any)}</p>
            </div>
          </div>

          {/* Roots */}
          {solution.root1 && solution.root2 ? (
            <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-200 mb-3">
                Raíces Reales
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-1">Primera raíz:</p>
                  <p className="font-mono text-lg text-slate-900 dark:text-white">
                    x₁ = {fractionToString(solution.root1 as any)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-1">Segunda raíz:</p>
                  <p className="font-mono text-lg text-slate-900 dark:text-white">
                    x₂ = {fractionToString(solution.root2 as any)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>Sin soluciones reales:</strong> El discriminante es negativo (Δ &lt; 0)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
