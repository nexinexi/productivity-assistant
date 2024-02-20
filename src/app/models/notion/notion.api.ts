import { DbQueryFilter, Notion } from '@/app';
import { Client } from '@notionhq/client';

export abstract class NotionApi {
  protected notionClient: Client;

  constructor() {
    this.notionClient = Notion.getInstance();
  }

  protected abstract get<T>(
    filter?: DbQueryFilter,
    startCursor?: string,
  ): Promise<T[]>;

  protected async queryDatabase<T>(
    databaseId: string,
    filter?: DbQueryFilter,
    startCursor?: string,
  ): Promise<T[]> {
    const response = await this.notionClient.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
      filter,
    });

    const results = response.results as T[];

    if (response.has_more && response.next_cursor) {
      results.push(
        ...(await this.queryDatabase<T>(
          databaseId,
          filter,
          response.next_cursor,
        )),
      );
    }

    return results;
  }
}
