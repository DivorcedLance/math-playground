import React, { useState } from 'react';
import Fraction from 'fraction.js';
import { fractionToString } from '../utils/fractions';

interface SolutionStep {
  description: string;
  equation: string;
}

export const LinearEquationsTool: React.FC = () => {
  const [aCoeff, setACoeff] = useState<string>('2');
  const [bCoeff, setBCoeff] = useState<string>('4');
  const [solution, setSolution] = useState<string>('');
  const [steps, setSteps] = useState<SolutionStep[]>([]);

  const handleSolve = () => {
    try {
      const a = new Fraction(aCoeff);
      const b = new Fraction(bCoeff);

      const aNum = Number(a.n);
      const bNum = Number(b.n);

      if (aNum === 0) {
        if (bNum === 0) {
          setSolution('Infinitas soluciones (ecuación identidad)');
          setSteps([]);
        } else {
          setSolution('Sin solución (ecuación inconsistente)');
          setSteps([]);
        }
        return;
      }

      const newSteps: SolutionStep[] = [
        {
          description: 'Ecuación original',
          equation: `${aNum}/${Number(a.d)}x + ${bNum}/${Number(b.d)} = 0`,
        },
        {
          description: 'Restar ' + fractionToString(b as any) + ' de ambos lados',
          equation: `${aNum}/${Number(a.d)}x = -${Math.abs(bNum)}/${Number(b.d)}`,
        },
      ];

      const x = (b.neg() as Fraction).div(a) as Fraction;
      newSteps.push({
        description: `Dividir por ${fractionToString(a as any)}`,
        equation: `x = ${fractionToString(x as any)}`,
      });

      setSteps(newSteps);
      setSolution(fractionToString(x as any));
    } catch (err: any) {
      setSolution('Error: ' + err.message);
      setSteps([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-900 dark:text-blue-300 font-semibold">
          Resuelve ecuaciones lineales de la forma: ax + b = 0
        </p>
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Coeficiente de x (a)
          </label>
          <input
            type="text"
            value={aCoeff}
            onChange={(e) => setACoeff(e.target.value)}
            placeholder="Ej: 2, 1/2, -3"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Término constante (b)
          </label>
          <input
            type="text"
            value={bCoeff}
            onChange={(e) => setBCoeff(e.target.value)}
            placeholder="Ej: 4, -1/3, 5"
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

      {/* Steps */}
      {steps.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Procedimiento
          </h3>
          {steps.map((step, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Paso {i + 1}: {step.description}
              </p>
              <p className="font-mono text-slate-900 dark:text-white text-lg">
                {step.equation}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Solution */}
      {solution && (
        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
            Solución
          </h3>
          <div className="p-4 bg-white dark:bg-slate-900 rounded border border-green-300 dark:border-green-700">
            <p className="font-mono text-slate-900 dark:text-white text-lg">
              x = {solution}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
