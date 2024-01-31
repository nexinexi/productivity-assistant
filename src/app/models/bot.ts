import { Context, Telegraf, Scenes } from 'telegraf';
import { EnvService } from '@/app/config';

export interface BotContext extends Context {
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
