
import React, { useState, useEffect } from 'react';
import { Investment, InvestmentTitle, InvestmentType, MarketRates } from '../types';
import { calculateFutureValue, CalculationResult } from '../utils/calculations';
import { PlusCircle, Pencil, Info } from 'lucide-react';

interface Props {
  onAdd: (investment: Investment) => void;
  onUpdate: (investment: Investment) => void;
  marketRates: MarketRates;
  editingInvestment: Investment | null;
}

const MAJOR_BROKERS = [
  "XP Investimentos", "Rico", "Clear", "BTG Pactual", "NuInvest",
  "Inter Invest", "Ágora Investimentos", "Genial Investimentos",
  "Toro Investimentos", "Órama", "ModalMais", "Guide Investimentos",
  "Avenue", "Nomad", "Warren", "Banco Inter", "C6 Bank"
].sort();

const MAJOR_BANKS = [
  "Banco do Brasil", "Bradesco", "Itaú Unibanco", "Santander",
  "Caixa Econômica Federal", "Banco Inter", "BTG Pactual",
  "Banco Safra", "Banco Daycoval", "Banco Pan", "Banco BMG",
  "Banco ABC Brasil", "Banco Pine", "Banco Original",
  "Banco Modal", "Banco Master", "Banco XP", "C6 Bank",
  "NuBank", "Sofisa Direto", "Banco Bari", "Banco Agibank"
].sort();

export const InvestmentForm: React.FC<Props> = ({ onAdd, onUpdate, marketRates, editingInvestment }) => {
  const [formData, setFormData] = useState<Partial<Investment>>({
    broker: '',
    bank: '',
    title: InvestmentTitle.CDB,
    type: InvestmentType.CDI,
    amount: 0,
    quantity: 1,
    interestRate: 100,
    incomeTax: 15,
    dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [fvPreview, setFvPreview] = useState<CalculationResult>({ gross: 0, net: 0 });

  useEffect(() => {
    if (editingInvestment) {
      setFormData({
        ...editingInvestment,
        dueDate: new Date(editingInvestment.dueDate).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        broker: '',
        bank: '',
        title: InvestmentTitle.CDB,
        type: InvestmentType.CDI,
        amount: 0,
        quantity: 1,
        interestRate: 100,
        incomeTax: 15,
        dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
  }, [editingInvestment]);

  useEffect(() => {
    const results = calculateFutureValue(formData, marketRates);
    setFvPreview(results);
  }, [formData, marketRates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.broker || !formData.bank || !formData.amount) return;

    const investmentData: Investment = {
      ...(formData as Investment),
      id: editingInvestment ? editingInvestment.id : crypto.randomUUID(),
      futureValue: fvPreview.gross,
      netFutureValue: fvPreview.net,
      createdAt: editingInvestment ? editingInvestment.createdAt : Date.now(),
    };

    if (editingInvestment) {
      onUpdate(investmentData);
    } else {
      onAdd(investmentData);
    }

    setFormData({
      broker: '',
      bank: '',
      title: InvestmentTitle.CDB,
      type: InvestmentType.CDI,
      amount: 0,
      quantity: 1,
      interestRate: 100,
      incomeTax: 15,
      dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  const selectClass = "w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm appearance-none";
  const inputClass = "w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm";
  const labelClass = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h2 className="text-md font-bold text-slate-800 flex items-center gap-2">
          {editingInvestment ? (
            <Pencil className="w-5 h-5 text-amber-600" />
          ) : (
            <PlusCircle className="w-5 h-5 text-blue-600" />
          )}
          {editingInvestment ? 'Editar Ativo' : 'Adicionar Ativo'}
        </h2>
        {editingInvestment && (
          <button
            type="button"
            onClick={() => onUpdate(null as any)}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
          >
            Cancelar Edição
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div>
            <label className={labelClass}>Corretora</label>
            <div className="relative">
              <select
                required
                className={selectClass}
                value={formData.broker}
                onChange={e => setFormData({ ...formData, broker: e.target.value })}
              >
                <option value="" disabled>Selecione a corretora</option>
                {MAJOR_BROKERS.map(broker => <option key={broker} value={broker}>{broker}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Banco Emissor</label>
            <div className="relative">
              <select
                required
                className={selectClass}
                value={formData.bank}
                onChange={e => setFormData({ ...formData, bank: e.target.value })}
              >
                <option value="" disabled>Selecione o banco</option>
                {MAJOR_BANKS.map(bank => <option key={bank} value={bank}>{bank}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Título</label>
            <div className="relative">
              <select className={selectClass} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value as InvestmentTitle })}>
                {Object.values(InvestmentTitle).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Rentabilidade</label>
            <div className="relative">
              <select className={selectClass} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as InvestmentType })}>
                {Object.values(InvestmentType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Valor Aplicado (R$)</label>
            <input type="number" required step="0.01" className={inputClass} value={formData.amount || ''} onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })} />
          </div>

          <div>
            <label className={labelClass}>Quantidade (Informal)</label>
            <input type="number" required step="1" min="1" className={inputClass} value={formData.quantity || ''} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} />
          </div>

          <div>
            <label className={labelClass}>Taxa de Juros (%)</label>
            <div className="relative">
              <input type="number" required step="0.01" className={inputClass} value={formData.interestRate || ''} onChange={e => setFormData({ ...formData, interestRate: parseFloat(e.target.value) })} />
              <span className="absolute right-3 top-3 text-[10px] text-slate-400 bg-white pl-1 font-bold">
                {formData.type === InvestmentType.CDI ? '% CDI' : '% a.a.'}
              </span>
            </div>
          </div>

          <div>
            <label className={labelClass}>Vencimento</label>
            <input type="date" required className={inputClass} value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} />
          </div>

          <div>
            <label className={labelClass}>IR Estimado (%)</label>
            <div className="relative">
              <input type="number" required step="0.5" min="0" max="22.5" className={inputClass} value={formData.incomeTax || ''} onChange={e => setFormData({ ...formData, incomeTax: parseFloat(e.target.value) })} />
              <span className="absolute right-3 top-3 text-[10px] text-slate-400 bg-white pl-1 font-bold">% IR</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-5 bg-blue-50 rounded-2xl flex flex-col items-center justify-between border border-blue-100 gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Valor Líquido Futuro Estimado</p>
              <p className="text-2xl font-black text-blue-900 leading-none">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fvPreview.net)}
              </p>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full sm:w-auto px-8 py-3.5 ${editingInvestment ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold rounded-xl shadow-lg transition-all active:scale-95`}
          >
            {editingInvestment ? 'Salvar Alterações' : 'Confirmar Investimento'}
          </button>
        </div>
      </form>
    </div>
  );
};
