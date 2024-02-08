import { Context, Scenes, Telegraf } from 'telegraf';
import { EnvService } from '@/app/config';
import { ExpenseTrackerSession } from '@/modules/expense-tracker/types';

interface Session extends Scenes.WizardSession {
  expenses?: ExpenseTrackerSession;
}

export interface BotContext extends Context {
  session: Session;
  scene: Scenes.SceneContextScene<BotContext>;
}

export type TelegrafBotType = Telegraf<BotContext>;

class TelegrafBot {
  private static instance: TelegrafBotType;

  private constructor() {}

  public static getInstance(): TelegrafBotType {
    if (!TelegrafBot.instance) {
      TelegrafBot.instance = new Telegraf(EnvService.botToken);
    }

    return TelegrafBot.instance;
  }
}

export const bot = TelegrafBot.getInstance();
