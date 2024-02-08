import { bot } from '@/app';
import { expensesCommand } from '@/modules/expense-tracker/scenes/expenses/expenses.command';
import { timezoneCommand } from '@/app/scenes/timezone';

export async function initCommands() {
  await bot.telegram.setMyCommands([expensesCommand, timezoneCommand]);

  bot.command('start', (ctx) =>
    ctx.reply(
      "Hello! 👋 Welcome to personal assistant for expense tracking. I'm here to help you keep track of your expenses and do it conveniently and efficiently.\n" +
        '\n' +
        "Use the /expenses command to track your expenses. Inside the /expenses scene, you'll be able to add new expenses and manage them easily.\n" +
        '\n' +
        'I also have the /timezone command, which will help you set the desired time zone for a more convenient time display.\n' +
        '\n' +
        "Feel free to reach out to me if you have any questions or need assistance. Let's make managing expenses a smooth and enjoyable process together! 📊💰",
    ),
  );
}

export const initRandomMessagesHandler = () => {
  bot.on('message', (ctx) => {
    ctx.reply(
      "Sorry, I didn't understand that. Here are the available commands:\n" +
        '/expenses - Track your expenses.\n' +
        '/timezone - Set your time zone for a more convenient time display.\n' +
        '\n' +
        'Feel free to use any of these commands to interact with me.',
    );
  });
};
