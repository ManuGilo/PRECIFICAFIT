// Faixas de preço praticadas no mercado regional por volume da embalagem

export const MARKET_VOLUME_RANGES = {
  '250ml': { min: 12.00, max: 17.50, avg: 14.90, label: 'Lanche / Snack Fit (250 ml)' },
  '350ml': { min: 16.00, max: 22.00, avg: 18.90, label: 'Marmita Padrão Fit (350 ml)' },
  '500ml': { min: 20.00, max: 28.00, avg: 23.90, label: 'Marmita Grande / Executiva Fit (500 ml)' },
  '750ml': { min: 27.00, max: 36.00, avg: 31.90, label: 'Marmita Família / Double (750 ml)' },
  '1000ml': { min: 34.00, max: 46.00, avg: 39.90, label: 'Combo / Porção Família (1000 ml)' }
};

export function getCompetitivenessStatus(finalPrice, volume = '350ml') {
  const range = MARKET_VOLUME_RANGES[volume] || MARKET_VOLUME_RANGES['350ml'];

  if (finalPrice < range.min) {
    return {
      status: 'Atenção (Preço Baixo)',
      color: 'yellow',
      code: '🟡',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
      message: `Seu preço (R$ ${finalPrice.toFixed(2)}) está abaixo da média de mercado da sua região (R$ ${range.min.toFixed(2)} - R$ ${range.max.toFixed(2)}). Cuidado para não sacrificar sua margem de lucro!`
    };
  } else if (finalPrice <= range.max) {
    return {
      status: 'Altamente Competitivo',
      color: 'green',
      code: '🟢',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
      message: `Excelente! O seu preço (R$ ${finalPrice.toFixed(2)}) está perfeitamente alinhado com a média regional (R$ ${range.min.toFixed(2)} - R$ ${range.max.toFixed(2)}).`
    };
  } else {
    return {
      status: 'Acima do Mercado',
      color: 'red',
      code: '🔴',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700',
      message: `Atenção: Seu preço (R$ ${finalPrice.toFixed(2)}) está acima da média praticada na sua região (R$ ${range.min.toFixed(2)} - R$ ${range.max.toFixed(2)}). Certifique-se de destacar seus diferenciais de qualidade!`
    };
  }
}
