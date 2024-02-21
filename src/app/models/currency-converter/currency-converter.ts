export interface CurrencyProvider {
  getExchangeRate(from: string, to: string): Promise<number>;
}

export class CurrencyConverter {
  constructor(private currencyProvider: CurrencyProvider) {}

  async convert(amount: number, from: string, to: string): Promise<number> {
    const exchangeRate = await this.currencyProvider.getExchangeRate(from, to);

    return amount * exchangeRate;
  }
}
