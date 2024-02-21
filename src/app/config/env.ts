export class EnvService {
  private static getVariableIfExists(variable: string): string {
    if (!process.env[variable]) {
      throw new Error(`Required env variable ${variable} not found.`);
    }

    return process.env[variable] as string;
  }

  public static get botToken(): string {
    return EnvService.getVariableIfExists('BOT_TOKEN');
  }

  public static get botOwnerId(): number {
    return +EnvService.getVariableIfExists('BOT_OWNER_ID');
  }

  public static get notionApiKey(): string {
    return EnvService.getVariableIfExists('NOTION_API_KEY');
  }

  public static get notionExpensesDataBaseId(): string {
    return EnvService.getVariableIfExists('NOTION_EXPENSES_DATABASE_ID');
  }

  public static get notionHabitTrackerDatabaseId(): string {
    return EnvService.getVariableIfExists('NOTION_HABIT_TRACKER_DATABASE_ID');
  }

  public static get openExchangeRatesAppId(): string {
    return EnvService.getVariableIfExists('OPEN_EXCHANGE_RATES_APP_ID');
  }
}
