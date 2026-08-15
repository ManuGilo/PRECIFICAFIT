import React from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Star, CheckCircle, ShieldCheck, Zap, X } from 'lucide-react';

export const BADGES_LIST = [
  {
    id: 'first_calc',
    title: 'Primeira Marmita Calculada',
    desc: 'Criou e precificou sua primeira receita fit com sucesso.',
    icon: CheckCircle,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'simulations_10',
    title: '10 Simulações',
    desc: 'Realizou 10 cálculos ou simulações de marmita.',
    icon: Zap,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'profitable_biz',
    title: 'Negócio Lucrativo',
    desc: 'Alcançou uma margem de lucro de 40% ou mais.',
    icon: Trophy,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'regional_master',
    title: 'Mestre da Região',
    desc: 'Consultou os preços ajustados da sua região no Brasil.',
    icon: ShieldCheck,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'elite_exporter',
    title: 'Exportador de Elite',
    desc: 'Gerou relatórios em PDF ou planilha Excel.',
    icon: Award,
    color: 'from-emerald-600 to-green-600'
  }
];

export function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 }
  });
}

export default function GamificationBadges({
  isOpen,
  onClose,
  unlockedBadgeIds = ['first_calc', 'regional_master']
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Topbar */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Suas Conquistas & Badges
              </h3>
              <p className="text-xs text-slate-500">
                Você desbloqueou {unlockedBadgeIds.length} de {BADGES_LIST.length} conquistas!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);
            const IconComp = badge.icon;
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start space-x-3 ${
                  isUnlocked
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-sm'
                    : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-50 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${badge.color} text-white flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {badge.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                        Desbloqueada
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
