
import React from 'react';
import { formatCurrency } from '../utils/calculations';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface Props {
  bank: string;
  totalValue: number;
}

const FGC_LIMIT = 250000;

export const FGCCard: React.FC<Props> = ({ bank, totalValue }) => {
  const percentage = Math.min((totalValue / FGC_LIMIT) * 100, 100);
  const isOverLimit = totalValue > FGC_LIMIT;
  const isWarning = totalValue > FGC_LIMIT * 0.8 && !isOverLimit;

  let statusColor = "bg-emerald-500";
  let textColor = "text-emerald-600";
  let icon = <ShieldCheck className="w-5 h-5" />;

  if (isOverLimit) {
    statusColor = "bg-red-500";
    textColor = "text-red-600";
    icon = <ShieldAlert className="w-5 h-5" />;
  } else if (isWarning) {
    statusColor = "bg-amber-500";
    textColor = "text-amber-600";
    icon = <AlertTriangle className="w-5 h-5" />;
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-tight">Banco Emissor</h4>
          <p className="text-lg font-black text-slate-800">{bank}</p>
        </div>
        <div className={`p-2 rounded-lg ${statusColor} bg-opacity-10 ${textColor}`}>
          {icon}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs font-medium text-slate-500">Exposição Total (Valor Futuro)</p>
            <p className={`text-xl font-black ${isOverLimit ? 'text-red-600' : 'text-slate-800'}`}>
              {formatCurrency(totalValue)}
            </p>
          </div>
          <p className={`text-xs font-bold ${textColor}`}>
            {percentage.toFixed(1)}% do limite
          </p>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${statusColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
          <span>R$ 0</span>
          <span>Limite FGC: R$ 250k</span>
        </div>
      </div>
      
      {isOverLimit && (
        <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-red-700 leading-tight">
            <strong>Atenção:</strong> Este banco excedeu o limite de garantia do FGC. O excedente de {formatCurrency(totalValue - FGC_LIMIT)} não está coberto.
          </p>
        </div>
      )}
    </div>
  );
};
