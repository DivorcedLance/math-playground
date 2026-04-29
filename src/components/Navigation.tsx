import React from 'react';
import { TOOL_CATEGORIES, TOOLS } from '../utils/toolsConfig';
import * as Icons from 'lucide-react';
import { createAppHref } from '../utils/routing'

interface NavigationProps {
  currentTool?: string;
  onNavigate?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTool, onNavigate }) => {
  return (
    <nav className="h-full flex flex-col overflow-y-auto py-6">
      {/* Logo/Home */}
      <div className="px-6 mb-8">
        <a
          href={createAppHref('/')}
          className="text-xl font-bold text-primary-700 dark:text-primary-400 hover:text-primary-600"
        >
          🧮 Math
        </a>
      </div>

      {/* Home link */}
      <div className="px-3 mb-4">
        <a
          href={createAppHref('/')}
          onClick={onNavigate}
          className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
            !currentTool
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Inicio
        </a>
      </div>

      {/* Formulas section */}
      <div className="px-3 mb-8">
        <a
          href={createAppHref('/formulas')}
          onClick={onNavigate}
          className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
            currentTool === 'formulas'
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📊 Fórmulas
        </a>
      </div>

      <div className="px-3 mb-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Herramientas
        </p>

        {/* Tools by category */}
        {Object.entries(TOOL_CATEGORIES).map(([categoryKey, category]) => (
          <div key={categoryKey} className="mb-4">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 px-4 mb-2">
              {category.label}
            </p>
            <div className="space-y-1">
              {category.tools.map(toolId => {
                const tool = TOOLS.find(t => t.id === toolId);
                if (!tool) return null;

                const Icon = (Icons as any)[tool.icon || 'Zap'] || Icons.Zap;

                return (
                  <a
                    key={tool.id}
                    href={createAppHref(`/tool/${tool.id}`)}
                    onClick={onNavigate}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                      currentTool === tool.id
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={tool.description}
                  >
                    <Icon size={16} />
                    <span className="truncate">{tool.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};
