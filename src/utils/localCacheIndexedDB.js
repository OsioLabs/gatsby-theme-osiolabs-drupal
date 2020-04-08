import Dexie from 'dexie';

const DB_VERSION = 1;
const db = new Dexie('localCache');

db.version(DB_VERSION).stores({
  progressCache: 'entityId',
});

// Populate the database when it's created.
// https://dexie.org/docs/Dexie/Dexie.on.populate#ajax-populate-sample
db.on('ready', () => {
  console.log('initialize db');
  return db.progressCache.count(count => {
    if (count === 0) {
      return new Dexie.Promise((resolve, reject) => {
        // Get data from Drupal and massage into the correct format.
        // If no records are returned from Drupal, at least add one "blank"
        // record so that when the count operation is performed in the future
        // there's a record there and we dont' try and perform this initial
        // data sync again on every page load.
        const exampleData = [
          {
            entityId: '1',
          },
        ];

        // Resolve with good data;
        resolve(exampleData);

        // @todo: Query Drupal for a list of all the tutorials the current user has read.
        // and then use that to populate the cache.

        // Reject with bad data.
      }).then(data => {
        return db.progressCache.bulkAdd(data);
      });
    }

    return true;
  });
});

db.progressCache.hook('creating', (primaryKey, obj, transaction) => {
  // A new progress record is being added. Tell Drupal to add the flagging.
});

db.progressCache.hook('deleting', (primaryKey, obj, transaction) => {
  // An existing progress record is being deleted. Tell Drupal to remove the
  // flagging.
});

export default db;
