# GoctaLapp

Queremos construir un app que puede llevarte por
el terreno y dar informacion al usuario en sitio.
Por ejemplo, a cualquier punto, puede decirte informacion de puntos de interes que estan cerca.

Tambien el app tiene que ayudar los visitantes a ir al rio.

## Dev notes

El app esta construido con [Expo](https://docs.expo.io/) y React Native.  
Usamos [react-native-maps](https://github.com/react-native-community/react-native-maps) con Google.  

Para desraolla:  
Descargar el source, cd al directorio de repo y corre `yarn install` (o usa `npm`).  
Con `yarn start` corre este proceso y inicia el expo app.

Para debuggin, usa el console en google. Mas info: https://docs.expo.io/workflow/debugging/


### Data y Database

Estamos usando sqlite para el db.
https://sqlite.org/index.html
https://desktop.arcgis.com/en/arcmap/latest/manage-data/databases/spatially-enable-sqlilte.htm

Un db de sqllite esta incluido en el app.  
Tambien queremos la habilidad a importar mas puntos de data y descripciones, independente a reescribir y relanzar en app.  
Por eso necesitamos esrribir un endpoint API en el server para actualizar el db en el app si hay cambios.


El database se llama `gocta1`

#### Data models

#### Tables

kml
```
CREATE TABLE kml(filename varchar(50), title varchar(100), raw_kml varchar(10000), coordinates varchar(10000), spatial_data Geometry, kml_type varchar(30));
```

data2 (para descripcions y titles)
```
CREATE TABLE data2(kml_file varchar(50),  title varchar(100), description varchar(5000), type varchar(50));
```

Los tablas son relacionados con la columna kml_file y filename.  
https://www.sqlitetutorial.net/sqlite-inner-join/

```
SELECT a1, a2, b1, b2
FROM A
INNER JOIN B on B.f = A.f;
```

#### Comandos utils:

<img src="https://user-images.githubusercontent.com/92090/90290981-7af15480-de44-11ea-80a5-22e713e7f7ac.jpeg" width="200" />

### Scripts para importar data

#### KML

Importamos el data de kml con un script python.   
https://github.com/goctalab/goctalapp/blob/master/scripts/scripts/writeKMLtoDb.py

El script usa los valores de .env para decidir cual DB y cual table.

Los defaults son...

Lee un directorio de kml y saca el filename, title, raw_kml, coordinates, kml_type, y guarda en el db

Syntax:  
`./scripts/writeKMLtoDb.py DIRECTORY_WITH_KML`  
`./scripts/writeKMLtoDb.py DIRECTORY_WITH_KML --db=gocta_db` _Tambien puedes pasar un db_  

Example:  
`./scripts/writeKMLtoDb.py /Users/ivy/Projects/Gocta/GoctaLab\ locations/FROM_SERGIO/ `

```
 sqlite3
SQLite version 3.24.0 2018-06-04 14:10:15
Enter ".help" for usage hints.
Connected to a transient in-memory database.
Use ".open FILENAME" to reopen on a persistent database.
sqlite> .open gocta1
sqlite> .schema
CREATE TABLE data2(kml_file varchar(50),  title varchar(100), description varchar(5000), type varchar(50));
CREATE TABLE kml_data(kml_filename varchar(50), kml_geometry Geometry);
CREATE TABLE kml(filename varchar(50), title varchar(100), raw_kml varchar(10000), coordinates varchar(10000), spatial_data Geometry, kml_type varchar(30));
```

#### Data models:
#### Descripciones de puntos

Las descripciones y titulos va a vivir en un excel, no importa donde -
pero tiene que tener este estructura de columnas:  

```filename	| title_ES	| title	| description_ES	| description	| category``` 

para cargar cambios de data en el database:  

1. Descarga el data de spreadsheet en un formato csv
1. Corre el script para cargar el table con data de csv


`./scripts/importCSV.py PATH_TO_CSV`  

Ejemplo: 
`./scripts/importCSV.py ~/Downloads/gocta.csv `
___

_Antes:_  
En el principio importamos nuestra puntos de GPS con un proceso de node con este script y los puntos en un carpeta:  
https://github.com/goctalab/goctalapp/blob/master/scripts/writeKMLDataRequires.js 

para enumerar todos los puntos kml que estan en este dir:  
https://github.com/goctalab/goctalapp/tree/master/assets/kml  

---

#### Titulos y Descripciones de KML

Importamos el data de titulos y descriciones con un proceso usando csv.

1. LLena el spreadsheet con data
1. Exporta el spreadsheet como csv y descarga a tu compu
1. Corre `sqlite3` en el terminal
1. Borra la tabla anterior ```DROP TABLE IF EXISTS data2;```
1. Entra csv mode con `.mode csv`
1. `.import c:/sqlite/data.csv data2` (reemplazar el path actual)

https://www.sqlitetutorial.net/sqlite-import-csv/


### Otros ideas y preguntas

Quizas tambien podemos hacer un poco de juego con el app, secretos escondido o collecion de cosas como un concurso.
Podemos usar QR codes por sitios tambien.

Seguimos usando Google o vendor diferente o custom tiles para permitirnos mas resolution?  

### Otros recursos
https://www.pubnub.com/blog/realtime-geo-tracking-app-react-native/
https://docs.expo.io/versions/latest/sdk/map-view/

 


