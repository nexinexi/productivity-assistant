import { Habits } from '@/modules/habit-tracker/types';
import { Markup } from 'telegraf';

export const getHabitsKeyboard = (habits: Habits) => {
  return Markup.inlineKeyboard(
    habits.entries.map(({ completed, title, id }) =>
      Markup.button.callback(completed ? title + ' ✅' : title, id),
    ),
    { columns: 1 },
  );
};
