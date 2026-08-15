import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, DollarSign, ShieldCheck, Zap } from 'lucide-react';

export default function Hero({ onStartClick }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-slate-50 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-900">
      
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-orange-400/15 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold border border-emerald-300/80 dark:border-emerald-700/60 shadow-sm animate-pulse">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Precificação Automática com Preços Regionais do Brasil</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight sm:leading-none">
            Descubra o <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-500 to-orange-500">preço ideal</span> para suas marmitas fit em segundos
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Calcule custos de ingredientes, embalagens, taxas de entrega e margem de lucro ideal de forma automática e alinhada com o mercado da sua região.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartClick}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-lg shadow-xl shadow-emerald-600/25 transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-3 group"
            >
              <span>Calcular Minha Marmita</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Value Props Pills */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 backdrop-blur-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Sem Margem de Erro</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Considere cada grama e centavo investido</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 backdrop-blur-sm">
              <TrendingUp className="w-5 h-5 text-orange-500 mb-2" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Lucro Projetado</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Defina sua margem de 10% a 100%</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 backdrop-blur-sm">
              <DollarSign className="w-5 h-5 text-emerald-500 mb-2" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Preços da Região</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Base regional por estado (UF)</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-500 mb-2" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Semáforo de Mercado</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Saiba se está competitivo</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
