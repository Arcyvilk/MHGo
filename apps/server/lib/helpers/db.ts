import { Db, MongoClient } from 'mongodb';
import { log } from '@mhgo/utils';

const DB_AUTH = 'auth';
const DB_MHGO = 'mhgo';
const DB_OUTDORIA = 'outdoria';

export class MongoInstance {
  public client: MongoClient;
  public db: Db;

  // TODO: Add support for multiple databases
  constructor() {
    try {
      const url = process.env.DB_NAME;
      if (!url) {
        throw new Error('No database URL provided');
      }
      this.client = new MongoClient(url);
      this.db = this.client.db(process.env.DB_NAME);
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
    const url = process.env.DB_NAME;
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
