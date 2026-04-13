// PMT function: calculate monthly payment
export function calcMonthlyPayment(principal: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export function fmtCurrency(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export function fmtNum(n: number): string {
  return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatBreakEven(months: number): string {
  if (months <= 0 || !isFinite(months)) return 'N/A';
  if (months > 360) return 'Not worth it (>30 yrs)';
  const yrs = Math.floor(months / 12);
  const mos = Math.round(months % 12);
  if (yrs === 0) return `${mos} months`;
  if (mos === 0) return `${yrs} years`;
  return `${yrs} yr ${mos} mo`;
}
