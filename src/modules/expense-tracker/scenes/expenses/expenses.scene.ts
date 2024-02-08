import { Scenes } from 'telegraf';
import { bot, BotContext } from '@/app';
import { EXPENSES_SCENE_ID } from './expenses.command';
import { NEW_EXPENSE_SCENE_ID } from '@/modules/expense-tracker/scenes/new-expense/new-expense.command';
import { message } from 'telegraf/filters';
import { ExpensesManager } from '@/modules/expense-tracker/scenes/expenses/expenses.manager';
import {
  BACK_TO_MONTHLY_EXPENSES,
  EXPENSES_LAST_MONTH,
  EXPENSES_TODAY,
  EXPENSES_YESTERDAY,
  PURCHASES_LAST_MONTH,
  PURCHASES_THIS_MONTH,
} from '@/modules/expense-tracker/scenes/expenses/expenses.constants';
import { TIMEZONE_SCENE_ID } from '@/app/scenes/timezone';

export interface ExpensesSceneContext extends BotContext {
  scene: Scenes.SceneContextScene<ExpensesSceneContext>;
}

const scene = new Scenes.BaseScene<ExpensesSceneContext>(EXPENSES_SCENE_ID);

scene.enter((ctx) => ExpensesManager.handleMonthly(ctx));
scene.command(EXPENSES_SCENE_ID, (ctx) => ExpensesManager.handleMonthly(ctx));
scene.command(TIMEZONE_SCENE_ID, (ctx) => ctx.scene.enter(TIMEZONE_SCENE_ID));

scene.action(EXPENSES_TODAY, ExpensesManager.handleToday);
scene.action(EXPENSES_YESTERDAY, ExpensesManager.handleYesterday);
scene.action(EXPENSES_LAST_MONTH, ExpensesManager.handleLastMonth);
scene.action(PURCHASES_THIS_MONTH, ExpensesManager.handleMonthlyPurchases);
scene.action(PURCHASES_LAST_MONTH, ExpensesManager.handleLastMonthPurchases);
scene.action(BACK_TO_MONTHLY_EXPENSES, (ctx) =>
  ExpensesManager.handleMonthly(ctx, true),
);

scene.on(message('text'), (ctx) => ctx.scene.enter(NEW_EXPENSE_SCENE_ID));

export default scene;

export const initExpensesScene = () =>
  bot.command(EXPENSES_SCENE_ID, (ctx) => ctx.scene.enter(EXPENSES_SCENE_ID));
