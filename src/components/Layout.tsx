import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Navigation } from './Navigation';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  currentTool?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentTool }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? 'w-64' : 'w-0'} 
          ${mobileMenuOpen ? 'w-64' : 'w-0 md:w-64'}
          transition-all duration-300 ease-in-out
          bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800
          fixed md:static h-full z-40 overflow-hidden
        `}
      >
        <Navigation currentTool={currentTool} />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen || mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-400">
            Math Playground
          </h1>
          
          <div className="w-6" /> {/* Spacer for centering */}
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
