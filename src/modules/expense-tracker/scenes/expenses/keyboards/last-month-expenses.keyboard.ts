import { Markup } from 'telegraf';
import {
  EXPENSES_LAST_MONTH,
  PURCHASES_LAST_MONTH,
} from '@/modules/expense-tracker/scenes/expenses/expenses.constants';
import { vocabulary } from '@/modules/expense-tracker/vocabulary';
import { backToMonthlyBtn } from '@/modules/expense-tracker/scenes/expenses/keyboards/monthly-expenses.keyboard';

const { expensesList, goBack } = vocabulary;

export const lastMonthExpensesKeyboard = Markup.inlineKeyboard(
  [
    Markup.button.callback(expensesList, PURCHASES_LAST_MONTH),
    backToMonthlyBtn,
  ],
  { columns: 1 },
);

export const backToLastMonthExpensesKb = Markup.inlineKeyboard([
  Markup.button.callback(goBack, EXPENSES_LAST_MONTH),
]);
