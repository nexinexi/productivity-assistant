import {
  CheckboxPropertyItemObjectResponse,
  DatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export type HabitsSession = Habits;

export interface Habits {
  date: string;
  pageId: string;
  entries: Habit[];
}

export interface Habit {
  id: string;
  title: string;
  completed: boolean;
}

export type HabitsProperties = Record<
  string,
  CheckboxPropertyItemObjectResponse
>;

export interface HabitsResponse
  extends Omit<DatabaseObjectResponse, 'properties'> {
  properties: HabitsProperties;
}
