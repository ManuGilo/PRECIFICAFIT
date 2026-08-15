import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { FileText, FileSpreadsheet, Download, Printer } from 'lucide-react';

export default function ExportReports({ marmitaData, selectedRegion }) {
  // Financial metrics for report
  const ingredientsCostUnit = marmitaData.ingredients.reduce((acc, item) => acc + ((item.pricePerKg / 1000) * item.grams), 0);
  const packagingCostUnit = (marmitaData.packagingCost || 0) + (marmitaData.labelCost || 0);
  const batchSize = Math.max(1, marmitaData.batchSize || 1);
  const operationalCostUnit = ((marmitaData.operationalBatchCost || 0) + (marmitaData.laborBatchCost || 0)) / batchSize;
  const deliveryCostUnit = marmitaData.hasDelivery
    ? ((marmitaData.deliveryKm || 0) * (marmitaData.deliveryCostPerKm || 0) + (marmitaData.deliveryFixedFee || 0))
    : 0;

  const totalCostUnit = ingredientsCostUnit + packagingCostUnit + operationalCostUnit + deliveryCostUnit;
  const profitMarginDecimal = (marmitaData.profitMargin || 0) / 100;
  const profitAmountUnit = totalCostUnit * profitMarginDecimal;
  let rawPrice = totalCostUnit + profitAmountUnit;

  const feePercent = (marmitaData.platformFeePercent || 0) / 100;
  if (feePercent > 0 && feePercent < 1) {
    rawPrice = rawPrice / (1 - feePercent);
  }

  const finalPrice = Number(rawPrice.toFixed(2));
  const profitUnit = Number((finalPrice - totalCostUnit).toFixed(2));
  const batchTotalProfit = Number((profitUnit * batchSize).toFixed(2));
  const batchTotalRevenue = Number((finalPrice * batchSize).toFixed(2));

  // Export PDF using jsPDF
  const exportPDF = async () => {
    const reportElement = document.getElementById('printable-report-area');
    if (!reportElement) return;

    try {
      const canvas = await html2canvas(reportElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`PrecificaFit_${(marmitaData.name || 'Marmita').replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Não foi possível gerar o PDF. Verifique se o navegador possui permissões ativas.');
    }
  };

  // Export Excel using XLSX
  const exportExcel = () => {
    const rows = [
      ["RELATÓRIO DE PRECIFICAÇÃO - PRECIFICAFIT"],
      ["Data", new Date().toLocaleDateString('pt-BR')],
      ["Região de Referência", selectedRegion],
      ["Nome da Marmita", marmitaData.name || 'Marmita Fit'],
      ["Volume Embalagem", marmitaData.volume],
      ["Rendimento do Lote", `${batchSize} unidades`],
      [],
      ["INGREDIENTES", "QUANTIDADE (g)", "PREÇO/KG (R$)", "CUSTO UNITÁRIO (R$)"],
      ...marmitaData.ingredients.map(ing => [
        ing.name,
        ing.grams,
        ing.pricePerKg.toFixed(2),
        ((ing.pricePerKg / 1000) * ing.grams).toFixed(2)
      ]),
      [],
      ["RESUMO FINANCEIRO UNITÁRIO", "VALOR (R$)"],
      ["Custo de Ingredientes", ingredientsCostUnit.toFixed(2)],
      ["Embalagens", packagingCostUnit.toFixed(2)],
      ["Operacional + Mão de Obra", operationalCostUnit.toFixed(2)],
      ["Taxa de Entrega", deliveryCostUnit.toFixed(2)],
      ["CUSTO TOTAL UNITÁRIO", totalCostUnit.toFixed(2)],
      [`MARGEM DE LUCRO APLICADA (${marmitaData.profitMargin}%)`, profitUnit.toFixed(2)],
      ["PREÇO FINAL RECOMENDADO", finalPrice.toFixed(2)],
      [],
      ["RESUMO DO LOTE", "VALOR (R$)"],
      ["Faturamento Bruto do Lote", batchTotalRevenue.toFixed(2)],
      ["Lucro Total Líquido do Lote", batchTotalProfit.toFixed(2)]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ficha Tecnica");
    XLSX.writeFile(workbook, `Ficha_Tecnica_${(marmitaData.name || 'Marmita').replace(/\s+/g, '_')}.xlsx`);
  };

  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Download className="w-6 h-6 text-emerald-500" />
              <span>Exportar Ficha Técnica & Relatórios</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Gere documentos profissionais com a formação de preço detalhada da sua marmita.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={exportPDF}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-md hover:bg-slate-800 transition-all flex items-center space-x-2"
            >
              <FileText className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>Baixar Relatório PDF</span>
            </button>

            <button
              onClick={exportExcel}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Baixar Planilha Excel</span>
            </button>
          </div>
        </div>

        {/* Printable Report Hidden Canvas View */}
        <div id="printable-report-area" className="p-8 bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h1 className="text-2xl font-black text-emerald-700">PrecificaFit - Ficha Técnica de Precificação</h1>
              <p className="text-xs text-slate-500">Formação de Preço para Alimentação Saudável • Região: {selectedRegion}</p>
            </div>
            <div className="text-right text-xs">
              <strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}<br/>
              <strong>Lote:</strong> {batchSize} unidades
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="block font-bold text-slate-500">NOME DA MARMITA</span>
              <strong className="text-sm font-extrabold text-slate-800">{marmitaData.name || 'Marmita Fit'}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="block font-bold text-slate-500">VOLUME DA EMBALAGEM</span>
              <strong className="text-sm font-extrabold text-slate-800">{marmitaData.volume}</strong>
            </div>
          </div>

          {/* Ingredients Table */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Ingredientes & Gramagens</h3>
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b">
                <tr>
                  <th className="p-2">Ingrediente</th>
                  <th className="p-2">Gramas</th>
                  <th className="p-2">Preço/kg</th>
                  <th className="p-2 text-right">Custo Unitário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marmitaData.ingredients.map((ing, i) => (
                  <tr key={i}>
                    <td className="p-2 font-medium">{ing.name}</td>
                    <td className="p-2">{ing.grams} g</td>
                    <td className="p-2">R$ {ing.pricePerKg.toFixed(2)}</td>
                    <td className="p-2 text-right font-bold">R$ {((ing.pricePerKg / 1000) * ing.grams).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border">
              <span className="text-[10px] text-slate-500 font-bold block">CUSTO TOTAL UNITÁRIO</span>
              <strong className="text-base text-slate-800 font-black">R$ {totalCostUnit.toFixed(2)}</strong>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-800 font-bold block">LUCRO PROJETADO ({marmitaData.profitMargin}%)</span>
              <strong className="text-base text-emerald-700 font-black">R$ {profitUnit.toFixed(2)}</strong>
            </div>

            <div className="p-3 bg-emerald-600 text-white rounded-xl">
              <span className="text-[10px] text-emerald-100 font-bold block">PREÇO RECOMENDADO</span>
              <strong className="text-lg font-black">R$ {finalPrice.toFixed(2)}</strong>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
