import {
  Expense,
  ExpensesTotals,
  MostExpensiveCategory,
} from '@/modules/expense-tracker/types';
import { getAmount } from '@/modules/expense-tracker/helpers';

export const getTotals = (expenses: Expense[]): ExpensesTotals => {
  const totalsInitialState: ExpensesTotals = {
    total: {
      thb: 0,
      usd: 0,
    },
    categories: {},
    topExpense: {} as Expense,
  };

  return expenses.reduce<ExpensesTotals>((acc, expense) => {
    const { thb, usd } = getAmount(expense);

    acc.total.thb += thb;
    acc.total.usd += usd;

    const category = expense.properties.Category;

    if (!category.select) {
      return acc;
    }

    if (!Object.hasOwn(acc.categories, category.select.name)) {
      acc.categories[category.select.name] = { usd: 0, thb: 0 };
    }

    acc.categories[category.select.name].thb += thb;
    acc.categories[category.select.name].usd += usd;

    const topExpenseAmountTHB =
      acc.topExpense?.properties?.['Amount THB'].number || 0;

    if (thb > topExpenseAmountTHB) {
      acc.topExpense = expense;
    }

    return acc;
  }, totalsInitialState);
};

export const getMostExpensiveCategory = (
  categories: ExpensesTotals['categories'],
): MostExpensiveCategory => {
  const categoryEntries = Object.entries(categories);

  return categoryEntries.reduce((maxCategory, currentCategory) => {
    const [, maxAmount] = maxCategory;
    const [, currentAmount] = currentCategory;

    return maxAmount.thb > currentAmount.thb ? maxCategory : currentCategory;
  });
};
