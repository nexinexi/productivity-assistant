import { ExpensesSceneContext } from './expenses.scene';
import { dayjs, formatToISO } from '@/app';
import { expensesApi } from '@/modules/expense-tracker/api';
import { Expense } from '@/modules/expense-tracker/types';
import { vocabulary } from '@/modules/expense-tracker/vocabulary';
import {
  backToMonthlyExpensesKb,
  monthlyExpensesKb,
} from '@/modules/expense-tracker/scenes/expenses/keyboards/monthly-expenses.keyboard';
import {
  getMostExpensiveCategory,
  getTotals,
} from '@/modules/expense-tracker/scenes/expenses/helpers/get-totals';
import { DateHelper } from '@/app/helpers';
import { getDate } from '@/modules/expense-tracker/helpers';
import {
  backToLastMonthExpensesKb,
  lastMonthExpensesKeyboard,
} from '@/modules/expense-tracker/scenes/expenses/keyboards/last-month-expenses.keyboard';
import { fmt, FmtString } from 'telegraf/format';

const {
  noExpensesThisMonth,
  totalSpendingByRange,
  mostExpensiveCategory,
  largestExpense,
  samePeriodLastMonth,
  noExpensesToday,
  expensesToday,
  purchase,
  noExpensesYesterday,
  expensesYesterday,
  noExpensesLastMonth,
  expensesLastMonth,
  lastUpdate,
} = vocabulary;

export class ExpensesManager {
  static async handleMonthly(ctx: ExpensesSceneContext, editMessage = false) {
    const expenses = await ExpensesManager.getThisMonthExpenses(ctx);

    if (!expenses.length) {
      return ctx.reply(noExpensesThisMonth, monthlyExpensesKb);
    }

    // current month calculations
    const { total, topExpense, categories } = getTotals(expenses);
    const [category, categoryTotal] = getMostExpensiveCategory(categories);
    const { currentMonthStart, currentMonthEnd } =
      DateHelper.getCurrentMonthRange('MMM D');

    // last month to same day calculations (if today is 12jan, we get expenses from 1feb to 12feb)
    const lastMonthExpenses =
      await ExpensesManager.getLastMonthToSameDayExpenses(ctx);
    const { total: lastMonthTotal } = getTotals(lastMonthExpenses);

    const totalSpendingText = totalSpendingByRange(
      currentMonthStart,
      currentMonthEnd,
      total,
    );
    const mostExpensiveCategoryText = mostExpensiveCategory(
      category,
      categoryTotal,
    );
    const largestExpenseText = largestExpense(topExpense);
    const samePeriodLastMonthText = lastMonthExpenses.length
      ? samePeriodLastMonth(lastMonthTotal)
      : '';

    const replyText = fmt`${totalSpendingText}\n${samePeriodLastMonthText}\n\n${mostExpensiveCategoryText}\n${largestExpenseText}\n\n${lastUpdate(
      dayjs(ctx.session.expenses?.updatedAt),
    )}`;

    return editMessage
      ? ctx.editMessageText(replyText, monthlyExpensesKb)
      : ctx.reply(replyText, monthlyExpensesKb);
  }

  static async handleMonthlyPurchases(ctx: ExpensesSceneContext) {
    const expenses = await ExpensesManager.getThisMonthExpenses(ctx);

    if (!expenses.length) {
      return ctx.editMessageText(noExpensesThisMonth, backToMonthlyExpensesKb);
    }

    const purchasesText = ExpensesManager.getPurchasesText(expenses);

    return ctx.editMessageText(purchasesText, backToMonthlyExpensesKb);
  }

  static async handleToday(ctx: ExpensesSceneContext) {
    const expenses = await ExpensesManager.getTodayExpenses(ctx);

    if (!expenses.length) {
      return ctx.editMessageText(noExpensesToday, backToMonthlyExpensesKb);
    }

    const { total } = getTotals(expenses);
    const expensesText = expensesToday(total);
    const purchasesText = ExpensesManager.getPurchasesText(expenses);
    const replyText = fmt`${expensesText}\n\n${purchasesText}`;

    return ctx.editMessageText(replyText, backToMonthlyExpensesKb);
  }

