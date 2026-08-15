import React from 'react';
import { Box, ShoppingBag, Percent, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Escolha o Tamanho',
      desc: 'Selecione o volume da embalagem (250ml, 350ml, 500ml, 750ml ou 1000ml) e lote.',
      icon: Box,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      number: '02',
      title: 'Informe os Ingredientes',
      desc: 'Adicione proteínas, carboidratos e vegetais. Os preços médios regionais carregam automaticamente.',
      icon: ShoppingBag,
      color: 'from-orange-500 to-amber-500'
    },
    {
      number: '03',
      title: 'Defina seu Lucro',
      desc: 'Ajuste a margem de lucro desejada (10% a 100%) no slider e inclua custos de entrega ou embalagem.',
      icon: Percent,
      color: 'from-emerald-600 to-teal-600'
    },
    {
      number: '04',
      title: 'Veja o Preço Ideal',
      desc: 'Receba o preço final recomendado, indicador de competitividade e relatório completo.',
      icon: Sparkles,
      color: 'from-orange-600 to-red-500'
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Como Funciona em 4 Passos Simples
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Descubra a precificação exata da sua marmita fitness em menos de 2 minutos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={step.number}
                className="relative p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-300 dark:text-slate-700">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
