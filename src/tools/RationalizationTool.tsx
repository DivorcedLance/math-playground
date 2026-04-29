import React, { useState } from 'react';
import { MathText } from '../components';

interface RationalizationStep {
  title: string;
  expression: string;
}

interface RationalizationResult {
  steps: RationalizationStep[];
  final: string;
  artifice: string;
  caseType: 'simple' | 'conjugate' | 'product';
}

function sqrtToLatex(expr: string): string {
  return expr.replace(/sqrt\((\w+)\)/g, '\\sqrt{$1}');
}

function detectCase(denominator: string): 'simple' | 'conjugate' | 'product' {
  // Count sqrt occurrences
  const sqrtCount = (denominator.match(/sqrt/g) || []).length;

  if (sqrtCount === 1) {
    // Check if it's just a sqrt or a sum/difference
    if (denominator.match(/^sqrt\(\w+\)$/)) {
      return 'simple';
    }
    return 'conjugate';
  }

  return 'product';
}

export const RationalizationTool: React.FC = () => {
  const [numerator, setNumerator] = useState<string>('1');
  const [denominator, setDenominator] = useState<string>('sqrt(2)');
  const [result, setResult] = useState<RationalizationResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleRationalize = () => {
    try {
      setError('');
      setResult(null);

      const num = numerator.trim();
      const denom = denominator.trim();

      if (!denom.includes('sqrt')) {
        setError('El denominador debe contener una raíz: sqrt(2), sqrt(3), etc.');
        return;
      }

      const caseType = detectCase(denom);
      const denomLatex = sqrtToLatex(denom);
      const steps: RationalizationStep[] = [];
      let artifice = '';
      let finalExpr = '';

      if (caseType === 'simple') {
        // Case 1: Simple sqrt(a) - multiply by sqrt(a)/sqrt(a)
        const match = denom.match(/sqrt\((\w+)\)/);
        if (!match) {
          setError('Formato inválido. Usa: sqrt(2), sqrt(3)');
          return;
        }

        const radicand = match[1];
        artifice = `\\frac{${denomLatex}}{${denomLatex}}`;

        steps.push({
          title: 'Paso 1 - Expresión original:',
          expression: `\\frac{${num}}{${denomLatex}}`,
        });

        steps.push({
          title: 'Paso 2 - Multiplicar por:',
          expression: artifice,
        });

        steps.push({
          title: 'Paso 3 - Desarrollar:',
          expression: `\\frac{${num} \\cdot ${denomLatex}}{(${denomLatex})^2} = \\frac{${num}${radicand === '1' ? '' : '\\sqrt{' + radicand + '}'}}{${radicand}}`,
        });

        const finalNum = `${num}${radicand === '1' ? '' : '\\sqrt{' + radicand + '}'}`;
        finalExpr = `\\frac{${finalNum}}{${radicand}}`;
      } else if (caseType === 'conjugate') {
        // Case 2: a ± sqrt(b) - multiply by conjugate
        // Parse: extract the numeric part and the sqrt part
        const match = denom.match(/^([^s]*)([+-]\s*)sqrt\((\w+)\)$/) || denom.match(/^sqrt\((\w+)\)([+-]\s*)(.*)$/);
        
        if (!match) {
          setError('Formato no soportado para conjugado. Usa: a + sqrt(b) o sqrt(a) + b');
          return;
        }

        // Build the conjugate (change sign)
        const conjugate = denom.replace(/\+/g, '___PLUS___').replace(/-/g, '+').replace(/___PLUS___/g, '-');
        const conjugateLatex = sqrtToLatex(conjugate);
        
        artifice = `\\frac{${conjugateLatex}}{${conjugateLatex}}`;

        steps.push({
          title: 'Paso 1 - Expresión original:',
          expression: `\\frac{${num}}{${denomLatex}}`,
        });

        steps.push({
          title: 'Paso 2 - Multiplicar por conjugado:',
          expression: artifice,
        });

        steps.push({
          title: 'Paso 3 - Diferencia de cuadrados:',
          expression: `\\frac{${num}(${conjugateLatex})}{(${denomLatex})(${conjugateLatex})}`,
        });

        // Try to simplify the denominator
        try {
          // This is a simplification attempt - in production would need algebra engine
          finalExpr = `\\frac{${num}(${conjugateLatex})}{\\text{resultado}}`;
        } catch {
          finalExpr = `\\frac{${num}(${conjugateLatex})}{\\text{ver procedimiento}}`;
        }
      } else {
        // Case 3: Product of roots or complex expressions
        setError('Racionalización de productos complejos aún está en desarrollo.');
        return;
      }

      setResult({
        steps,
        final: finalExpr,
        artifice,
        caseType,
      });
    } catch (err: any) {
      setError(err.message || 'Error al racionalizar');
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border px-4 py-3 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
          Escribe raíces como: <code className="text-xs">sqrt(2), sqrt(3)</code>
        </div>
        <div className="rounded-lg border px-4 py-3 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
          Ejemplo: <code className="text-xs">numerador: 1</code>, <code className="text-xs">denominador: sqrt(2)</code>
        </div>
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Numerador
          </label>
          <input
            type="text"
            value={numerator}
            onChange={(e) => setNumerator(e.target.value)}
            placeholder="Ej: 1"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Denominador (con raíz)
          </label>
          <input
            type="text"
            value={denominator}
            onChange={(e) => setDenominator(e.target.value)}
            placeholder="Ej: sqrt(2)"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Rationalize Button */}
      <button
        onClick={handleRationalize}
        className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
      >
        Racionalizar
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
          {/* Case Type Badge */}
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <p className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-300 font-semibold">
              Tipo de racionalización:
              {result.caseType === 'simple' && ' Raíz Simple'}
              {result.caseType === 'conjugate' && ' Conjugado (Diferencia de Cuadrados)'}
              {result.caseType === 'product' && ' Producto'}
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
              Artificio: <span className="font-mono">{result.artifice}</span>
            </p>
          </div>

          {/* Steps */}
          {result.steps.map((step, i) => (
            <div key={i} className="p-4 rounded-lg border border-slate-300 dark:border-slate-700">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold mb-2">
                {step.title}
              </p>
              <MathText expression={step.expression} className="block text-slate-900 dark:text-white" />
            </div>
          ))}

          {/* Result */}
          <div className="p-6 border-2 border-green-300 dark:border-green-600 rounded-lg">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3 font-semibold">
              Resultado Final
            </p>
            <MathText expression={result.final} className="block text-lg text-slate-900 dark:text-white" />
          </div>
        </div>
      )}
    </div>
  );
};
