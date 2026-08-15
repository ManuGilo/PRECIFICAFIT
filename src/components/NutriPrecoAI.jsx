import React, { useState } from 'react';
import { MARKET_VOLUME_RANGES } from '../data/marketRanges';
import { Bot, Send, Sparkles, HelpCircle, MessageSquare, Lightbulb, CheckCircle } from 'lucide-react';

export default function NutriPrecoAI({ marmitaData, selectedRegion }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Olá! Sou o **NutriPreço AI**, seu assistente especializado em precificação e lucratividade para marmitas fit. Como posso te ajudar a otimizar sua receita de "${marmitaData.name || 'Marmita Fit'}" hoje?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Quick Preset Questions
  const presetQuestions = [
    "Estou cobrando barato demais?",
    "Qual lucro é recomendado?",
    "Como reduzir custos?",
    "Qual ingrediente mais impacta meu preço?"
  ];

  // Helper calculations
  const ingredientsCostUnit = marmitaData.ingredients.reduce((acc, item) => acc + ((item.pricePerKg / 1000) * item.grams), 0);
  const packagingCostUnit = (marmitaData.packagingCost || 0) + (marmitaData.labelCost || 0);
  const batchSize = Math.max(1, marmitaData.batchSize || 1);
  const operationalCostUnit = ((marmitaData.operationalBatchCost || 0) + (marmitaData.laborBatchCost || 0)) / batchSize;
  const deliveryCostUnit = marmitaData.hasDelivery
    ? ((marmitaData.deliveryKm || 0) * (marmitaData.deliveryCostPerKm || 0) + (marmitaData.deliveryFixedFee || 0))
    : 0;

  const totalCost = ingredientsCostUnit + packagingCostUnit + operationalCostUnit + deliveryCostUnit;
  const margin = marmitaData.profitMargin || 30;
  const profitUnit = totalCost * (margin / 100);
  const finalPrice = totalCost + profitUnit;

  const volumeRange = MARKET_VOLUME_RANGES[marmitaData.volume] || MARKET_VOLUME_RANGES['350ml'];

  // AI Logic Generator based on active parameters
  const generateAIResponse = (question) => {
    const q = question.toLowerCase();

    if (q.includes("barato") || q.includes("cobrando")) {
      if (finalPrice < volumeRange.min) {
        return `⚠️ **Sim, você está cobrando abaixo da média regional!** O preço praticado no mercado para marmitas de ${marmitaData.volume} na região ${selectedRegion} varia de **R$ ${volumeRange.min.toFixed(2)} a R$ ${volumeRange.max.toFixed(2)}**. O seu valor atual de **R$ ${finalPrice.toFixed(2)}** pode estar deixando dinheiro na mesa ou comprometendo sua margem de sustentabilidade. Recomendamos ajustar sua margem para pelo menos 35% ou 40%.`;
      } else if (finalPrice <= volumeRange.max) {
        return `✅ **Você está em uma excelente faixa competitiva!** Seu preço de **R$ ${finalPrice.toFixed(2)}** está dentro da média regional (**R$ ${volumeRange.min.toFixed(2)} a R$ ${volumeRange.max.toFixed(2)}**) para o tamanho de ${marmitaData.volume}. Isso garante boa aceitação do público sem abrir mão do seu lucro de **R$ ${profitUnit.toFixed(2)} por unidade**.`;
      } else {
        return `🔴 **Seu preço de R$ ${finalPrice.toFixed(2)} está acima da média regional (R$ ${volumeRange.max.toFixed(2)}).** Para sustentar esse valor no mercado, certifique-se de enfatizar ingredientes orgânicos, temperos frescos e embalagens biodegradáveis ou premium!`;
      }
    }

    if (q.includes("lucro") || q.includes("recomendado")) {
      return `💡 **Margem Recomendada para Marmitas Fit:**\n- **Produção Caseira / MEI:** 35% a 50% de margem sobre os custos diretos.\n- **Vendas corporativas em lote:** 25% a 35%.\n- **Linha Premium / Gourmet:** 50% a 70%.\n\nNa sua receita atual, você definiu **${margin}%**, o que resulta em um lucro de **R$ ${profitUnit.toFixed(2)} por marmita** (R$ ${(profitUnit * batchSize).toFixed(2)} no lote de ${batchSize} unidades).`;
    }

    if (q.includes("reduzir") || q.includes("custo")) {
      let highestIng = null;
      let maxCost = 0;
      marmitaData.ingredients.forEach(ing => {
        const cost = (ing.pricePerKg / 1000) * ing.grams;
        if (cost > maxCost) {
          maxCost = cost;
          highestIng = ing;
        }
      });

      let advice = `🎯 **Estratégias de Redução de Custos:**\n1. **Compra no Atacado:** Comprar embalagens em pacotes de 100+ unidades reduz o custo unitário em até 25%.\n2. **Porcionamento Inteligente:** Padronize gramagens na balança para evitar desperdício.`;
      if (highestIng) {
        advice += `\n3. **Ingrediente de maior impacto:** O ingrediente **${highestIng.name}** custa R$ ${maxCost.toFixed(2)} por marmita. Tente negociar o valor do kg no fornecedor local ou balancear com carboidratos nutritivos como batata doce ou arroz integral.`;
      }
      return advice;
    }

    if (q.includes("ingrediente") || q.includes("impacta")) {
      if (marmitaData.ingredients.length === 0) {
        return `Adicione ingredientes à calculadora acima para que eu possa analisar qual tem o maior impacto no custo final!`;
      }
      const sorted = [...marmitaData.ingredients].sort((a, b) => ((b.pricePerKg / 1000) * b.grams) - ((a.pricePerKg / 1000) * a.grams));
      const top1 = sorted[0];
      const top1Cost = (top1.pricePerKg / 1000) * top1.grams;
      const top1Share = ((top1Cost / (ingredientsCostUnit || 1)) * 100).toFixed(0);

      return `📊 **Análise de Insumos:**\nO ingrediente que mais pesa no custo é o **${top1.name}**, custando **R$ ${top1Cost.toFixed(2)} por marmita** (representa **${top1Share}%** de todo o custo de insumos). Se você conseguir uma economia de 10% nesse item, seu lucro por lote sobe significativamente!`;
    }

    return `Entendi sua dúvida sobre "${question}". Com base nos dados da marmita "${marmitaData.name || 'Fit'}", seu custo direto é R$ ${totalCost.toFixed(2)}, seu preço de venda sugerido é R$ ${finalPrice.toFixed(2)} e seu lucro projetado por unidade é R$ ${profitUnit.toFixed(2)}. Recomendo acompanhar seus indicadores no gráfico de rosca acima para equilibrar custos de insumos e embalagem!`;
  };

  const handleAsk = (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    // User Message
    const userMsg = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = generateAIResponse(q);
      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Inteligência Artificial Integrada</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center space-x-2">
            <span>NutriPreço AI</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Tire dúvidas financeiras e receba consultoria de precificação em tempo real.
          </p>
        </div>

        {/* Chat Card Container */}
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xl overflow-hidden flex flex-col h-[500px]">
          
          {/* Chat Topbar */}
          <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">NutriPreço AI Assistant</h3>
                <span className="text-[11px] text-emerald-100 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping inline-block mr-1"></span>
                  <span>Analisando {marmitaData.name || 'Marmita Fit'} em tempo real</span>
                </span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-500 text-white font-medium rounded-br-none'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-bl-none text-xs text-slate-400 flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-emerald-500 animate-bounce" />
                  <span>NutriPreço AI está digitando...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Preset Buttons */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-2">
            {presetQuestions.map((preset, i) => (
              <button
                key={i}
                onClick={() => handleAsk(preset)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-950 hover:text-emerald-700 transition-all border border-slate-200 dark:border-slate-700 flex items-center space-x-1"
              >
                <Lightbulb className="w-3 h-3 text-orange-500" />
                <span>{preset}</span>
              </button>
            ))}
          </div>

          {/* Query Input */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700/60 flex items-center space-x-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Pergunte ao NutriPreço AI (ex: Qual margem de lucro usar?)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
            />
            <button
              onClick={() => handleAsk()}
              className="p-2.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
