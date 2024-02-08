import { bold, fmt, italic, underline } from 'telegraf/format';
import { Expense, ExpensesAmount } from '@/modules/expense-tracker/types';
import { formatTHB, formatUSD } from '@/app/helpers';
import { Dayjs } from 'dayjs';
import { getProperties } from '@/modules/expense-tracker/helpers';
import { dayjs, getTimeZone } from '@/app';
import { Nullable } from '@/app/types';

export const vocabulary = {
  goBack: '« Back',
  noExpensesThisMonth: 'This month there were no expenses.',
  noExpensesLastMonth: 'Last month there were no expenses.',
  noExpensesToday: 'Today there were no expenses.',
  noExpensesYesterday: 'Yesterday there were no expenses.',
  enterExpense: fmt`Enter the expense in the format: ${bold('title')} ${bold(
    'amount',
  )}`,
  expensesList: '📋 List of expenses',
  incorrectDataFormat: 'Incorrect data format.',
  selectCategory: 'Select a category or enter the category name.',
  today: 'Today',
  yesterday: 'Yesterday',
  lastMonth: 'Last Month',
  expenseCreated: 'Expense successfully added.',
  viewInNotion: 'View in Notion',
  addingNewExpense: '💸 Adding a new expense...',
  purchase(expense: Expense) {
    const { title, amount, date } = getProperties(expense);

    return fmt`${dayjs(date).format('MMM D')}, ${underline(
      title,
    )}. ${formatAmount(amount, true)}\n`;
  },
  expensesToday(amount: ExpensesAmount) {
    return fmt`Expenses for today: ${formatAmount(amount)}`;
  },
  expensesYesterday(amount: ExpensesAmount) {
    return fmt`Expenses for yesterday: ${formatAmount(amount)}`;
  },
  expensesLastMonth(amount: ExpensesAmount) {
    return fmt`Expenses for last month: ${formatAmount(amount)}`;
  },
  totalSpendingByRange(from: string, to: string, amount: ExpensesAmount) {
    return fmt`Total expenses from ${from} to ${to}: ${formatAmount(amount)}`;
  },
  samePeriodLastMonth(amount: ExpensesAmount) {
    return fmt`Same period last month: ${formatAmount(amount)}`;
  },
  mostExpensiveCategory(categoryName: string, amount: ExpensesAmount) {
    return fmt`Most expensive category is ${underline(
      categoryName,
    )}: ${formatAmount(amount)}`;
  },
  largestExpense(expense: Expense) {
    const { title, amount } = getProperties(expense);

    return fmt`Largest expense is ${underline(title)}: ${formatAmount(amount)}`;
  },
  lastUpdate(updatedAt?: Nullable<Dayjs>) {
    return italic`Last update: ${updatedAt?.format(
      'MMM D, h:mm A',
    )}. ${getTimeZone()}`;
  },
};

function formatAmount(amount: ExpensesAmount, hideUsd = false) {
  if (hideUsd) {
    return bold(formatTHB(amount.thb));
  }

  return bold(formatTHB(amount.thb), ` (${formatUSD(amount.usd)})`);
}
