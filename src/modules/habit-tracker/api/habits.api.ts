import { dayjs, DbQueryFilter, NotionApi } from '@/app';
import { EnvService } from '@/app/config';
import { Habit, Habits, HabitsResponse } from '@/modules/habit-tracker/types';
import { Nullable } from '@/app/types';

class HabitsApi extends NotionApi {
  public async getToday(): Promise<Nullable<Habits>> {
    const today = dayjs().utc().format('YYYY-MM-DD');

    const [todayHabits] = await this.get<HabitsResponse>({
      timestamp: 'created_time',
      created_time: {
        equals: today,
      },
    });

    return todayHabits ? this.parseHabits(todayHabits) : null;
  }

  public async update(habit: Habit, pageId: string): Promise<boolean> {
    try {
      await this.notionClient.pages.update({
        page_id: pageId,
        properties: {
          [habit.title]: {
            checkbox: !habit.completed,
          },
        },
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  protected get<T>(filter?: DbQueryFilter, startCursor?: string): Promise<T[]> {
    return this.queryDatabase<T>(
      EnvService.notionHabitTrackerDatabaseId,
      filter,
      startCursor,
    );
  }

  private parseHabits(habits: HabitsResponse): Habits {
    const filteredHabits = Object.entries(habits.properties).filter(
      ([title]) => title !== 'Day' && title !== 'Created time',
    );

    return {
      date: habits.created_time,
      pageId: habits.id,
      entries: filteredHabits.map(([title, props]) => ({
        title,
        id: props.id,
        completed: props.checkbox,
      })),
    };
  }
}

export const habitsApi = new HabitsApi();
