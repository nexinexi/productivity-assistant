import { Scenes } from 'telegraf';
import { BotContext } from '@/app';
import { NewExpense } from '@/modules/expense-tracker/types';
import { validateExpenseStep } from '@/modules/expense-tracker/scenes/new-expense/steps/validate-expense';
import { createExpenseStep } from '@/modules/expense-tracker/scenes/new-expense/steps/create-expense';
import { EXPENSES_SCENE_ID } from '@/modules/expense-tracker/scenes/expenses/expenses.command';
import { NEW_EXPENSE_SCENE_ID } from '@/modules/expense-tracker/scenes/new-expense/new-expense.command';
import { TIMEZONE_SCENE_ID } from '@/app/scenes/timezone';

export interface NewExpenseSceneSession extends Scenes.WizardSessionData {
  newExpense?: Omit<NewExpense, 'category'>;
}

export type NewExpenseSceneContext = BotContext & {
  scene: Scenes.SceneContextScene<
    NewExpenseSceneContext,
    NewExpenseSceneSession
  >;
  wizard: Scenes.WizardContextWizard<NewExpenseSceneContext>;
};

const scene = new Scenes.WizardScene<NewExpenseSceneContext>(
  NEW_EXPENSE_SCENE_ID,
  validateExpenseStep,
  createExpenseStep,
);

scene.command(EXPENSES_SCENE_ID, (ctx) => ctx.scene.enter(EXPENSES_SCENE_ID));
scene.command(TIMEZONE_SCENE_ID, (ctx) => ctx.scene.enter(TIMEZONE_SCENE_ID));

export default scene;
