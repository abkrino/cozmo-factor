import React, { useState } from 'react';
import { View } from '../types';
import { FactoryIcon, MenuIcon, CloseIcon } from './icons';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const navItems = Object.values(View);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-20 print:hidden">
      <div className="container mx-auto px-4 md:px-8 relative">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <FactoryIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-800">نظام إدارة المصنع</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
            {navItems.map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeView === view
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {view}
              </button>
            ))}
          </nav>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <CloseIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 left-0 bg-white shadow-lg z-10 border-t border-slate-200">
            <nav className="p-4 space-y-2">
                {navItems.map((view) => (
                <button
                    key={view}
                    onClick={() => {
                        setActiveView(view);
                        setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-right block px-4 py-3 text-base font-medium rounded-md transition-colors duration-200 ${
                        activeView === view
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                    {view}
                </button>
                ))}
            </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
