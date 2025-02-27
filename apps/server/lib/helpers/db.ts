import { Db, MongoClient } from 'mongodb';
import { log } from '@mhgo/utils';
import { Adventure } from '@mhgo/types';

const DB_AUTH = 'auth';

export class MongoInstance {
  public client: MongoClient;

  public dbAuth: Db;
  public adventureDbs: { [key: string]: Db } = {};

  constructor() {
    try {
      const url = process.env.DATABASE_URL;
      if (!url) {
        throw new Error('No database URL provided');
      }
      this.client = new MongoClient(url, { monitorCommands: true });

      this.dbAuth = this.client.db(DB_AUTH);
      this.populateAdventureDbs();
    } catch (error: any) {
      log.WARN(error);
      throw error;
    }
  }

  private async populateAdventureDbs() {
    const collectionAdventures =
      this.dbAuth.collection<Adventure>('adventures');
    const adventures = await collectionAdventures.find({}).toArray();
    adventures.forEach(adventure => {
      try {
        this.adventureDbs[adventure.id] = this.client.db(adventure.id);
      } catch (error) {
        log.WARN(error);
      }
    });
  }

  getDbAuth() {
    return { dbAuth: this.dbAuth };
  }

  getDb(adventure: string) {
    if (!adventure) throw new Error('Adventure not found');

    const dbAdventure: Db = this.adventureDbs[adventure];

    if (!dbAdventure) throw new Error('Adventure data not found');

    return { db: dbAdventure };
  }
}
