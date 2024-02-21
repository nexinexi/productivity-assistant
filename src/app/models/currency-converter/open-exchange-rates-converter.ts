import { CurrencyProvider } from './currency-converter';
import { EnvService } from '@/app/config';

type Rates = Record<string, number>;

interface LatestRates {
  base: 'USD';
  disclaimer: string;
  license: string;
  rates: Rates;
  timestamp: number;
}

export class OpenExchangeRatesConverter implements CurrencyProvider {
  public async getExchangeRate(from: string, to: string): Promise<number> {
    const rates = await this.getLatestRates();

    if (from === 'USD') {
      return rates[to];
    }

    if (to === 'USD') {
      return 1 / rates[from];
    }

    return (1 / rates[from]) * rates[to];
  }

  /**
   * Retrieves the latest exchange rates from the Open Exchange Rates API.
   *
   * @returns {Promise<Rates>}
   *
   */
  public async getLatestRates(): Promise<Rates> {
    // todo: cache
    return fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${EnvService.openExchangeRatesAppId}`,
    )
      .then<LatestRates>((res) => res.json())
      .then((latestRates) => latestRates.rates);
  }
}
