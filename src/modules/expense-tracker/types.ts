import {
  DatabaseObjectResponse,
  DatePropertyItemObjectResponse,
  NumberPropertyItemObjectResponse,
  SelectPropertyItemObjectResponse,
  TextRichTextItemResponse,
  TitlePropertyItemObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { Nullable } from '@/app/types';
import { Dayjs } from 'dayjs';

export interface ExpenseTrackerSession {
  entries: Expense[];
  updatedAt: Nullable<Dayjs>;
}

export interface ExpenseProperties {
  'Amount THB': NumberPropertyItemObjectResponse;
  'Amount USD': NumberPropertyItemObjectResponse;
  Category: SelectPropertyItemObjectResponse;
  Date: DatePropertyItemObjectResponse;
  Expense: Omit<TitlePropertyItemObjectResponse, 'title'> & {
    title: TextRichTextItemResponse[];
  };
}

export interface Expense extends Omit<DatabaseObjectResponse, 'properties'> {
  properties: ExpenseProperties;
}

export interface ExpensesAmount {
  usd: number;
  thb: number;
}

export type MostExpensiveCategory = [string, ExpensesAmount];

export interface ExpensesTotals {
  total: ExpensesAmount;
  categories: Record<string, ExpensesAmount>;
  topExpense: Expense;
}

export interface NewExpense {
  title: string;
  amount: number;
  category: string;
}
