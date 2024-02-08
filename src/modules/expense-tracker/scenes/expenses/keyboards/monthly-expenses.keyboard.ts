import { Markup } from 'telegraf';
import {
  BACK_TO_MONTHLY_EXPENSES,
  EXPENSES_LAST_MONTH,
  EXPENSES_TODAY,
  EXPENSES_YESTERDAY,
  PURCHASES_THIS_MONTH,
} from '../expenses.constants';
import { vocabulary } from '@/modules/expense-tracker/vocabulary';

const { expensesList, today, yesterday, lastMonth, goBack } = vocabulary;

export const monthlyExpensesKb = Markup.inlineKeyboard([
  [Markup.button.callback(expensesList, PURCHASES_THIS_MONTH)],
  [
    Markup.button.callback(today, EXPENSES_TODAY),
    Markup.button.callback(yesterday, EXPENSES_YESTERDAY),
    Markup.button.callback(lastMonth, EXPENSES_LAST_MONTH),
  ],
]);

export const backToMonthlyBtn = Markup.button.callback(
  goBack,
  BACK_TO_MONTHLY_EXPENSES,
);

export const backToMonthlyExpensesKb = Markup.inlineKeyboard([
  backToMonthlyBtn,
]);
