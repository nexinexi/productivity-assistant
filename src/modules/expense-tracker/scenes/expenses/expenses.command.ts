import { BotCommand } from 'telegraf/typings/core/types/typegram';

export const EXPENSES_SCENE_ID = 'expenses';

export const expensesCommand: BotCommand = {
  command: EXPENSES_SCENE_ID,
  description: 'Expenses Tracker',
};
