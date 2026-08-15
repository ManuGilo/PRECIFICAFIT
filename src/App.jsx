import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Calculator from './components/Calculator';
import ResultDashboard from './components/ResultDashboard';
import ScenarioSimulator from './components/ScenarioSimulator';
import NutriPrecoAI from './components/NutriPrecoAI';
import HistoryAndCompare from './components/HistoryAndCompare';
import ExportReports from './components/ExportReports';
import GamificationBadges, { triggerConfetti } from './components/GamificationBadges';
import Footer from './components/Footer';
import { INITIAL_INGREDIENTS, getRegionalPricePerKg } from './data/ingredientsData';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [selectedRegion, setSelectedRegion] = useState('SP');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);

  // History state with localStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('precificafit_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Unlocked badge IDs
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState(() => {
    try {
      const saved = localStorage.getItem('precificafit_badges');
      return saved ? JSON.parse(saved) : ['first_calc', 'regional_master'];
    } catch (e) {
      return ['first_calc', 'regional_master'];
    }
  });

  // Main Marmita Active Calculator State
  const [marmitaData, setMarmitaData] = useState({
    name: 'Frango Grelhado, Batata Doce e Brócolis',
    volume: '350ml',
    batchSize: 10,
    ingredients: [
      {
        id: '1',
        name: 'Peito de Frango Desfiado / Grelhado',
        category: 'Proteína',
        pricePerKg: getRegionalPricePerKg(INITIAL_INGREDIENTS[0], 'SP'),
        grams: 150
      },
      {
        id: '10',
        name: 'Batata Doce Assada / Purê',
        category: 'Carboidrato',
        pricePerKg: getRegionalPricePerKg(INITIAL_INGREDIENTS[9], 'SP'),
        grams: 130
      },
      {
        id: '16',
        name: 'Brócolis no Vapor',
        category: 'Vegetal',
        pricePerKg: getRegionalPricePerKg(INITIAL_INGREDIENTS[15], 'SP'),
        grams: 80
      },
      {
        id: '26',
        name: 'Azeite de Oliva / Temperos',
        category: 'Tempero',
        pricePerKg: getRegionalPricePerKg(INITIAL_INGREDIENTS[25], 'SP'),
        grams: 15
      }
    ],
    packagingCost: 0.85,
    labelCost: 0.35,
    operationalBatchCost: 6.00,
    laborBatchCost: 15.00,
    platformFeePercent: 0,
    hasDelivery: true,
    deliveryKm: 4,
    deliveryCostPerKm: 1.50,
    deliveryFixedFee: 2.00,
    profitMargin: 35
  });

  // Apply dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist history & badges
  useEffect(() => {
    localStorage.setItem('precificafit_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('precificafit_badges', JSON.stringify(unlockedBadgeIds));
  }, [unlockedBadgeIds]);

  // Gamification check when profit changes
  useEffect(() => {
    if (marmitaData.profitMargin >= 40 && !unlockedBadgeIds.includes('profitable_biz')) {
      setUnlockedBadgeIds(prev => [...prev, 'profitable_biz']);
      triggerConfetti();
    }
  }, [marmitaData.profitMargin]);

  // Save to history handler
  const handleSaveToHistory = (item) => {
    setHistory(prev => [item, ...prev]);

    if (!unlockedBadgeIds.includes('first_calc')) {
      setUnlockedBadgeIds(prev => [...prev, 'first_calc']);
    }

    if (history.length + 1 >= 10 && !unlockedBadgeIds.includes('simulations_10')) {
      setUnlockedBadgeIds(prev => [...prev, 'simulations_10']);
    }

    triggerConfetti();
    alert(`Marmita "${item.name}" salva no histórico com sucesso!`);
  };

  const handleClearHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico?')) {
      setHistory([]);
    }
  };

  const handleLoadMarmita = (data) => {
    if (data) {
      setMarmitaData(data);
      const calcEl = document.getElementById('calculator');
      if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCalculator = () => {
    const calcEl = document.getElementById('calculator');
    if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <Header
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        unlockedBadgesCount={unlockedBadgeIds.length}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onStartClick={scrollToCalculator} />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Interactive Calculator Section */}
        <Calculator
          selectedRegion={selectedRegion}
          marmitaData={marmitaData}
          setMarmitaData={setMarmitaData}
          onSaveMarmita={handleSaveToHistory}
        />

        {/* Financial Results & Competitiveness Dashboard */}
        <ResultDashboard
          marmitaData={marmitaData}
          selectedRegion={selectedRegion}
          onSaveToHistory={handleSaveToHistory}
        />

        {/* Real-time Scenario Simulator */}
        <ScenarioSimulator
          marmitaData={marmitaData}
        />

        {/* NutriPreço AI Assistant */}
        <NutriPrecoAI
          marmitaData={marmitaData}
          selectedRegion={selectedRegion}
        />

        {/* Reports & PDF/Excel Export */}
        <ExportReports
          marmitaData={marmitaData}
          selectedRegion={selectedRegion}
        />
      </main>

      {/* History & Compare Drawer Modal */}
      <HistoryAndCompare
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onLoadMarmita={handleLoadMarmita}
      />

      {/* Gamification Achievements Modal */}
      <GamificationBadges
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
        unlockedBadgeIds={unlockedBadgeIds}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
