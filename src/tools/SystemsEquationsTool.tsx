import React, { useState } from 'react';
import Fraction from 'fraction.js';
import { MathText } from '../components';

function fractionToLatex(frac: Fraction): string {
  const num = Number(frac.s * frac.n);
  const den = Number(frac.d);
  if (den === 1) return String(num);
  return `\\frac{${num}}{${den}}`;
}

function determinant3x3(matrix: Fraction[][]): Fraction {
  const minor1 = (matrix[1][1].mul(matrix[2][2]) as Fraction).sub(matrix[1][2].mul(matrix[2][1]) as Fraction) as Fraction;
  const minor2 = (matrix[1][0].mul(matrix[2][2]) as Fraction).sub(matrix[1][2].mul(matrix[2][0]) as Fraction) as Fraction;
  const minor3 = (matrix[1][0].mul(matrix[2][1]) as Fraction).sub(matrix[1][1].mul(matrix[2][0]) as Fraction) as Fraction;

  const term1 = matrix[0][0].mul(minor1) as Fraction;
  const term2 = matrix[0][1].mul(minor2) as Fraction;
  const term3 = matrix[0][2].mul(minor3) as Fraction;

  return (term1.sub(term2) as Fraction).add(term3) as Fraction;
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

      const matrix = equation3x3.map(eq => [
        new Fraction(eq.a),
        new Fraction(eq.b),
        new Fraction(eq.c),
        new Fraction(eq.d),
      ]);

      const coefficients = matrix.map(row => row.slice(0, 3));
      const constants = matrix.map(row => row[3]);
      const det = determinant3x3(coefficients);

      if (Number(det.n) === 0) {
        setError('El sistema no tiene solución única');
        setSolution(null);
        return;
      }

      const matrixX = coefficients.map((row, index) => [constants[index], row[1], row[2]]);
      const matrixY = coefficients.map((row, index) => [row[0], constants[index], row[2]]);
      const matrixZ = coefficients.map((row, index) => [row[0], row[1], constants[index]]);

      const x = determinant3x3(matrixX).div(det) as Fraction;
      const y = determinant3x3(matrixY).div(det) as Fraction;
      const z = determinant3x3(matrixZ).div(det) as Fraction;

      setSolution({ x, y, z });
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
