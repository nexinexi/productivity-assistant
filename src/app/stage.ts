import { Scenes } from 'telegraf';
import {
  expensesScene,
  initExpensesScene,
  newExpenseScene,
} from '@/modules/expense-tracker';
import { initTimezoneScene, timezoneScene } from '@/app/scenes';
import { habitsScene, initHabitsScene } from '@/modules/habit-tracker';

// todo: fix any
const stage = new Scenes.Stage<any>([
  expensesScene,
  newExpenseScene,
  habitsScene,
  timezoneScene,
]);

export default stage;

export const initScenes = () => {
  initExpensesScene();
  initHabitsScene();
  initTimezoneScene();
};
