import { Db, MongoClient } from 'mongodb';
import { log } from '@mhgo/utils';

const BASE_DB_NAME = 'mhgo';

export class MongoInstance {
  public client: MongoClient;
  public db: Db;

  constructor() {
    try {
      const url = process.env.DATABASE_URL;
      if (!url) {
        throw new Error('No database URL provided');
      }
      this.client = new MongoClient(url);
      this.db = this.client.db(
        process.env.ENV === 'dev' ? `${BASE_DB_NAME}` : BASE_DB_NAME,
      );
    } catch (error: any) {
      log.WARN(error);
      throw error;
    }
  }

  getDb() {
    return { db: this.db };
  }
}

export const connectToDb = async (): Promise<{
  client: MongoClient;
  db: Db;
}> => {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('No database URL provided');
    }
    const client = new MongoClient(url);
    return {
      client,
      db: client.db(process.env.DB_NAME),
    };
  } catch (error: any) {
    log.WARN(error);
    throw error;
  }
};
