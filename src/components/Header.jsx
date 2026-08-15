import React from 'react';
import { REGIONS_LIST } from '../data/ingredientsData';
import { UtensilsCrossed, Moon, Sun, Trophy, MapPin, Sparkles } from 'lucide-react';

export default function Header({ selectedRegion, setSelectedRegion, darkMode, setDarkMode, unlockedBadgesCount, onOpenBadges, onOpenHistory }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white transform hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-500 to-orange-500">
                PrecificaFit
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Precificação Inteligente de Marmitas Fit
            </p>
          </div>
        </div>

        {/* Region Selector & Right Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Region Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm font-medium">
            <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
              aria-label="Selecione seu Estado/Região"
            >
              {REGIONS_LIST.map((reg) => (
                <option key={reg.code} value={reg.code} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {reg.name}
                </option>
              ))}
            </select>
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700/60"
            title="Ver Histórico de Marmitas"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="hidden md:inline">Histórico & Comparar</span>
          </button>

          {/* Gamification Badges Button */}
          <button
            onClick={onOpenBadges}
            className="relative p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-colors border border-orange-200 dark:border-orange-800/50 flex items-center space-x-1"
            title="Suas Conquistas"
          >
            <Trophy className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-orange-500 text-white">
              {unlockedBadgesCount}
            </span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors border border-slate-200 dark:border-slate-700/60"
            title={darkMode ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

        </div>
      </div>
    </header>
  );
}
