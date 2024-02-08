import { BotCommand } from 'telegraf/typings/core/types/typegram';
import { bot, BotContext, dayjs, getTimeZone, setTimeZone } from '@/app';
import { Composer, Markup, Scenes } from 'telegraf';
import { bold, fmt } from 'telegraf/format';
import { message } from 'telegraf/filters';
import { EXPENSES_SCENE_ID } from '@/modules/expense-tracker/scenes/expenses/expenses.command';

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

setTimezoneStep.on(message('text'), async (ctx) => {
  const { text: timezone } = ctx.message;
  const supportedValues = Intl.supportedValuesOf('timeZone');

  if (!supportedValues.includes(timezone)) {
    return ctx.reply('Unsupported value.');
  }

  setTimeZone(timezone);

  if (ctx.session.expenses?.updatedAt) {
    // update timezone of stored last update time
    ctx.session.expenses.updatedAt = dayjs(ctx.session.expenses.updatedAt);
  }

  await ctx.reply('Timezone successfully set.');

  return ctx.scene.leave();
});

const scene = new Scenes.WizardScene<TimezoneSceneContext>(
  TIMEZONE_SCENE_ID,
  async (ctx) => {
    await ctx.reply(
      fmt`Current timezone: ${bold(getTimeZone())}.\nEnter timezone to change.`,
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

export const initTimezoneScene = () =>
  bot.command(TIMEZONE_SCENE_ID, (ctx) => ctx.scene.enter(TIMEZONE_SCENE_ID));
