import React from 'react';
import { getCompetitivenessStatus, MARKET_VOLUME_RANGES } from '../data/marketRanges';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { DollarSign, TrendingUp, ShieldCheck, AlertTriangle, BookmarkPlus, PieChart as PieChartIcon, Share2, Layers } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ResultDashboard({
  marmitaData,
  selectedRegion,
  onSaveToHistory
}) {
  // Financial Calculations
  const ingredientsCostUnit = marmitaData.ingredients.reduce((acc, item) => {
    return acc + ((item.pricePerKg / 1000) * item.grams);
  }, 0);

  const packagingCostUnit = (marmitaData.packagingCost || 0) + (marmitaData.labelCost || 0);

  const batchSize = Math.max(1, marmitaData.batchSize || 1);
  const operationalCostUnit = ((marmitaData.operationalBatchCost || 0) + (marmitaData.laborBatchCost || 0)) / batchSize;

  const deliveryCostUnit = marmitaData.hasDelivery
    ? ((marmitaData.deliveryKm || 0) * (marmitaData.deliveryCostPerKm || 0) + (marmitaData.deliveryFixedFee || 0))
    : 0;

  const baseSubtotal = ingredientsCostUnit + packagingCostUnit + operationalCostUnit + deliveryCostUnit;

  // Profit
  const profitMarginDecimal = (marmitaData.profitMargin || 0) / 100;
  const profitAmountUnit = baseSubtotal * profitMarginDecimal;

  let rawPrice = baseSubtotal + profitAmountUnit;

  // Platform fee adjustment if iFood/app commission applies
  const feePercent = (marmitaData.platformFeePercent || 0) / 100;
  if (feePercent > 0 && feePercent < 1) {
    rawPrice = rawPrice / (1 - feePercent);
  }

  const finalPrice = Number(rawPrice.toFixed(2));
  const totalCostUnit = Number(baseSubtotal.toFixed(2));
  const profitUnit = Number((finalPrice - totalCostUnit).toFixed(2));
  const batchTotalRevenue = Number((finalPrice * batchSize).toFixed(2));
  const batchTotalProfit = Number((profitUnit * batchSize).toFixed(2));

  // Market Range & Competitiveness Traffic Light
  const volumeRange = MARKET_VOLUME_RANGES[marmitaData.volume] || MARKET_VOLUME_RANGES['350ml'];
  const statusInfo = getCompetitivenessStatus(finalPrice, marmitaData.volume);

  // Doughnut Chart Data
  const chartData = {
    labels: ['Ingredientes', 'Embalagens', 'Operação / Mão de Obra', 'Entrega', 'Lucro Bruto'],
    datasets: [
      {
        data: [
          Number(ingredientsCostUnit.toFixed(2)),
          Number(packagingCostUnit.toFixed(2)),
          Number(operationalCostUnit.toFixed(2)),
          Number(deliveryCostUnit.toFixed(2)),
          Number(profitUnit.toFixed(2))
        ],
        backgroundColor: [
          '#10B981', // emerald
          '#0D9488', // teal
          '#F97316', // orange
          '#8B5CF6', // purple
          '#22C55E'  // green
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          boxWidth: 12,
          padding: 12
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <section id="results" className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-6 h-6" />
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Resultado Inteligente & Precificação Recomendada
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Valores calculados com base na região de <strong>{selectedRegion}</strong>.
            </p>
          </div>

          <button
            onClick={() => onSaveToHistory({
              id: Date.now().toString(),
              name: marmitaData.name || 'Marmita Fit',
              volume: marmitaData.volume,
              totalCostUnit,
              profitUnit,
              finalPrice,
              margin: marmitaData.profitMargin,
              batchSize,
              batchTotalProfit,
              date: new Date().toLocaleDateString('pt-BR'),
              data: marmitaData
            })}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Salvar no Histórico</span>
          </button>
        </div>

        {/* 3 Main Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Custo de Produção */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Custo Total de Produção (Unid)
            </span>
            <div className="text-3xl font-black text-slate-800 dark:text-slate-100">
              R$ {totalCostUnit.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ingredientes, embalagem e operação.
            </p>
          </div>

          {/* Card 2: Lucro Aplicado */}
          <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Lucro Unitário ({marmitaData.profitMargin}%)
            </span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              + R$ {profitUnit.toFixed(2)}
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Lucro no Lote ({batchSize} unid): <strong>R$ {batchTotalProfit.toFixed(2)}</strong>
            </p>
          </div>

          {/* Card 3: Preço Final Recomendado */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-xl shadow-emerald-600/20 space-y-2 relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-10">
              <DollarSign className="w-20 h-20" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-100">
              Preço Final Recomendado
            </span>
            <div className="text-4xl font-black">
              R$ {finalPrice.toFixed(2)}
            </div>
            <p className="text-xs text-emerald-100 font-medium">
              Faturamento do Lote: <strong>R$ {batchTotalRevenue.toFixed(2)}</strong>
            </p>
          </div>

        </div>

        {/* Competitiveness Traffic Light Banner */}
        <div className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${statusInfo.badgeClass}`}>
          <div className="flex items-start space-x-3">
            <span className="text-3xl">{statusInfo.code}</span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base">
                  Semáforo de Mercado: {statusInfo.status}
                </h3>
              </div>
              <p className="text-xs mt-1 leading-relaxed max-w-3xl">
                {statusInfo.message}
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0 bg-white/40 dark:bg-slate-900/40 px-4 py-2 rounded-2xl border border-current">
            <span className="block text-[11px] font-bold uppercase">Média na sua Região ({marmitaData.volume})</span>
            <span className="text-sm font-black">R$ {volumeRange.min.toFixed(2)} a R$ {volumeRange.max.toFixed(2)}</span>
          </div>
        </div>

        {/* Visual Composition Grid: Chart & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Doughnut Chart */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 h-80 flex flex-col items-center justify-center">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center space-x-2">
              <PieChartIcon className="w-4 h-4 text-emerald-500" />
              <span>Composição da Marmita</span>
            </h4>
            <div className="w-full h-60 relative">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>Detalhamento de Custos por Unidade</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">🥬 Ingredientes Directos</span>
                <span className="font-bold text-slate-900 dark:text-white">R$ {ingredientsCostUnit.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">📦 Embalagem (Pote + Tampa + Etiqueta)</span>
                <span className="font-bold text-slate-900 dark:text-white">R$ {packagingCostUnit.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">⚡ Gás, Energia e Mão de Obra</span>
                <span className="font-bold text-slate-900 dark:text-white">R$ {operationalCostUnit.toFixed(2)}</span>
              </div>

              {marmitaData.hasDelivery && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">🛵 Taxa de Entrega</span>
                  <span className="font-bold text-slate-900 dark:text-white">R$ {deliveryCostUnit.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">📈 Lucro Bruto Proposto ({marmitaData.profitMargin}%)</span>
                <span className="font-black text-emerald-700 dark:text-emerald-400">R$ {profitUnit.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
