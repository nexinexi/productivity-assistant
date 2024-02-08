import { BotContext } from '@/app';
import { EnvService } from '@/app/config';

export const botOwnerMiddleware = () => {
  return (ctx: BotContext, next: () => Promise<void>) => {
    if (ctx.from?.id !== EnvService.botOwnerId) {
      return ctx.reply('Access denied.');
    }

    return next();
  };
};
