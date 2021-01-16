import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
// const DB_NAME = process.env.DB_NAME || 'gocta';
const PLACES_DESCRIPTION_TABLE = process.env.SITES_TABLE || 'sites';
const KML_TABLE = process.env.KML_TABLE || 'kml ';

const ROW_ID = "rowid";

export const PLACE_FIELDS = {
  filename: "filename",
  title: "title",
  description: "description",
  category: "category"
}

const ES = {
  title: "title_ES",
  description: "description_ES",
}

export const PLACE_FIELDS_ES = { ...PLACE_FIELDS, ...ES };

export const KML_FIELDS = {
  filename: "filename",
  coordinates: "coordinates",
  type: "kml_type",
  id: "rowid"
}

const dbDir = FileSystem.documentDirectory + 'SQLite/';
const GOCTA_DB_FILENAME = "goctaTest.db";
/**
 * @description Checks if gif directory exists. If not, creates it
 */
export async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(dbDir);
  // console.log("dirinfo", dirInfo);
  if (!dirInfo.exists) {
    console.log('sqlite directory doesn\'t exist, creating...');
    await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
    return;
  }
  return true;
}

export default {
  db: null,
  current_db_version: null,
  onUpdateDbFromRemote: () => {},
  /**
   * @method
   * @description checks if the db exists and loads and opens the db file
   * @returns Promise
   */
  setDB: function(dbFile) {
    // https://forums.expo.io/t/how-to-connect-to-an-existing-database/6154
    this.db = SQLite.openDatabase(dbFile, 0.1);
  },

  init: async function(updateCallback) {
    if (this.db) {
      return;
    }

    this.onUpdateDbFromRemote = updateCallback;

    await ensureDirExists();

    return FileSystem.downloadAsync(
      Expo.Asset.fromModule(require('@assets/db/gocta.db')).uri, `${dbDir}/${GOCTA_DB_FILENAME}`)
      .then(() =>{
        this.setDB(GOCTA_DB_FILENAME);
        this.checkForUpdate();
      })
      .catch((err) => {
        console.log("error when downloading db");
      });
  },

  error: (err) => console.log(`received db error ${err}`),

  getCurrentDbVersion: function() {
    return new Promise((resolve, reject) => {
      if (this.current_db_version) {
        resolve(this.current_db_version);
        return;
      }
      this.db.transaction(function (tx) {
        tx.executeSql(
          `PRAGMA user_version`,
          [], 
          (_tx, { rows }) => { 
            this.current_db_version = rows._array[0].user_version;
            // console.log(this.current_db_version, rows);
            resolve(this.current_db_version);
          }, 
          (_tx, err) => {
            console.log(`error from check for update ${err}`); 
          });
        }, 
        () => { reject(err); }, 
        () => { console.log('check for update transaction completed');
      })
    });
  },

  checkForUpdate: async function() {
    const dbVersion = await this.getCurrentDbVersion();
    fetch('http://192.168.0.105/get_db_version')
      .then((resp) => resp.text())
      .then((remote_version) => {
        // could be that app_db_version isnt set yet
        // console.log('remote version is greater', remote_version, parseInt(remote_version) > dbVersion);
        if (parseInt(remote_version) > dbVersion) {
          console.log("will proceed with download...");
          this.downloadUpdate();
        }
      })
      .catch((err) => { 
        console.log('error getting db version', err); 
      });
  },

  downloadUpdate: function() {
    const remoteDBFilename = "goctaTest_tmp.db";
    return FileSystem.downloadAsync('http://192.168.0.105/get_db', `${dbDir}/${remoteDBFilename}`)
      .then(() =>
        FileSystem.moveAsync({ 
          from: `${dbDir}/${GOCTA_DB_FILENAME}`,
          to: `${dbDir}/goctaTest.db.prev`,
        })
      )
      .then(() =>
        FileSystem.moveAsync({ 
          from: `${dbDir}/${remoteDBFilename}`,
          to: `${dbDir}/${GOCTA_DB_FILENAME}`,
        })
      )
      .then(() => {
        this.setDB(GOCTA_DB_FILENAME);
        this.onUpdateDbFromRemote();
        // console.log('success update db is at this uri', uri, db);
      })
      .catch((err) => console.log(`moving async err ${err}`))
  },
  
  getAllKML: function(callback) {
    return this.db.transaction(async function (tx) {
      await tx.executeSql(
        `SELECT ${ROW_ID}, ${KML_FIELDS.filename}, ${KML_FIELDS.coordinates}, ${KML_FIELDS.type} from ${KML_TABLE} ORDER BY ${ROW_ID} DESC`,
        [], 
        (_tx, { rows }) => { 
          callback(rows._array);
          console.table(rows._array);
        }, 
        (_tx, err) => {
          console.log(`error from getAllKML ${err}`); 
        });
      }, 
      this.error, 
      () => { console.log('kml transaction completed'); })
  },

  // TODO JOIN
  getAllPlaces: function(callback) {
    return this.db.transaction(async function(tx) {
      await tx.executeSql(
        `SELECT ${ROW_ID}, ${PLACE_FIELDS.title}, ${PLACE_FIELDS.title}, ${PLACE_FIELDS.description}, ${PLACE_FIELDS.filename}, ${PLACE_FIELDS.category} from ${PLACES_DESCRIPTION_TABLE}`,
        [], 
        (_tx, { rows }) => { 
          // console.table(rows._array);
          callback(rows._array);
        }, 
        (_tx, err) => {
          console.log(`error from places sql ${err}`); 
        });
      }, 
      this.error, 
      () => { console.log("places transaction completed"); })
  },

  getDetailsForPlace: function(callback, id, language) {
    this.db.transaction(async function(tx) {
      await tx.executeSql(
        `SELECT ${PLACE_FIELDS.title}, ${PLACE_FIELDS.description} from ${PLACES_DESCRIPTION_TABLE} where rowid = ?`,
        [id], 
        (_tx, { rows }) => { 
          // console.table(rows._array);
          callback(rows._array[0]);
        },
        (_tx, err) => {
          console.log(`error from places sql ${err}`); 
        }
      ); 
    },
    this.error, 
    () => { console.log("transaction completed"); })
  }
}
