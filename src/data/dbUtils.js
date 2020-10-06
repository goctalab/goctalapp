import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { AsyncStorage } from 'react-native';

// SQLite.openDatabase(
//   { name : "goctaTestDB", createFromLocation : '~db/gocta1'},
//   () => console.log("ok db"),
//   () => console.log("errors db"));
const DB_NAME = process.env.DB_NAME || 'gocta';
const PLACES_DESCRIPTION_TABLE = process.env.SITES_TABLE || 'sites';
const KML_TABLE = process.env.KML_TABLE || 'kml ';

export default {
  db: null,
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
      Expo.Asset.fromModule(require('@assets/db/gocta_test.db')).uri,
      `${FileSystem.documentDirectory}SQLite/goctaTest.db`
      ).then(callback);
  },
  error: (err) => { console.log(`received db error ${err}`); },
  getAllKML: function(callback) {
    //return new Promise(function(resolve, reject) {
     
      return this.db.transaction(function (tx) {
        // console.log("executing sql");
        tx.executeSql(
          `SELECT filename, coordinates, kml_type from ${KML_TABLE}`,
          [], 
          (tx, { rows }) => { 
            // console.log('success', rows.length);
            // console.table(rows._array);
            callback(rows._array);
          }, 
          function(err) {
            console.log(`some error ${err}`); 
          });
        }, 
        this.error, 
        () => { console.log('transaction completed'); })
    // })
  },
  getAllPlaces: function() {
    console.log("and places");
    // data2 has kml_file title description type
    // also make call to kkml to cross reference filename
    return this.db.transaction(function (tx) {
      tx.executeSql(
        `SELECT * from ${PLACES_DESCRIPTION_TABLE}`,
        [], 
        (tx, { rows }) => { 
          console.log("success", rows.length);
          console.table(rows._array);
          return rows._array;
        }, 
        function(err) {
          console.log(`some error ${err}`); 
        });
      }, 
      this.error, 
      () => { console.log("transaction completed"); })
  }
}
