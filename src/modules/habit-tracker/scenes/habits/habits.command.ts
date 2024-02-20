import { BotCommand } from 'telegraf/typings/core/types/typegram';

export const HABITS_SCENE_ID = 'habits';

export const habitsCommand: BotCommand = {
  command: HABITS_SCENE_ID,
  description: 'Habit Tracker',
};
