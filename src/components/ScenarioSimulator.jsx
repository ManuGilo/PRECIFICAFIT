import React, { useState } from 'react';
import { Sliders, ArrowUpRight, ArrowDownRight, RefreshCw, Zap, TrendingUp } from 'lucide-react';

export default function ScenarioSimulator({ marmitaData }) {
  // Simulator adjustments
  const [profitAdjustment, setProfitAdjustment] = useState(0); // -20% to +30%
  const [ingredientCostMultiplier, setIngredientCostMultiplier] = useState(1.0); // 0.8 (20% discount) to 1.3 (30% rise)
  const [packagingDiscount, setPackagingDiscount] = useState(0); // R$ discount per container

  // Base values
  const ingredientsCostUnit = marmitaData.ingredients.reduce((acc, item) => acc + ((item.pricePerKg / 1000) * item.grams), 0);
  const packagingCostUnit = (marmitaData.packagingCost || 0) + (marmitaData.labelCost || 0);
  const batchSize = Math.max(1, marmitaData.batchSize || 1);
  const operationalCostUnit = ((marmitaData.operationalBatchCost || 0) + (marmitaData.laborBatchCost || 0)) / batchSize;
  const deliveryCostUnit = marmitaData.hasDelivery
    ? ((marmitaData.deliveryKm || 0) * (marmitaData.deliveryCostPerKm || 0) + (marmitaData.deliveryFixedFee || 0))
    : 0;

  const baseCost = ingredientsCostUnit + packagingCostUnit + operationalCostUnit + deliveryCostUnit;
  const baseMargin = marmitaData.profitMargin || 30;
  const baseProfit = baseCost * (baseMargin / 100);
  const basePrice = baseCost + baseProfit;

  // Simulated values
  const simulatedIngredientsCost = ingredientsCostUnit * ingredientCostMultiplier;
  const simulatedPackagingCost = Math.max(0, packagingCostUnit - packagingDiscount);
  const simulatedCost = simulatedIngredientsCost + simulatedPackagingCost + operationalCostUnit + deliveryCostUnit;

  const simulatedMargin = Math.max(0, baseMargin + profitAdjustment);
  const simulatedProfit = simulatedCost * (simulatedMargin / 100);
  const simulatedPrice = simulatedCost + simulatedProfit;

  const priceDiff = simulatedPrice - basePrice;
  const profitDiff = simulatedProfit - baseProfit;
  const batchProfitDiff = profitDiff * batchSize;

  const resetSimulator = () => {
    setProfitAdjustment(0);
    setIngredientCostMultiplier(1.0);
    setPackagingDiscount(0);
  };

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
              <Sliders className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Simulador de Cenários & Negociações
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Simule descontos com fornecedores ou reajustes de preço e veja o impacto financeiro no lote.
              </p>
            </div>
          </div>

          <button
            onClick={resetSimulator}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resetar Simulação</span>
          </button>
        </div>

        {/* Simulator Controls & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 space-y-6 shadow-md">
            
            {/* Control 1: Ingredient Price Variation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Variação de Preço dos Ingredientes</span>
                <span className={`px-2 py-0.5 rounded-lg ${ingredientCostMultiplier < 1 ? 'bg-emerald-100 text-emerald-800' : ingredientCostMultiplier > 1 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}`}>
                  {ingredientCostMultiplier === 1 ? 'Preço Normal' : `${((ingredientCostMultiplier - 1) * 100).toFixed(0)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={ingredientCostMultiplier}
                onChange={(e) => setIngredientCostMultiplier(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>-30% (Desconto no atacado)</span>
                <span>Normal</span>
                <span>+30% (Alta dos alimentos)</span>
              </div>
            </div>

            {/* Control 2: Margin Adjustment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Ajuste de Margem de Lucro</span>
                <span className="px-2 py-0.5 rounded-lg bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 font-bold">
                  {simulatedMargin}% ({profitAdjustment >= 0 ? `+${profitAdjustment}%` : `${profitAdjustment}%`})
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="30"
                step="1"
                value={profitAdjustment}
                onChange={(e) => setProfitAdjustment(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Control 3: Packaging Discount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Economia na Embalagem por Unidade (R$)</span>
                <span className="font-bold text-emerald-600">
                  R$ {packagingDiscount.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1.50"
                step="0.10"
                value={packagingDiscount}
                onChange={(e) => setPackagingDiscount(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

          </div>

          {/* Impact Comparison Box */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase text-orange-400 tracking-wider flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>Resultado do Cenário Simulado</span>
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700 text-slate-200 font-semibold">
                  Lote de {batchSize} marmitas
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                {/* Preço Unitário */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Preço Final Unitário</span>
                  <div className="text-2xl font-black text-white mt-1">
                    R$ {simulatedPrice.toFixed(2)}
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-semibold mt-1">
                    {priceDiff >= 0 ? (
                      <span className="text-emerald-400 flex items-center">
                        <ArrowUpRight className="w-3.5 h-3.5" /> +R$ {priceDiff.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center">
                        <ArrowDownRight className="w-3.5 h-3.5" /> -R$ {Math.abs(priceDiff).toFixed(2)}
                      </span>
                    )}
                    <span className="text-slate-400">vs atual</span>
                  </div>
                </div>

                {/* Lucro no Lote */}
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase block">Lucro Total do Lote</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    R$ {(simulatedProfit * batchSize).toFixed(2)}
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-semibold mt-1">
                    {batchProfitDiff >= 0 ? (
                      <span className="text-emerald-300 font-bold flex items-center">
                        <ArrowUpRight className="w-3.5 h-3.5" /> +R$ {batchProfitDiff.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-rose-300 font-bold flex items-center">
                        <ArrowDownRight className="w-3.5 h-3.5" /> -R$ {Math.abs(batchProfitDiff).toFixed(2)}
                      </span>
                    )}
                    <span className="text-emerald-200/70">no lote</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300">
              💡 <strong>Dica Estratégica:</strong> Economizar R$ 0,50 no pote por unidade aumenta o seu lucro no lote em R$ {(0.50 * batchSize).toFixed(2)} sem precisar aumentar o preço para o cliente final!
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
