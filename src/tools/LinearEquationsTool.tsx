import React, { useState } from 'react';
import Fraction from 'fraction.js';
import { MathText } from '../components';
import { preferFractions } from '../utils/formatMath';

function toLatexFraction(fraction: Fraction): string {
  const numerator = Number(fraction.n);
  const denominator = Number(fraction.d);

  if (denominator === 1) {
    return `${numerator}`;
  }

  return `\\frac{${numerator}}{${denominator}}`;
}

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
          equation: `${toLatexFraction(a)}x + ${toLatexFraction(b)} = 0`,
        },
        {
          description: 'Restar el término constante',
          equation: `${toLatexFraction(a)}x = -${toLatexFraction(new Fraction(Math.abs(bNum), Number(b.d)))}`,
        },
      ];

      const x = (b.neg() as Fraction).div(a) as Fraction;
      newSteps.push({
        description: 'Dividir entre el coeficiente de x',
        equation: `x = ${toLatexFraction(x)}`,
      });

      setSteps(newSteps);
      setSolution(toLatexFraction(x));
    } catch (err: any) {
      setSolution('Error: ' + err.message);
      setSteps([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border px-4 py-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
          <div className="font-medium">Forma:</div>
          <MathText expression="ax + b = 0" className="inline-block" />
        </div>
        <div className="rounded-lg border px-4 py-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
          <div className="font-medium">Entrada:</div>
          <MathText expression={preferFractions('3/2')} className="inline-block" />
          <span className="ml-2 text-xs text-slate-600 dark:text-slate-300">usa fracciones</span>
        </div>
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            a
          </label>
          <input
            type="text"
            value={aCoeff}
            onChange={(e) => setACoeff(e.target.value)}
            placeholder="Ej: 2"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            b
          </label>
          <input
            type="text"
            value={bCoeff}
            onChange={(e) => setBCoeff(e.target.value)}
            placeholder="Ej: 4"
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

      {/* Steps */}
      {steps.length > 0 && (
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="p-4 rounded-lg border border-slate-300 dark:border-slate-700">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                Paso {i + 1}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{step.description}</p>
              <MathText expression={preferFractions(step.equation)} className="block text-lg text-slate-900 dark:text-white" />
            </div>
          ))}
        </div>
      )}

      {/* Solution */}
      {solution && (
        <div className="p-6 border-2 border-green-300 dark:border-green-600 rounded-lg">
          <div className="p-4 rounded border border-green-300 dark:border-green-600">
            <MathText expression={preferFractions(`x = ${solution}`)} className="block text-lg text-slate-900 dark:text-white" />
          </div>
        </div>
      )}
    </div>
  );
};
