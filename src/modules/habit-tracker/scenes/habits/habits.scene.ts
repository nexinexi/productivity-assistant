import { Scenes } from 'telegraf';
import { bot, BotContext } from '@/app';
import { HABITS_SCENE_ID } from './habits.command';
import { EXPENSES_SCENE_ID } from '@/modules/expense-tracker/scenes/expenses/expenses.command';
import { TIMEZONE_SCENE_ID } from '@/app/scenes/timezone';
import { HabitsManager } from '@/modules/habit-tracker/scenes/habits/habits.manager';

export interface HabitsSceneContext extends BotContext {
  scene: Scenes.SceneContextScene<HabitsSceneContext>;
}

const scene = new Scenes.BaseScene<HabitsSceneContext>(HABITS_SCENE_ID);

scene.enter(HabitsManager.handleToday);
scene.command(EXPENSES_SCENE_ID, (ctx) => ctx.scene.enter(EXPENSES_SCENE_ID));
scene.command(TIMEZONE_SCENE_ID, (ctx) => ctx.scene.enter(TIMEZONE_SCENE_ID));

scene.on('callback_query', HabitsManager.handleHabitUpdate);

export default scene;

export const initHabitsScene = () =>
  bot.command(HABITS_SCENE_ID, (ctx) => ctx.scene.enter(HABITS_SCENE_ID));
