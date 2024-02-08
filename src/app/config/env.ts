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

  public static get notionDataBaseId(): string {
    return EnvService.getVariableIfExists('NOTION_EXPENSES_DATABASE_ID');
  }
}
