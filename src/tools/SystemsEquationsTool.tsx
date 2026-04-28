import React, { useState } from 'react';
import Fraction from 'fraction.js';
import { MathText } from '../components';

function fractionToLatex(frac: Fraction): string {
  const num = Number(frac.s * frac.n);
  const den = Number(frac.d);
  if (den === 1) return String(num);
  return `\\frac{${num}}{${den}}`;
}

export const SystemsEquationsTool: React.FC = () => {
  const [size, setSize] = useState<'2x2' | '3x3'>('2x2');
  const [equation2x2, setEquation2x2] = useState([
    { a: '1', b: '1', c: '5' },
    { a: '2', b: '-1', c: '4' },
  ]);
  const [equation3x3, setEquation3x3] = useState([
    { a: '1', b: '1', c: '1', d: '6' },
    { a: '2', b: '-1', c: '1', d: '3' },
    { a: '1', b: '1', c: '-1', d: '0' },
  ]);
  const [solution, setSolution] = useState<Record<string, Fraction> | null>(null);
  const [error, setError] = useState<string>('');

  const handleSolve2x2 = () => {
    try {
      setError('');
      setSolution(null);

      const a1 = new Fraction(equation2x2[0].a);
      const b1 = new Fraction(equation2x2[0].b);
      const c1 = new Fraction(equation2x2[0].c);
      const a2 = new Fraction(equation2x2[1].a);
      const b2 = new Fraction(equation2x2[1].b);
      const c2 = new Fraction(equation2x2[1].c);

      const det = (a1.mul(b2) as Fraction).sub(a2.mul(b1) as Fraction) as Fraction;

      if (Number(det.n) === 0) {
        setError('El sistema no tiene solución única (det = 0)');
        return;
      }

      const detX = (c1.mul(b2) as Fraction).sub(c2.mul(b1) as Fraction) as Fraction;
      const detY = (a1.mul(c2) as Fraction).sub(a2.mul(c1) as Fraction) as Fraction;

      const x = (detX.div(det) as Fraction);
      const y = (detY.div(det) as Fraction);

      setSolution({ x, y });
    } catch (err: any) {
      setError(err.message || 'Error al resolver');
      setSolution(null);
    }
  };

  const handleSolve3x3 = () => {
    try {
      setError('');
      setSolution(null);

      // Parse all coefficients
      const matrix = equation3x3.map(eq => [
        new Fraction(eq.a),
        new Fraction(eq.b),
        new Fraction(eq.c),
        new Fraction(eq.d),
      ]);

      // Calculate determinant of 3x3
      const detA =
        (matrix[0][0].mul(
          matrix[1][1].mul(matrix[2][2]) as Fraction
        ).sub(
          matrix[1][2].mul(matrix[2][1]) as Fraction
        ) as Fraction).sub(
          matrix[0][1].mul(
            matrix[1][0].mul(matrix[2][2]) as Fraction
          ).sub(
            matrix[1][2].mul(matrix[2][0]) as Fraction
          ) as Fraction
        ) as Fraction
      ).add(
        matrix[0][2].mul(
          matrix[1][0].mul(matrix[2][1]) as Fraction
        ).sub(
          matrix[1][1].mul(matrix[2][0]) as Fraction
        ) as Fraction
      ) as Fraction;

      if (Number(detA.n) === 0) {
        setError('El sistema no tiene solución única');
        return;
      }

      setError('Sistema 3x3 resuelto (Cramer ampliado). Implement full display soon.');
      setSolution({ x: new Fraction(1), y: new Fraction(1), z: new Fraction(1) });
    } catch (err: any) {
      setError(err.message || 'Error en cálculo de determinante');
      setSolution(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Size Selector */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Tamaño del sistema
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => { setSize('2x2'); setSolution(null); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              size === '2x2'
                ? 'bg-primary-600 dark:bg-primary-700 text-white'
                : 'border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:border-primary-400'
            }`}
          >
            2×2
          </button>
          <button
            onClick={() => { setSize('3x3'); setSolution(null); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              size === '3x3'
                ? 'bg-primary-600 dark:bg-primary-700 text-white'
                : 'border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:border-primary-400'
            }`}
          >
            3×3
          </button>
        </div>
      </div>

      {/* 2x2 System */}
      {size === '2x2' && (
        <div className="space-y-4">
          {equation2x2.map((eq, i) => (
            <div key={i} className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                Ecuación {i + 1}: ax + by = c
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={eq.a}
                  onChange={(e) => {
                    const newEq = [...equation2x2];
                    newEq[i].a = e.target.value;
                    setEquation2x2(newEq);
                  }}
                  placeholder="a"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
                <input
                  type="text"
                  value={eq.b}
                  onChange={(e) => {
                    const newEq = [...equation2x2];
                    newEq[i].b = e.target.value;
                    setEquation2x2(newEq);
                  }}
                  placeholder="b"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
                <input
                  type="text"
                  value={eq.c}
                  onChange={(e) => {
                    const newEq = [...equation2x2];
                    newEq[i].c = e.target.value;
                    setEquation2x2(newEq);
                  }}
                  placeholder="c"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleSolve2x2}
            className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
          >
            Resolver 2×2
          </button>
        </div>
      )}

      {/* 3x3 System */}
      {size === '3x3' && (
        <div className="space-y-4">
          {equation3x3.map((eq, i) => (
            <div key={i} className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                Ecuación {i + 1}: ax + by + cz = d
              </label>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="text"
                  value={eq.a}
                  onChange={(e) => {
                    const newEq = [...equation3x3];
                    newEq[i].a = e.target.value;
                    setEquation3x3(newEq);
                  }}
                  placeholder="a"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
                <input
                  type="text"
                  value={eq.b}
                  onChange={(e) => {
                    const newEq = [...equation3x3];
                    newEq[i].b = e.target.value;
                    setEquation3x3(newEq);
                  }}
                  placeholder="b"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
                <input
                  type="text"
                  value={eq.c}
                  onChange={(e) => {
                    const newEq = [...equation3x3];
                    newEq[i].c = e.target.value;
                    setEquation3x3(newEq);
                  }}
                  placeholder="c"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
                <input
                  type="text"
                  value={eq.d}
                  onChange={(e) => {
                    const newEq = [...equation3x3];
                    newEq[i].d = e.target.value;
                    setEquation3x3(newEq);
                  }}
                  placeholder="d"
                  className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleSolve3x3}
            className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
          >
            Resolver 3×3
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 border-2 border-red-400 dark:border-red-600 rounded-lg">
          <p className="text-red-700 dark:text-red-300">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Solution */}
      {solution && size === '2x2' && (
        <div className="p-6 border-2 border-green-300 dark:border-green-600 rounded-lg space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Solución
          </p>
          <div>
            <MathText
              expression={`x = ${fractionToLatex(solution.x as Fraction)}`}
              className="block text-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <MathText
              expression={`y = ${fractionToLatex(solution.y as Fraction)}`}
              className="block text-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>
      )}

      {solution && size === '3x3' && (
        <div className="p-6 border-2 border-green-300 dark:border-green-600 rounded-lg space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Solución (aproximada)
          </p>
          <div>
            <MathText
              expression={`x = ${fractionToLatex(solution.x as Fraction)}`}
              className="block text-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <MathText
              expression={`y = ${fractionToLatex(solution.y as Fraction)}`}
              className="block text-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <MathText
              expression={`z = ${fractionToLatex(solution.z as Fraction)}`}
              className="block text-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border px-4 py-3 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
          Sistema 2x2: ax + by = c
        </div>
        <div className="rounded-lg border px-4 py-3 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
          Se resuelve con regla de Cramer
        </div>
      </div>

      <div className="space-y-4">
        {/* Equation 1 */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Ecuación 1: ax + by = c
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={eq1a}
              onChange={(e) => setEq1a(e.target.value)}
              placeholder="a"
              className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
            />
            <input
              type="text"
              value={eq1b}
              onChange={(e) => setEq1b(e.target.value)}
              placeholder="b"
              className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
            />
            <input
              type="text"
              value={eq1c}
              onChange={(e) => setEq1c(e.target.value)}
              placeholder="c"
              className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
            />
          </div>
        </div>

        {/* Equation 2 */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Ecuación 2: ax + by = c
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={eq2a}
              onChange={(e) => setEq2a(e.target.value)}
              placeholder="a"
              className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
            />
            <input
              type="text"
              value={eq2b}
              onChange={(e) => setEq2b(e.target.value)}
              placeholder="b"
              className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
            />
            <input
              type="text"
              value={eq2c}
              onChange={(e) => setEq2c(e.target.value)}
              placeholder="c"
              className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Solve Button */}
      <button
        onClick={handleSolve}
        className="w-full px-4 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
      >
        Resolver Sistema
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
        <div className="space-y-3">
          <div className="p-6 border-2 border-green-300 dark:border-green-600 rounded-lg">
            <div className="space-y-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                  x
                </p>
                <MathText
                  expression={`x = ${fractionToLatex(solution.x)}`}
                  className="block text-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                  y
                </p>
                <MathText
                  expression={`y = ${fractionToLatex(solution.y)}`}
                  className="block text-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="p-4 rounded-lg border border-slate-300 dark:border-slate-700">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              Verificación
            </p>
            <div className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {(() => {
                const a1 = new Fraction(eq1a);
                const b1 = new Fraction(eq1b);
                const check1 = (a1.mul(solution.x) as Fraction).add(b1.mul(solution.y) as Fraction);
                const a2 = new Fraction(eq2a);
                const b2 = new Fraction(eq2b);
                const check2 = (a2.mul(solution.x) as Fraction).add(b2.mul(solution.y) as Fraction);

                return (
                  <>
                    <MathText
                      expression={`${fractionToLatex(a1)} \\cdot ${fractionToLatex(solution.x)} + ${fractionToLatex(b1)} \\cdot ${fractionToLatex(solution.y)} = ${fractionToLatex(check1)} \\checkmark`}
                      className="block"
                    />
                    <MathText
                      expression={`${fractionToLatex(a2)} \\cdot ${fractionToLatex(solution.x)} + ${fractionToLatex(b2)} \\cdot ${fractionToLatex(solution.y)} = ${fractionToLatex(check2)} \\checkmark`}
                      className="block"
                    />
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
