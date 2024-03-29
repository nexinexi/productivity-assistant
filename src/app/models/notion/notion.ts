import { Client } from '@notionhq/client';
import { EnvService } from '@/app/config';

export class Notion {
  private static instance: Client;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): Client {
    if (!Notion.instance) {
      Notion.instance = new Client({
        auth: EnvService.notionApiKey,
      });
    }

    return Notion.instance;
  }
}
