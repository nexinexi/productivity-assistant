import { NewExpenseSceneContext } from '@/modules/expense-tracker/scenes/new-expense/new-expense.scene';
import { NewExpense } from '@/modules/expense-tracker/types';
import { Message } from '@telegraf/types';
import { expensesApi } from '@/modules/expense-tracker/api';
import { vocabulary } from '@/modules/expense-tracker/vocabulary';
import { Markup } from 'telegraf';

const { expenseCreated, viewInNotion, addingNewExpense } = vocabulary;

export class NewExpenseManager {
  static async create(
    ctx: NewExpenseSceneContext,
    data: NewExpense,
  ): Promise<Message.TextMessage> {
    const { message_id } = await ctx.reply(addingNewExpense, {
      reply_markup: { remove_keyboard: true },
    });

    const { url } = await expensesApi.create(data);

    await ctx.deleteMessage(message_id);

    return ctx.reply(
      expenseCreated,
      Markup.inlineKeyboard([Markup.button.url(viewInNotion, url)]),
    );
  }
}
