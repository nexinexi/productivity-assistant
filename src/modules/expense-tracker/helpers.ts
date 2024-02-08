// TODO: actually, better way is to parse response instead of using helpers for every prop. leave as it is for mvp
import { Expense, ExpensesAmount } from '@/modules/expense-tracker/types';

export const getTitle = (expense: Expense): string => {
  return expense.properties.Expense.title[0].text.content;
};

export const getAmount = (expense: Expense): ExpensesAmount => {
  return {
    thb: expense.properties['Amount THB'].number || 0,
    usd: expense.properties['Amount USD'].number || 0,
  };
};

export const getDate = (expense: Expense): string => {
  return expense.properties.Date.date?.start || '';
};

export const getProperties = (
  expense: Expense,
): { date: string; amount: ExpensesAmount; title: string } => {
  return {
    title: getTitle(expense),
    amount: getAmount(expense),
    date: getDate(expense),
  };
};
