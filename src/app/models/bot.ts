import { Context, Scenes, Telegraf } from 'telegraf';
import { EnvService } from '@/app/config';
import { ExpenseTrackerSession } from '@/modules/expense-tracker/types';
import { HabitsSession } from '@/modules/habit-tracker/types';

interface Session extends Scenes.WizardSession {
  expenses?: ExpenseTrackerSession;
  habits?: HabitsSession;
}

export interface BotContext extends Context {
  session: Session;
  scene: Scenes.SceneContextScene<BotContext>;
}

export type TelegrafBotType = Telegraf<BotContext>;

class TelegrafBot {
  private static instance: TelegrafBotType;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): TelegrafBotType {
    if (!TelegrafBot.instance) {
      TelegrafBot.instance = new Telegraf(EnvService.botToken);
    }

    return TelegrafBot.instance;
  }
}

export const bot = TelegrafBot.getInstance();
