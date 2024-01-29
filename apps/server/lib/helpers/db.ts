import { Db, MongoClient } from 'mongodb';
import { log } from '@mhgo/utils';
import { Adventure } from '@mhgo/types';

const DB_AUTH = 'auth';
const DB_MHGO = 'mhgo';
const DB_OUTDORIA = 'outdoria';

export class MongoInstance {
  public client: MongoClient;

  public dbAuth: Db;
  public dbMhgo: Db;
  public dbOutdoria: Db;

  // TODO: Add support for multiple databases
  constructor() {
    try {
      const url = process.env.DATABASE_URL;
      if (!url) {
        throw new Error('No database URL provided');
      }
      this.client = new MongoClient(url);
      this.dbAuth = this.client.db(DB_AUTH);
      this.dbMhgo = this.client.db(DB_MHGO);
      this.dbOutdoria = this.client.db(DB_OUTDORIA);
    } catch (error: any) {
      log.WARN(error);
      throw error;
    }
  }

  getDb(adventure: Adventure) {
    let dbAdventure: Db;
    if (adventure === 'mhgo') dbAdventure = this.dbMhgo;
    if (adventure === 'outdoria') dbAdventure = this.dbOutdoria;
    return { dbAuth: this.dbAuth, db: dbAdventure };
  }
}
