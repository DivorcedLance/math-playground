import React from 'react';
import { TOOL_CATEGORIES, TOOLS } from '../utils/toolsConfig';
import * as Icons from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          🧮 Math Playground
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
          Herramientas matemáticas en formato rápido: ingresa datos, revisa el procedimiento y obtén el resultado.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/formulas"
            className="px-6 py-3 bg-secondary-600 dark:bg-secondary-700 text-white rounded-lg hover:bg-secondary-700 dark:hover:bg-secondary-600 transition-colors font-semibold"
          >
            📊 Ver Fórmulas
          </a>
          <a
            href="/tool/notable-products"
            className="px-6 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
          >
            🚀 Explorar Herramientas
          </a>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
          Qué ofrece
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="text-3xl mb-3">🔢</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Fracciones exactas
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Evita decimales innecesarios.
            </p>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="text-3xl mb-3">📖</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Paso a paso
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Verás el despeje o desarrollo en cada herramienta.
            </p>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Responsive
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Pensado para móvil y escritorio.
            </p>
          </div>
        </div>
      </section>

      {/* Tools by Category */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
          Menú de herramientas
        </h2>
        <div className="space-y-8">
          {Object.entries(TOOL_CATEGORIES).map(([categoryKey, category]) => (
            <div key={categoryKey}>
              <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-400 mb-4">
                {category.label}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.tools.map(toolId => {
                  const tool = TOOLS.find(t => t.id === toolId);
                  if (!tool) return null;

                  const Icon = (Icons as any)[tool.icon || 'Zap'] || Icons.Zap;

                  return (
                    <a
                      key={tool.id}
                      href={`/tool/${tool.id}`}
                      className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" size={24} />
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {tool.name}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
