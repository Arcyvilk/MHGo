import { HabitatMarker, Setting } from '@mhgo/types';
import { Db } from 'mongodb';
import seedrandom from 'seedrandom';

const SETTING_SEED_GLOBAL_KEY = 'seed_global';
const SETTING_SEED_REFRESH_TIME = 'seed_refresh_time_in_minutes';
const SEED_INDEX_NAME = 'global_seed_timeout';

export const getGlobalSeed = async (db: Db) => {
  const collectionSettings = db.collection<Setting<number>>('settings');

  // Get the global server seed
  const globalSeed =
    (await collectionSettings.findOne({ key: SETTING_SEED_GLOBAL_KEY }))
      ?.value ?? 0;

  if (globalSeed) return globalSeed;
  else return generateGlobalSeed(db);
};

const generateGlobalSeed = async (db: Db) => {
  // Get the specified seed refresh time
  const collectionSettings = db.collection<Setting<number>>('settings');
  const seedRefreshTimeInMinutes =
    (
      await collectionSettings.findOne({
        key: SETTING_SEED_REFRESH_TIME,
      })
    )?.value ?? 0;
  const seedRefreshTimeInMiliseconds = seedRefreshTimeInMinutes * 60 * 1000;
  const refreshAt = new Date(Date.now() + seedRefreshTimeInMiliseconds);

  // Generate a new seed
  const newSeed = seedrandom().int32();
  const newGlobalSeed = {
    key: SETTING_SEED_GLOBAL_KEY,
    value: newSeed,
    refreshAt,
  };

  const response = await collectionSettings.insertOne(newGlobalSeed);

  if (!response.acknowledged)
    throw new Error('Could not generate a new global seed');

  try {
    await collectionSettings.dropIndex(SEED_INDEX_NAME, {});
  } catch (_e) {
    // If this failed, it meant the index didnt exist
  }
  await collectionSettings.createIndex(
    { refreshAt: 1 },
    {
      name: SEED_INDEX_NAME,
      expireAfterSeconds: 0, // This will expire document when it gets to the date specified in "dailyDate"
    },
  );
  return 0;
};

export const getMarkerSeed = async (
  habitatMarker: HabitatMarker,
  globalSeed: number,
) => {
  const markerId = String(habitatMarker._id);
  const strToSeed = `${markerId}${globalSeed}}`;

  const seed = seedrandom(strToSeed).int32();

  return seed;
};
