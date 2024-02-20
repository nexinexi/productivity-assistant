import { bot } from '@/app';
import { expensesCommand } from '@/modules/expense-tracker/scenes/expenses/expenses.command';
import { timezoneCommand } from '@/app/scenes/timezone';
import { habitsCommand } from '@/modules/habit-tracker/scenes/habits/habits.command';

export async function initCommands() {
  await bot.telegram.setMyCommands([
    expensesCommand,
    habitsCommand,
    timezoneCommand,
  ]);

  bot.command('start', (ctx) =>
    ctx.reply(
      "Hello! 👋 Welcome to your personal assistant for expense tracking and habits management. I'm here to help you keep track of your expenses, cultivate positive habits, and do it conveniently and efficiently.\n" +
        '\n' +
        "Use the /expenses command to track your expenses. Inside the expenses scene, you'll be able to add new expenses and manage them easily. Additionally, you can use the /habits command to track your habits and work towards your goals.\n" +
        '\n' +
        'I also have the /timezone command, which will help you set the desired time zone for a more convenient time display.\n' +
        '\n' +
        "Feel free to reach out to me if you have any questions or need assistance. Let's make managing expenses and habits a smooth and enjoyable process together! 📊💰",
    ),
  );
}

export const initRandomMessagesHandler = () => {
  bot.on('message', (ctx) => {
    ctx.reply(
      "Sorry, I didn't understand that. Here are the available commands:\n\n" +
        '/expenses - Track your expenses.\n' +
        '/habits - Track your habits.\n' +
        '/timezone - Set your time zone for a more convenient time display.\n' +
        '\n' +
        'Feel free to use any of these commands to interact with me.',
    );
  });
};
