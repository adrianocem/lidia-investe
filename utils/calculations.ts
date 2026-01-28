
import { Investment, InvestmentType, MarketRates } from '../types';

export interface CalculationResult {
  gross: number;
  net: number;
}

export const calculateFutureValue = (
  investment: Partial<Investment>,
  marketRates: MarketRates
): CalculationResult => {
  const { amount, interestRate, dueDate, type, incomeTax } = investment;
  
  if (!amount || !interestRate || !dueDate || !type) return { gross: 0, net: 0 };

  const tax = (incomeTax || 0) / 100;
  const totalPrincipal = amount; // Quantidade desconsiderada no cálculo

  const today = new Date();
  const end = new Date(dueDate);
  const diffTime = Math.abs(end.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffYears = diffDays / 365;

  let annualYield = 0;

  switch (type) {
    case InvestmentType.PREFIXADO:
      annualYield = interestRate / 100;
      break;
    case InvestmentType.CDI:
      annualYield = (marketRates.cdi / 100) * (interestRate / 100);
      break;
    case InvestmentType.IPCA:
      const ipcaRate = marketRates.ipca / 100;
      const marginRate = interestRate / 100;
      annualYield = (1 + ipcaRate) * (1 + marginRate) - 1;
      break;
    default:
      annualYield = 0;
  }

  // FV Bruto = PV * (1 + r)^t
  const grossFV = totalPrincipal * Math.pow(1 + annualYield, diffYears);
  const profit = grossFV - totalPrincipal;
  
  // Retorno líquido: Principal + (Lucro * (1 - IR))
  const netFV = totalPrincipal + (profit > 0 ? profit * (1 - tax) : 0);

  return {
    gross: grossFV,
    net: netFV
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};