  static async handleYesterday(ctx: ExpensesSceneContext) {
    const expenses = await ExpensesManager.getYesterdayExpenses(ctx);

    if (!expenses.length) {
      return ctx.editMessageText(noExpensesYesterday, backToMonthlyExpensesKb);
    }

    const { total } = getTotals(expenses);
    const expensesText = expensesYesterday(total);
    const purchasesText = ExpensesManager.getPurchasesText(expenses);
    const replyText = fmt`${expensesText}\n\n${purchasesText}`;

    return ctx.editMessageText(replyText, backToMonthlyExpensesKb);
  }

  static async handleLastMonth(ctx: ExpensesSceneContext) {
    const expenses = await ExpensesManager.getLastMonthExpenses(ctx);

    if (!expenses.length) {
      return ctx.editMessageText(noExpensesLastMonth, backToMonthlyExpensesKb);
    }

    const { total } = getTotals(expenses);
    const expensesText = expensesLastMonth(total);

    return ctx.editMessageText(expensesText, lastMonthExpensesKeyboard);
  }

  static async handleLastMonthPurchases(ctx: ExpensesSceneContext) {
    const expenses = await ExpensesManager.getLastMonthExpenses(ctx);
    const purchasesText = ExpensesManager.getPurchasesText(expenses);

    // todo: handle more than 4096 characters
    return ctx.editMessageText(purchasesText, backToLastMonthExpensesKb);
  }

  private static getPurchasesText(expenses: Expense[]): FmtString {
    return fmt(expenses.map(purchase));
  }

  private static async getTodayExpenses(ctx: ExpensesSceneContext) {
    const expenses = await ExpensesManager.getExpenses(ctx);
    const today = dayjs();

    return expenses.filter((expense) => {
      const date = formatToISO(getDate(expense));

      return dayjs(date).isSame(today, 'day');
    });
  }

  private static async getYesterdayExpenses(ctx: ExpensesSceneContext) {
    const expenses = await ExpensesManager.getExpenses(ctx);
    const yesterday = dayjs().subtract(1, 'day');

    return expenses.filter((expense) => {
      const date = formatToISO(getDate(expense));

      return dayjs(date).isSame(yesterday, 'day');
    });
  }

  private static async getLastMonthExpenses(ctx: ExpensesSceneContext) {
    const expenses = await ExpensesManager.getExpenses(ctx);
    const lastMonth = dayjs().subtract(1, 'month');

    return expenses.filter((expense) => {
      const date = formatToISO(getDate(expense));

      return dayjs(date).isSame(lastMonth, 'month');
    });
  }

  private static async getThisMonthExpenses(
    ctx: ExpensesSceneContext,
  ): Promise<Expense[]> {
    const expenses = await ExpensesManager.getExpenses(ctx);

    return expenses.filter((expense) => {
      const date = formatToISO(getDate(expense));

      return dayjs(date).isSame(dayjs(), 'month');
    });
  }

  private static async getLastMonthToSameDayExpenses(
    ctx: ExpensesSceneContext,
  ): Promise<Expense[]> {
    const expenses = await this.getExpenses(ctx);
    const { start, end } = DateHelper.getLastMonthStartToSameDayRange();

    return expenses.filter(({ properties: { Date } }) =>
      dayjs(Date.date?.start).isBetween(start, end, null, '[]'),
    );
  }

  private static async getExpenses(
    ctx: ExpensesSceneContext,
  ): Promise<Expense[]> {
    const cachedExpenses = ctx.session.expenses;
    const oneHourAgo = dayjs().subtract(1, 'hour');
    const oneHourPassed = cachedExpenses?.updatedAt
      ? cachedExpenses.updatedAt.isBefore(oneHourAgo)
      : true;

    if (!cachedExpenses?.entries.length || oneHourPassed) {
      const expenses = await expensesApi.getByThisAndLastMonths();

      ctx.session.expenses = {
        entries: expenses,
        updatedAt: dayjs(),
      };

      return expenses;
    }

    return ctx.session.expenses?.entries || [];
  }
}
