export const formatUSD = (amount: number): string => `$${amount.toFixed(2)}`;

export const formatTHB = (amount: number): string => `${Math.round(amount)}฿`;
