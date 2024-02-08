import { Scenes } from 'telegraf';
import {
  expensesScene,
  initExpensesScene,
  newExpenseScene,
} from '@/modules/expense-tracker';
import { initTimezoneScene, timezoneScene } from '@/app/scenes';

// todo: fix any
const stage = new Scenes.Stage<any>([
  expensesScene,
  newExpenseScene,
  timezoneScene,
]);

export default stage;

export const initScenes = () => {
  initExpensesScene();
  initTimezoneScene();
};
