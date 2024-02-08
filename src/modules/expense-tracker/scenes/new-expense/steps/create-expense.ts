import { Composer } from 'telegraf';
import { message } from 'telegraf/filters';
import { NewExpenseSceneContext } from '@/modules/expense-tracker/scenes/new-expense';
import { vocabulary } from '@/modules/expense-tracker/vocabulary';
import { NewExpenseManager } from '@/modules/expense-tracker/scenes/new-expense/new-expense.manager';

export const createExpenseStep = new Composer<NewExpenseSceneContext>();

createExpenseStep.on(message('text'), async (ctx) => {
  const category = ctx.message.text;
  const { newExpense } = ctx.scene.session;
  const { enterExpense } = vocabulary;

  if (!newExpense) {
    await ctx.reply(enterExpense);

    return ctx.wizard.back();
  }

  await NewExpenseManager.create(ctx, {
    ...newExpense,
    category,
  });

  ctx.session.expenses.updatedAt = null;

  return ctx.wizard.back();
});
