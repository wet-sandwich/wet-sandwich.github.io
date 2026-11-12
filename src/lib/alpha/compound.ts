export interface CompoundInput {
  /** Starting deposit. */
  principal: number;
  /** Added at the end of each month. */
  monthlyContribution: number;
  years: number;
  /** Annual rate of return as a percentage, e.g. 7 for 7%. */
  annualRatePercent: number;
}

export interface YearRow {
  year: number;
  /** Starting deposit plus all contributions so far. */
  contributions: number;
  /** Growth earned so far. */
  interest: number;
  balance: number;
}

// Grow the balance month by month: apply that month's return, then add the
// contribution. The annual rate is split evenly across 12 months.
export function compoundGrowth(input: CompoundInput): YearRow[] {
  const { principal, monthlyContribution, years, annualRatePercent } = input;
  const monthlyRate = annualRatePercent / 100 / 12;
  const rows: YearRow[] = [];

  let balance = principal;
  let contributions = principal;

  for (let year = 1; year <= years; year++) {
    for (let month = 0; month < 12; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      contributions += monthlyContribution;
    }
    rows.push({ year, contributions, interest: balance - contributions, balance });
  }

  return rows;
}
