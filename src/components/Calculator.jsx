import React, { useState } from 'react';
import { INITIAL_INGREDIENTS, getRegionalPricePerKg } from '../data/ingredientsData';
import { Search, Plus, Trash2, Box, Truck, DollarSign, Percent, Info, Layers, RefreshCw, ChefHat, Tag } from 'lucide-react';

export default function Calculator({
  selectedRegion,
  marmitaData,
  setMarmitaData,
  onSaveMarmita
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customIngName, setCustomIngName] = useState('');
  const [customIngPrice, setCustomIngPrice] = useState('');
  const [customIngGrams, setCustomIngGrams] = useState(100);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Volume presets
  const volumes = [
    { value: '250ml', label: '250 ml', desc: 'Snack / Infantil' },
    { value: '350ml', label: '350 ml', desc: 'Padrão Fit' },
    { value: '500ml', label: '500 ml', desc: 'Grande / Executiva' },
    { value: '750ml', label: '750 ml', desc: 'Double Fit' },
    { value: '1000ml', label: '1000 ml', desc: 'Porção Lote / Família' },
  ];

  // Profit presets
  const profitPresets = [10, 20, 30, 40, 50, 60, 70, 80, 100];

  // Filter available ingredients for search
  const filteredSearchIngredients = INITIAL_INGREDIENTS.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add ingredient from list
  const handleAddIngredient = (baseItem) => {
    const regionalPrice = getRegionalPricePerKg(baseItem, selectedRegion);
    const newItem = {
      id: Date.now().toString() + Math.random(),
      name: baseItem.name,
      category: baseItem.category,
      pricePerKg: regionalPrice,
      grams: baseItem.defaultGramsG || 100
    };
    setMarmitaData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newItem]
    }));
    setSearchTerm('');
  };

  // Add custom ingredient
  const handleAddCustomIngredient = (e) => {
    e.preventDefault();
    if (!customIngName || !customIngPrice) return;

    const newItem = {
      id: Date.now().toString(),
      name: customIngName,
      category: 'Customizado',
      pricePerKg: parseFloat(customIngPrice) || 0,
      grams: parseInt(customIngGrams) || 100
    };

    setMarmitaData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newItem]
    }));

    setCustomIngName('');
    setCustomIngPrice('');
    setCustomIngGrams(100);
    setShowCustomModal(false);
  };

  // Update added ingredient
  const handleUpdateIngredient = (id, field, value) => {
    setMarmitaData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing => {
        if (ing.id === id) {
          return { ...ing, [field]: value };
        }
        return ing;
      })
    }));
  };

  // Remove ingredient
  const handleRemoveIngredient = (id) => {
    setMarmitaData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing.id !== id)
    }));
  };

  // Recalculate regional prices for existing standard items when state changes
  const handleResetRegionalPrices = () => {
    setMarmitaData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing => {
        const found = INITIAL_INGREDIENTS.find(base => base.name === ing.name);
        if (found) {
          return {
            ...ing,
            pricePerKg: getRegionalPricePerKg(found, selectedRegion)
          };
        }
        return ing;
      })
    }));
  };

  return (
    <section id="calculator" className="py-12 bg-slate-50 dark:bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <ChefHat className="w-7 h-7 text-emerald-500" />
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Calculadora Inteligente de Marmita Fit
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Monte sua receita, ajuste gramas e custos operacionais em tempo real.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleResetRegionalPrices}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1.5 shadow-sm"
              title="Atualizar preços dos ingredientes para a UF selecionada"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
              <span>Atualizar Preços ({selectedRegion})</span>
            </button>
          </div>
        </div>

        {/* Form Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Controls (Steps 1 to 5) */}
          <div className="lg:col-span-12 space-y-8">
            
            {/* ETAPA 1: Informações da Marmita */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-md">
              <div className="flex items-center space-x-3 mb-6">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm">
                  1
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Informações da Marmita & Lote
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Defina a identificação, volume e rendimento do preparo.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Nome */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Nome da Marmita
                  </label>
                  <input
                    type="text"
                    value={marmitaData.name}
                    onChange={(e) => setMarmitaData({ ...marmitaData, name: e.target.value })}
                    placeholder="Ex: Frango Grelhado, Batata Doce e Brócolis"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-medium"
                  />
                </div>

                {/* Quantidade no Lote */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Unidades no Lote (Rendimento)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={marmitaData.batchSize}
                    onChange={(e) => setMarmitaData({ ...marmitaData, batchSize: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-bold"
                  />
                </div>

                {/* Volume Presets */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    Volume da Embalagem
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {volumes.map((vol) => (
                      <button
                        key={vol.value}
                        type="button"
                        onClick={() => setMarmitaData({ ...marmitaData, volume: vol.value })}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          marmitaData.volume === vol.value
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20 font-bold'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        <div className="text-sm font-extrabold">{vol.label}</div>
                        <div className={`text-[11px] mt-0.5 ${marmitaData.volume === vol.value ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                          {vol.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ETAPA 2: Ingredientes */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 font-bold flex items-center justify-center text-sm">
                    2
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Ingredientes da Marmita
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pesquise e adicione a quantidade em gramas por unidade.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCustomModal(true)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Ingrediente Customizado</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar por Frango, Patinho, Batata Doce, Brócolis, Feijão..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-medium"
                />

                {/* Dropdown Results */}
                {searchTerm.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl z-30 divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredSearchIngredients.length > 0 ? (
                      filteredSearchIngredients.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleAddIngredient(item)}
                          className="w-full px-4 py-3 text-left hover:bg-emerald-50 dark:hover:bg-slate-700/60 flex items-center justify-between transition-colors group"
                        >
                          <div>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                              {item.name}
                            </span>
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                            <span>R$ {getRegionalPricePerKg(item, selectedRegion).toFixed(2)}/kg</span>
                            <Plus className="w-4 h-4" />
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500">
                        Nenhum ingrediente encontrado. Clique em "Novo Ingrediente Customizado".
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Ingredients Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[11px] font-bold">
                      <th className="pb-3 px-2">Ingrediente</th>
                      <th className="pb-3 px-2">Qtd (gramas)</th>
                      <th className="pb-3 px-2">Preço ({selectedRegion}) / kg</th>
                      <th className="pb-3 px-2">Custo Unitário</th>
                      <th className="pb-3 px-2 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {marmitaData.ingredients.length > 0 ? (
                      marmitaData.ingredients.map((item) => {
                        const unitCost = (item.pricePerKg / 1000) * item.grams;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                            <td className="py-3 px-2 font-bold text-slate-800 dark:text-slate-100">
                              {item.name}
                              <span className="block text-[11px] font-normal text-slate-400">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center space-x-1">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.grams}
                                  onChange={(e) => handleUpdateIngredient(item.id, 'grams', parseFloat(e.target.value) || 0)}
                                  className="w-20 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100 text-xs"
                                />
                                <span className="text-xs text-slate-400">g</span>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-slate-400">R$</span>
                                <input
                                  type="number"
                                  step="0.10"
                                  value={item.pricePerKg}
                                  onChange={(e) => handleUpdateIngredient(item.id, 'pricePerKg', parseFloat(e.target.value) || 0)}
                                  className="w-24 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100 text-xs"
                                />
                              </div>
                            </td>
                            <td className="py-3 px-2 font-extrabold text-emerald-600 dark:text-emerald-400">
                              R$ {unitCost.toFixed(2)}
                            </td>
                            <td className="py-3 px-2 text-right">
                              <button
                                onClick={() => handleRemoveIngredient(item.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                title="Remover Ingrediente"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">
                          Nenhum ingrediente adicionado ainda. Use a barra de pesquisa acima para selecionar!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ETAPA 3 & ETAPA 4: Custos Adicionais & Entrega */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Custos de Embalagem e Operação */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-md space-y-6">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-sm">
                    3
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Embalagem & Custos Operacionais
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Custos de pote, tampa, etiquetas, gás, luz e mão de obra.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Pote + Tampa (unid)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-slate-400">R$</span>
                        <input
                          type="number"
                          step="0.05"
                          value={marmitaData.packagingCost}
                          onChange={(e) => setMarmitaData({ ...marmitaData, packagingCost: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Etiqueta + Talher (unid)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-slate-400">R$</span>
                        <input
                          type="number"
                          step="0.05"
                          value={marmitaData.labelCost}
                          onChange={(e) => setMarmitaData({ ...marmitaData, labelCost: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Gás + Energia / Lote
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-slate-400">R$</span>
                        <input
                          type="number"
                          step="0.50"
                          value={marmitaData.operationalBatchCost}
                          onChange={(e) => setMarmitaData({ ...marmitaData, operationalBatchCost: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Mão de Obra / Lote
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-slate-400">R$</span>
                        <input
                          type="number"
                          step="1.00"
                          value={marmitaData.laborBatchCost}
                          onChange={(e) => setMarmitaData({ ...marmitaData, laborBatchCost: parseFloat(e.target.value) || 0 })}
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Taxa iFood / Cartão (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        value={marmitaData.platformFeePercent}
                        onChange={(e) => setMarmitaData({ ...marmitaData, platformFeePercent: parseFloat(e.target.value) || 0 })}
                        className="w-full pr-8 pl-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Taxa de Entrega / Logística */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-md space-y-6">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-sm">
                    4
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Opções de Entrega & Logística
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sua marmita inclui taxa de frete no cálculo?
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Delivery Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Incluir Entrega no Custo Unitário?
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setMarmitaData({ ...marmitaData, hasDelivery: false })}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          !marmitaData.hasDelivery
                            ? 'bg-slate-700 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Não
                      </button>
                      <button
                        type="button"
                        onClick={() => setMarmitaData({ ...marmitaData, hasDelivery: true })}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          marmitaData.hasDelivery
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Sim
                      </button>
                    </div>
                  </div>

                  {marmitaData.hasDelivery && (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                            Distância Média (km)
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            value={marmitaData.deliveryKm}
                            onChange={(e) => setMarmitaData({ ...marmitaData, deliveryKm: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                            Custo por KM (R$)
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            value={marmitaData.deliveryCostPerKm}
                            onChange={(e) => setMarmitaData({ ...marmitaData, deliveryCostPerKm: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                          Taxa Fixa por Entrega (R$)
                        </label>
                        <input
                          type="number"
                          step="1.00"
                          value={marmitaData.deliveryFixedFee}
                          onChange={(e) => setMarmitaData({ ...marmitaData, deliveryFixedFee: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* ETAPA 5: Margem de Lucro */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm">
                    5
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Margem de Lucro Desejada
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Defina a porcentagem de lucro sobre o custo de produção.
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-emerald-500 text-white font-extrabold text-lg shadow-md shadow-emerald-500/20">
                  {marmitaData.profitMargin}%
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={marmitaData.profitMargin}
                  onChange={(e) => setMarmitaData({ ...marmitaData, profitMargin: parseInt(e.target.value) || 0 })}
                  className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {profitPresets.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setMarmitaData({ ...marmitaData, profitMargin: preset })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        marmitaData.profitMargin === preset
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                  💡 Você escolheu uma margem de lucro de <strong className="underline">{marmitaData.profitMargin}%</strong> sobre o custo direto de produção.
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal for Custom Ingredient */}
        {showCustomModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Adicionar Novo Ingrediente
              </h3>

              <form onSubmit={handleAddCustomIngredient} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nome do Ingrediente
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Castanha do Pará / Whey Protein"
                    value={customIngName}
                    onChange={(e) => setCustomIngName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Preço por KG (R$)
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      required
                      placeholder="Ex: 45.00"
                      value={customIngPrice}
                      onChange={(e) => setCustomIngPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Porção Padrão (g)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={customIngGrams}
                      onChange={(e) => setCustomIngGrams(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md hover:bg-emerald-600"
                  >
                    Salvar Ingrediente
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
