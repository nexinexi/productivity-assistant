import { bot } from '@/app';
import { session } from 'telegraf';
import stage from '@/app/stage';
import { botOwnerMiddleware } from '@/app/middlewares/bot-owner.middleware';

export const initMiddlewares = () => {
  bot.use(botOwnerMiddleware());
  bot.use(session());
  bot.use(stage.middleware());
};
