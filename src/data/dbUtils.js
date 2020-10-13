import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
// import io from  "socket.io-client" ; 

// console.log(io);
// let socket = io();
// socket.listen(3000);

// const DB_NAME = process.env.DB_NAME || 'gocta';
const PLACES_DESCRIPTION_TABLE = process.env.SITES_TABLE || 'sites';
const KML_TABLE = process.env.KML_TABLE || 'kml ';

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
  type: "kml_type"
}

export default {
  db: null,
  current_db_version: null,
  updateCallback: () => {},
  /**
   * @method
   * @description checks if the db exists and loads and opens the db file
   * @returns Promise
   */
  init: async function(updateCallback) {
    if (this.db) {
      return;
    }
    FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/goctaTest.db')
      .then(function(resp) {
        console.log('does the db exist?', resp.exists);
      });

    const callback = (function({ uri }) {
      const db = SQLite.openDatabase('goctaTest.db', 0.1);
      // https://forums.expo.io/t/how-to-connect-to-an-existing-database/6154
      console.log('db is at this uri', uri, db);
      this.db = db;

      this.checkForUpdate();

      return this;
    }).bind(this);

    return FileSystem.downloadAsync(
      Expo.Asset.fromModule(require('@assets/db/gocta_test.db')).uri,
      `${FileSystem.documentDirectory}SQLite/goctaTest.db`
      ).then(callback);
  },

  error: (err) => console.log(`received db error ${err}`),

  checkForUpdate: (function() {
   this.db.transaction(async function (tx) {
      await tx.executeSql(
        `PRAGMA user_version`,
        [], 
        (_tx, { rows }) => { 
          this.current_db_version = rows._array[0].user_version;
          console.log(this.current_db_version, rows);
        }, 
        (_tx, err) => {
          console.log(`error from check for update ${err}`); 
        });
      }, 
      this.error, 
      () => { console.log('check for update transaction completed'); })
    
    fetch(('http://192.168.0.105/get_db_version'))
      .then(async (resp) => {
        let remote_version = await resp.text();
        // could be that app_db_version isnt set yet
        if (parseInt(remote_version) >= this.current_db_version) {
          console.log("will proceed with download...");
          this.downloadUpdate();
        };
      })
      .catch((err) => { 
        console.log('error getting db version', err); 
      });
  }),

  downloadUpdate: function() {
    FileSystem.downloadAsync(
      'http://192.168.0.105/get_db',
      `${FileSystem.documentDirectory}SQLite/goctaTest_new.db`
      ).then(async ({ uri }) => {
        await FileSystem.moveAsync({ 
          from: `${FileSystem.documentDirectory}SQLite/goctaTest.db`,
          to: `${FileSystem.documentDirectory}SQLite/goctaTest.db.old`,
        });
        await FileSystem.moveAsync({ 
          from: `${FileSystem.documentDirectory}SQLite/goctaTest_new.db`,
          to: `${FileSystem.documentDirectory}SQLite/goctaTest.db`,
        });

        this.db = SQLite.openDatabase('goctaTest.db', 0.2);

        this.updateCallback();

        console.log('success update db is at this uri', uri, db);
      })
  },
  
  getAllKML: function(callback) {
    return this.db.transaction(async function (tx) {
      await tx.executeSql(
        `SELECT ${KML_FIELDS.filename}, ${KML_FIELDS.coordinates}, ${KML_FIELDS.type} from ${KML_TABLE}`,
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
      () => { console.log('transaction completed'); })
  },

  getAllPlaces: function(callback) {
    return this.db.transaction(async function(tx) {
      await tx.executeSql(
        `SELECT rowid, ${PLACE_FIELDS.title}, ${PLACE_FIELDS.title}, ${PLACE_FIELDS.description}, ${PLACE_FIELDS.filename}, ${PLACE_FIELDS.category} from ${PLACES_DESCRIPTION_TABLE}`,
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
      () => { console.log("transaction completed"); })
  },

  getDetailsForPlace: function(callback, id, language) {
    return this.db.transaction(async function(tx) {
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
