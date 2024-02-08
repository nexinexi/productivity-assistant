import { Composer, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { NewExpenseSceneContext } from '@/modules/expense-tracker/scenes/new-expense';
import { parseInput } from '@/modules/expense-tracker/scenes/new-expense/helpers/parse-input';
import { vocabulary } from '@/modules/expense-tracker/vocabulary';
import { fmt } from 'telegraf/format';

const { incorrectDataFormat, enterExpense, selectCategory } = vocabulary;

export const validateExpenseStep = new Composer<NewExpenseSceneContext>();

validateExpenseStep.on(message('text'), async (ctx) => {
  const { title, amount } = parseInput(ctx.message.text);

  if (isNaN(amount) || !title) {
    return ctx.reply(fmt`${incorrectDataFormat}\n${enterExpense}`);
  }

  ctx.scene.session.newExpense = {
    title,
    amount,
  };

  const categories = new Set(
    ctx.session?.expenses.entries.map(
      (expense) => expense.properties.Category.select!.name,
    ),
  );

  await ctx.reply(
    selectCategory,
    Markup.keyboard([...categories], { columns: 3 })
      .oneTime()
      .resize(),
  );

  return ctx.wizard.next();
});
