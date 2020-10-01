import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
// import { AsyncStorage } from 'react-native';

const PLACES_DESCRIPTION_TABLE = "data2";
const KML_TABLE = "kml";

export default {
  db: null,
  /**
   * @method
   * @description checks if the db exists and loads and opens the db file
   * @returns Promise
   */
  init: function() {
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
      Expo.Asset.fromModule(require('@assets/db/gocta1.db')).uri,
      `${FileSystem.documentDirectory}SQLite/goctaTest.db`
      ).then(callback);
  },
  error: (err) => { console.log(`received db error ${err}`); },
  getAllKML: function(callback) {
    return this.db.transaction(async function (tx) {
      // console.log("executing sql");
      await tx.executeSql(
        `SELECT filename, coordinates, kml_type from ${KML_TABLE}`,
        [], 
        (_, { rows }) => { 
          callback(rows._array);
        }, 
        (err) => {
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
        `SELECT title, kml_file, type from ${PLACES_DESCRIPTION_TABLE}`,
        [], 
        (_, { rows }) => { 
          // console.log("success", rows.length);
          // console.table(rows._array);
          callback(rows._array);
        }, 
        (err) => {
          console.log(`error from places sql ${err}`); 
        });
      }, 
      this.error, 
      () => { console.log("transaction completed"); })
  }
}
