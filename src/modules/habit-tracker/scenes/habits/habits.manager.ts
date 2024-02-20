import { HabitsSceneContext } from '@/modules/habit-tracker/scenes/habits/habits.scene';
import { habitsApi } from '@/modules/habit-tracker/api';
import { dayjs } from '@/app';
import { Nullable } from '@/app/types';
import { Habits } from '@/modules/habit-tracker/types';
import { DateHelper } from '@/app/helpers';
import { CallbackQuery } from '@telegraf/types';
import { getHabitsKeyboard } from '@/modules/habit-tracker/scenes/habits/keyboards/habits.keyboard';

export class HabitsManager {
  static async handleToday(ctx: HabitsSceneContext) {
    const habits = await HabitsManager.getTodayHabits(ctx);

    if (!habits) {
      return ctx.reply("You don't have any habits.");
    }

    const keyboard = getHabitsKeyboard(habits);
    const replyText = HabitsManager.getReplyMessageText(habits);

    return ctx.reply(replyText, keyboard);
  }

  static async handleHabitUpdate(ctx: HabitsSceneContext) {
    const habits = await HabitsManager.getTodayHabits(ctx);

    if (!habits) {
      return ctx.reply(
        "You don't have any habits. Please check your Notion database.",
      );
    }

    const habitId = (ctx.callbackQuery as CallbackQuery.DataQuery).data;
    const habitToUpdate = habits.entries.find((habit) => habit.id === habitId);

    if (!habitToUpdate) {
      await ctx.reply(
        'Looks like you want to renew an old habit. Unfortunately, this can only be done directly via the Notion database.',
      );
      await ctx.reply('Please take a look at available entry:');

      return HabitsManager.handleToday(ctx);
    }

    const isSuccess = await habitsApi.update(habitToUpdate, habits.pageId);

    if (isSuccess) {
      habitToUpdate.completed = !habitToUpdate.completed;

      const { reply_markup } = getHabitsKeyboard(habits);
      const replyText = HabitsManager.getReplyMessageText(habits);

      return ctx.editMessageText(replyText, { reply_markup });
    }

    return ctx.reply('An error occurred while trying to update the habit');
  }

  private static async getTodayHabits(
    ctx: HabitsSceneContext,
  ): Promise<Nullable<Habits>> {
    if (ctx.session.habits) {
      const outdated = dayjs(ctx.session.habits.date)
        .utc()
        .isBefore(dayjs().utc(), 'day');

      if (!outdated) {
        return ctx.session.habits;
      }
    }

    const habits = await habitsApi.getToday();

    if (habits) {
      ctx.session.habits = habits;
    }

    return habits;
  }

  private static getReplyMessageText(habits: Habits): string {
    const completedCount = habits.entries.filter(
      ({ completed }) => completed,
    ).length;
    const totalHabitsCount = habits.entries.length;

    const nextEntryTime = dayjs().utc().add(1, 'day').startOf('day');
    const diff = nextEntryTime.diff(dayjs().utc());
    const congratulationsEmoji =
      completedCount === totalHabitsCount ? ' 🎉🎉🎉' : '';

    return `${dayjs(habits.date).format(
      'MMM D, YYYY',
    )}. Completed ${completedCount} of ${totalHabitsCount}.${congratulationsEmoji}\nA new entry appears every day at 12:00 AM UTC (in ${DateHelper.formatMsToHM(
      diff,
    )}).`;
  }
}
