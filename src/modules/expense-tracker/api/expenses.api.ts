import { dayjs, notion } from '@/app';
import { Expense, NewExpense } from '@/modules/expense-tracker/types';
import { EnvService } from '@/app/config';
import {
  DatePropertyFilter,
  PropertyFilter,
} from '@/modules/expense-tracker/api/types';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import CC from 'currency-converter-lt';
import { DateHelper } from '@/app/helpers';

class ExpensesApi {
  public async getFilteredByDate(date: DatePropertyFilter): Promise<Expense[]> {
    return this.get({ property: 'Date', date });
  }

  public async getByThisAndLastMonths(): Promise<Expense[]> {
    const { start: lastMonthStart } = DateHelper.getLastMonthRange();

    return this.getFilteredByDate({ on_or_after: lastMonthStart });
  }

  public async create({
    title,
    amount,
    category,
  }: NewExpense): Promise<PageObjectResponse> {
    // todo: implement own solution for convert
    const currencyConverter = new CC({
      from: 'THB',
      to: 'USD',
      amount,
    });

    const convertedUSD = await currencyConverter.convert();
    const amountUSD = parseFloat(convertedUSD.toFixed(2));

    return (await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: EnvService.notionDataBaseId,
      },
      properties: {
        Expense: {
          title: [{ text: { content: title } }],
        },
        'Amount THB': {
          number: amount,
        },
        'Amount USD': {
          number: amountUSD,
        },
        Date: {
          date: {
            start: dayjs().toISOString(),
          },
        },
        Category: {
          select: {
            name: category,
          },
        },
      },
    })) as PageObjectResponse;
  }

  private async get(
    filter?: PropertyFilter,
    startCursor?: string,
  ): Promise<Expense[]> {
    const response = await notion.databases.query({
      database_id: EnvService.notionDataBaseId,
      start_cursor: startCursor,
      filter,
    });

    const results = response.results as unknown as Expense[];

    if (response.has_more && response.next_cursor) {
      results.push(...(await this.get(undefined, response.next_cursor)));
    }

    return results;
  }
}

export const expensesApi = new ExpensesApi();
