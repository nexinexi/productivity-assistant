import 'dotenv/config';
import {
  bot,
  initCommands,
  initMiddlewares,
  initRandomMessagesHandler,
  initScenes,
  setTimeZone,
} from '@/app';

setTimeZone();

async function init(): Promise<void> {
  await initCommands();

  initMiddlewares();
  initScenes();
  initRandomMessagesHandler();

  bot.launch({ dropPendingUpdates: true });
}

init();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
