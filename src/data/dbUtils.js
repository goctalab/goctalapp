import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

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
  /**
   * @method
   * @description checks if the db exists and loads and opens the db file
   * @returns Promise
   */
  init: async function() {
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
      // const db = SQLite.openDatabase(uri, 0.1);
      console.log('db is at this uri', uri, db);
      this.db = db;
      return this;
    }).bind(this);

    return FileSystem.downloadAsync(
      Expo.Asset.fromModule(require('@assets/db/gocta_test.db')).uri,
      `${FileSystem.documentDirectory}SQLite/goctaTest.db`
      ).then(callback);
  },

  error: (err) => console.log(`received db error ${err}`),

  getAllKML: function(callback) {
    return this.db.transaction(async function (tx) {
      // console.log("executing sql");
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
    // data2 has kml_file title description type
    // also make call to kml to cross reference filename
    return this.db.transaction(async function(tx) {
      await tx.executeSql(
        `SELECT rowid, ${PLACE_FIELDS.title}, ${PLACE_FIELDS.title}, ${PLACE_FIELDS.description}, ${PLACE_FIELDS.filename}, ${PLACE_FIELDS.category} from ${PLACES_DESCRIPTION_TABLE}`,
        [], 
        (_tx, { rows }) => { 
          // console.log("success", rows.length);
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
          // console.log("success", rows.length);
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
