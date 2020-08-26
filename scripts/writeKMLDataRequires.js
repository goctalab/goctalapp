const fs = require('fs');

const outputFile = __dirname + '/../src/data/mapData_processed.js';

const KMLS_OBJECT = () => (fs.readdirSync(__dirname + '/../assets/kml').reduce((kmlsObj, filename) => {
  console.log(filename);
  if (filename === '.DS_Store') {
    return kmlsObj;
  }
  const fullFilename = `../../assets/kml/${filename}`;
  kmlsObj[fullFilename] = `require('${fullFilename}')`;
  // kmlsObj[filename] = require(__dirname + '/../assets/kml/' + filename);
  return kmlsObj;
}, {}));

const objectKmls = `export default KML_DATA = ${JSON.stringify(KMLS_OBJECT())}`;

const parseFile = (filename) => {
  fs.readFile(filename, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    let result = data.replace(/"require\(/g, 'require(');
    result = result.replace(/\)"/g, ')');

    fs.writeFile(filename, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
}

fs.writeFile(outputFile, objectKmls, (err) => {
  // throws an error, you could also catch it here
  if (err) throw err;

  // success case, the file was saved
  console.log('data run!');
  parseFile(outputFile);
});
