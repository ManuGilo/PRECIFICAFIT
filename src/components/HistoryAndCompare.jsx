import React, { useState } from 'react';
import { X, Trash2, Scale, Bookmark, ArrowRight, Check, Star } from 'lucide-react';

export default function HistoryAndCompare({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onLoadMarmita
}) {
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('history'); // 'history' or 'compare'

  if (!isOpen) return null;

  const toggleSelectForCompare = (item) => {
    if (selectedForCompare.some(i => i.id === item.id)) {
      setSelectedForCompare(selectedForCompare.filter(i => i.id !== item.id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('Você só pode comparar até 3 marmitas simultaneamente.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, item]);
    }
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fId => fId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Topbar */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode('history')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                viewMode === 'history'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Histórico de Cálculos ({history.length})
            </button>

            <button
              onClick={() => setViewMode('compare')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'compare'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Comparar Selecionados ({selectedForCompare.length}/3)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {viewMode === 'history' ? (
            <>
              {history.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Selecione marmitas para comparar lado a lado ou para carregar na calculadora.</span>
                    <button
                      onClick={onClearHistory}
                      className="text-rose-500 hover:underline font-bold flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Limpar Histórico</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.map((item) => {
                      const isSelected = selectedForCompare.some(i => i.id === item.id);
                      const isFav = favorites.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                                  {item.name}
                                </h4>
                                <button onClick={() => toggleFavorite(item.id)}>
                                  <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                                </button>
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                Volume: {item.volume} • {item.date}
                              </span>
                            </div>

                            <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs">
                              R$ {item.finalPrice.toFixed(2)}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 my-3 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                            <div>
                              <span className="text-[10px] text-slate-400 block">Custo Unit</span>
                              <strong className="text-slate-700 dark:text-slate-200">R$ {item.totalCostUnit.toFixed(2)}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">Margem</span>
                              <strong className="text-emerald-600">{item.margin}%</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">Lucro Lote</span>
                              <strong className="text-emerald-600">R$ {item.batchTotalProfit.toFixed(2)}</strong>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectForCompare(item)}
                                className="rounded text-orange-500 focus:ring-orange-500"
                              />
                              <span>Comparar</span>
                            </label>

                            <button
                              onClick={() => {
                                onLoadMarmita(item.data);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center space-x-1"
                            >
                              <span>Carregar Marmita</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <Bookmark className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-semibold">Nenhuma marmita salva no histórico ainda.</p>
                  <p className="text-xs">Calcule uma marmita acima e clique em "Salvar no Histórico".</p>
                </div>
              )}
            </>
          ) : (
            <>
              {selectedForCompare.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Comparativo Lado a Lado
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="p-3 text-slate-400 uppercase text-[11px]">Indicador</th>
                          {selectedForCompare.map(m => (
                            <th key={m.id} className="p-3 font-extrabold text-slate-900 dark:text-white text-base">
                              {m.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        <tr>
                          <td className="p-3 font-semibold text-slate-500">Volume da Embalagem</td>
                          {selectedForCompare.map(m => (
                            <td key={m.id} className="p-3 font-bold">{m.volume}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-500">Custo Total de Produção</td>
                          {selectedForCompare.map(m => (
                            <td key={m.id} className="p-3 font-bold text-slate-800 dark:text-slate-200">R$ {m.totalCostUnit.toFixed(2)}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-500">Margem de Lucro (%)</td>
                          {selectedForCompare.map(m => (
                            <td key={m.id} className="p-3 font-bold text-emerald-600">{m.margin}%</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-500">Preço Final Recomendado</td>
                          {selectedForCompare.map(m => (
                            <td key={m.id} className="p-3 font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                              R$ {m.finalPrice.toFixed(2)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-500">Lucro Total do Lote ({selectedForCompare[0]?.batchSize || 10} unid)</td>
                          {selectedForCompare.map(m => (
                            <td key={m.id} className="p-3 font-bold text-emerald-600">R$ {m.batchTotalProfit.toFixed(2)}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <Scale className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-semibold">Nenhuma marmita selecionada para comparação.</p>
                  <p className="text-xs">Vá para a aba "Histórico de Cálculos" e marque as caixas das marmitas que deseja comparar.</p>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
