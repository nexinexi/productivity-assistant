import { Scenes } from 'telegraf';
import {
  expensesScene,
  initExpensesScene,
  newExpenseScene,
} from '@/modules/expense-tracker';
import { habitsScene, initHabitsScene } from '@/modules/habit-tracker';
import { initTimezoneScene, timezoneScene } from '@/modules/timezone';

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
