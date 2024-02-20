import { dayjs, NotionApi } from '@/app';
import { Expense, NewExpense } from '@/modules/expense-tracker/types';
import { EnvService } from '@/app/config';
import { DatePropertyFilter, PropertyFilter } from '@/app/models/notion';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import CC from 'currency-converter-lt';
import { DateHelper } from '@/app/helpers';

class ExpensesApi extends NotionApi {
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

    return (await this.notionClient.pages.create({
      parent: {
        type: 'database_id',
        database_id: EnvService.notionExpensesDataBaseId,
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

  protected async get<T>(
    filter?: PropertyFilter,
    startCursor?: string,
  ): Promise<T[]> {
    return this.queryDatabase<T>(
      EnvService.notionExpensesDataBaseId,
      filter,
      startCursor,
    );
  }
}

export const expensesApi = new ExpensesApi();
