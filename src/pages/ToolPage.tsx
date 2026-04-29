import React from 'react';
import { TOOLS } from '../utils/toolsConfig';
import { NotableProductsTool } from '../tools/NotableProductsTool';
import { LinearEquationsTool } from '../tools/LinearEquationsTool';
import { QuadraticEquationsTool } from '../tools/QuadraticEquationsTool';
import { PolynomialEvalTool } from '../tools/PolynomialEvalTool';
import { RationalizationTool } from '../tools/RationalizationTool';
import { PolynomialDivisionTool } from '../tools/PolynomialDivisionTool';
import { SystemsEquationsTool } from '../tools/SystemsEquationsTool';
import { createAppHref } from '../utils/routing'

interface ToolPageProps {
  toolId: string;
}

export const ToolPage: React.FC<ToolPageProps> = ({ toolId }) => {
  const tool = TOOLS.find(t => t.id === toolId);

  if (!tool) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Herramienta no encontrada
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          La herramienta que buscas no existe.
        </p>
        <a
          href={createAppHref('/')}
          className="px-6 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600"
        >
          Volver al inicio
        </a>
      </div>
    );
  }

  const renderTool = () => {
    switch (toolId) {
      case 'notable-products':
        return <NotableProductsTool />;
      case 'linear-equations':
        return <LinearEquationsTool />;
      case 'quadratic-equations':
        return <QuadraticEquationsTool />;
      case 'polynomial-eval':
        return <PolynomialEvalTool />;
      case 'rationalization':
        return <RationalizationTool />;
      case 'polynomial-division':
        return <PolynomialDivisionTool />;
      case 'systems-equations':
        return <SystemsEquationsTool />;
      default:
        return (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>Esta herramienta aún no está disponible.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {tool.name}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {tool.description}
        </p>
      </div>

      {/* Tool Component */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        {renderTool()}
      </div>
    </div>
  );
};
