// Base de dados regional de preços de ingredientes para Marmitas Fit (por kg ou litro)

export const REGIONS_LIST = [
  { code: 'BR', name: 'Média Nacional (Brasil)' },
  { code: 'SP', name: 'São Paulo (SP)' },
  { code: 'RJ', name: 'Rio de Janeiro (RJ)' },
  { code: 'MG', name: 'Minas Gerais (MG)' },
  { code: 'PR', name: 'Paraná (PR)' },
  { code: 'RS', name: 'Rio Grande do Sul (RS)' },
  { code: 'SC', name: 'Santa Catarina (SC)' },
  { code: 'BA', name: 'Bahia (BA)' },
  { code: 'PE', name: 'Pernambuco (PE)' },
  { code: 'CE', name: 'Ceará (CE)' },
  { code: 'DF', name: 'Distrito Federal (DF)' },
  { code: 'GO', name: 'Goiás (GO)' },
  { code: 'ES', name: 'Espírito Santo (ES)' }
];

// Fatores de variação de preço por estado em relação à média nacional (exemplo realista)
export const STATE_PRICE_MULTIPLIERS = {
  BR: 1.0,
  SP: 1.08,
  RJ: 1.12,
  MG: 0.95,
  PR: 0.96,
  RS: 0.98,
  SC: 1.02,
  BA: 0.93,
  PE: 0.94,
  CE: 0.92,
  DF: 1.10,
  GO: 0.94,
  ES: 1.01
};

export const INITIAL_INGREDIENTS = [
  // Proteínas
  { id: '1', name: 'Peito de Frango Desfiado / Grelhado', category: 'Proteína', basePricePerKg: 22.90, defaultGramsG: 150 },
  { id: '2', name: 'Patinho Moído / Iscas', category: 'Proteína', basePricePerKg: 38.50, defaultGramsG: 150 },
  { id: '3', name: 'Carne Moída (Acinzen / Alcatra)', category: 'Proteína', basePricePerKg: 34.00, defaultGramsG: 150 },
  { id: '4', name: 'Tilápia / Filé de Peixe', category: 'Proteína', basePricePerKg: 42.00, defaultGramsG: 150 },
  { id: '5', name: 'Salmão Grelhado', category: 'Proteína', basePricePerKg: 89.00, defaultGramsG: 120 },
  { id: '6', name: 'Sobrecoxa de Frango Desossada', category: 'Proteína', basePricePerKg: 18.50, defaultGramsG: 160 },
  { id: '7', name: 'Ovos de Galinha (Dúzia -> por g)', category: 'Proteína', basePricePerKg: 14.00, defaultGramsG: 100 },
  { id: '8', name: 'Tofu Temperado / Proteína Vegetal', category: 'Proteína', basePricePerKg: 32.00, defaultGramsG: 130 },

  // Carboidratos
  { id: '9', name: 'Arroz Integral Cozido', category: 'Carboidrato', basePricePerKg: 7.50, defaultGramsG: 120 },
  { id: '10', name: 'Batata Doce Assada / Purê', category: 'Carboidrato', basePricePerKg: 5.80, defaultGramsG: 130 },
  { id: '11', name: 'Batata Inglesa / Purê', category: 'Carboidrato', basePricePerKg: 6.20, defaultGramsG: 130 },
  { id: '12', name: 'Mandioca / Aipim Cozido', category: 'Carboidrato', basePricePerKg: 6.90, defaultGramsG: 120 },
  { id: '13', name: 'Macarrão Integral Cozido', category: 'Carboidrato', basePricePerKg: 9.80, defaultGramsG: 120 },
  { id: '14', name: 'Quinoa Cozida', category: 'Carboidrato', basePricePerKg: 28.00, defaultGramsG: 80 },
  { id: '15', name: 'Cuscuz Marroquino / Milho', category: 'Carboidrato', basePricePerKg: 12.00, defaultGramsG: 100 },

  // Vegetais e Legumes
  { id: '16', name: 'Brócolis no Vapor', category: 'Vegetal', basePricePerKg: 14.50, defaultGramsG: 80 },
  { id: '17', name: 'Cenoura Ralada / Cozida', category: 'Vegetal', basePricePerKg: 5.20, defaultGramsG: 70 },
  { id: '18', name: 'Couve-Flor Assada / Purê', category: 'Vegetal', basePricePerKg: 12.00, defaultGramsG: 80 },
  { id: '19', name: 'Vagem Refogada', category: 'Vegetal', basePricePerKg: 11.00, defaultGramsG: 60 },
  { id: '20', name: 'Abobrinha Grelhada', category: 'Vegetal', basePricePerKg: 6.80, defaultGramsG: 70 },
  { id: '21', name: 'Mix de Folhas (Alface, Rúcula)', category: 'Vegetal', basePricePerKg: 16.00, defaultGramsG: 50 },

  // Leguminosas e Outros
  { id: '22', name: 'Feijão Preto Cozido', category: 'Leguminosa', basePricePerKg: 8.50, defaultGramsG: 90 },
  { id: '23', name: 'Feijão Carioca Cozido', category: 'Leguminosa', basePricePerKg: 7.90, defaultGramsG: 90 },
  { id: '24', name: 'Grão de Bico Temperado', category: 'Leguminosa', basePricePerKg: 15.00, defaultGramsG: 80 },
  { id: '25', name: 'Lentilha Cozida', category: 'Leguminosa', basePricePerKg: 16.50, defaultGramsG: 80 },
  { id: '26', name: 'Azeite de Oliva / Temperos', category: 'Tempero', basePricePerKg: 45.00, defaultGramsG: 15 }
];

export function getRegionalPricePerKg(ingredient, regionCode = 'BR') {
  const multiplier = STATE_PRICE_MULTIPLIERS[regionCode] || 1.0;
  return Number((ingredient.basePricePerKg * multiplier).toFixed(2));
}

export function calculateIngredientCost(ingredient, grams, regionCode = 'BR') {
  const pricePerKg = getRegionalPricePerKg(ingredient, regionCode);
  const cost = (pricePerKg / 1000) * grams;
  return Number(cost.toFixed(2));
}
