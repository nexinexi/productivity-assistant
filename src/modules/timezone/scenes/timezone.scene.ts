import { BotCommand } from 'telegraf/typings/core/types/typegram';
import { bot, BotContext, dayjs, getTimeZone, setTimeZone } from '@/app';
import { Composer, Markup, Scenes } from 'telegraf';
import { code, fmt, italic, join } from 'telegraf/format';
import { message } from 'telegraf/filters';
import { EXPENSES_SCENE_ID } from '@/modules/expense-tracker/scenes/expenses/expenses.command';
import { HABITS_SCENE_ID } from '@/modules/habit-tracker/scenes/habits/habits.command';

export const TIMEZONE_SCENE_ID = 'timezone';

export const timezoneCommand: BotCommand = {
  command: TIMEZONE_SCENE_ID,
  description: 'Set your timezone',
};

export type TimezoneSceneContext = BotContext & {
  scene: Scenes.SceneContextScene<
    TimezoneSceneContext,
    Scenes.WizardSessionData
  >;
  wizard: Scenes.WizardContextWizard<TimezoneSceneContext>;
};

const setTimezoneStep = new Composer<TimezoneSceneContext>();
const timezoneSuggestions = join(
  [
    code('Europe/Moscow'),
    code('Europe/London'),
    code('Europe/Berlin'),
    code('America/New_York'),
    code('America/Los_Angeles'),
    code('America/Chicago'),
    code('Asia/Tokyo'),
    code('Asia/Bangkok'),
    code('Asia/Dubai'),
    code('Australia/Sydney'),
  ],
  '\n',
);
setTimezoneStep.on(message('text'), async (ctx) => {
  const { text: timezone } = ctx.message;
  const supportedValues = Intl.supportedValuesOf('timeZone');

  if (!supportedValues.includes(timezone)) {
    return ctx.reply('Unsupported value.');
  }

  setTimeZone(timezone);

  const localTime = italic`Local time: ${dayjs().format(
    'ddd, MMM D, YYYY h:mm A',
  )}`;

  await ctx.reply(fmt`Timezone successfully set.\n${localTime}`);

  return ctx.scene.leave();
});

const scene = new Scenes.WizardScene<TimezoneSceneContext>(
  TIMEZONE_SCENE_ID,
  async (ctx) => {
    await ctx.reply(
      fmt`Current timezone: ${code(
        getTimeZone(),
      )}.\nEnter timezone to change.\n\n${italic(
        'Suggestions (click to copy):',
      )}\n${fmt(timezoneSuggestions)}`,
      Markup.inlineKeyboard([
        Markup.button.url(
          'View timezones',
          'https://en.wikipedia.org/wiki/List_of_tz_database_time_zones',
        ),
      ]),
    );

    return ctx.wizard.next();
  },
  setTimezoneStep,
);

export default scene;

scene.command(EXPENSES_SCENE_ID, (ctx) => ctx.scene.enter(EXPENSES_SCENE_ID));
scene.command(HABITS_SCENE_ID, (ctx) => ctx.scene.enter(HABITS_SCENE_ID));

export const initTimezoneScene = () =>
  bot.command(TIMEZONE_SCENE_ID, (ctx) => ctx.scene.enter(TIMEZONE_SCENE_ID));
