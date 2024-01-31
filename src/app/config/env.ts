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

  public static get notionApiKey(): string {
    return EnvService.getVariableIfExists('NOTION_API_KEY');
  }
}
