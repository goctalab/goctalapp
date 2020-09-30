# GoctaLapp

Queremos construir un app que puede llevarte alrededor 
el terreño y dar informacion al usuario en sitio.

Por ejemplo, a cualquier punto, puede decirte informacion de puntos de interes que estan cerca.

Quizas tambien podemos hacer un poco de juego con el app, secretos escondido o collecion de cosas como un concurso.
Podemos usar QR codes por sitios tambien.

## Dev notes

Vamos a construir con [Expo](https://docs.expo.io/) y React Native.  
Usamos [react-native-maps](https://github.com/react-native-community/react-native-maps) con Google.  

Descargar el source, corre `yarn install` y con `yarn start` corre este proceso y inicia el expo app.

Importamos el data de kml con scripts. 
Quieremos la habilidad a importar mas puntos de data y descripciones, independente a reescribir y redeplegar en app.

### scripts

En el principio importamos nuestra puntos de GPS con un proceso de node con este script y los puntos en un carpeta:  
https://github.com/goctalab/goctalapp/blob/master/scripts/writeKMLDataRequires.js 

para enumerar todos los puntos kml que estan en este dir:  
https://github.com/goctalab/goctalapp/tree/master/assets/kml  

---

Ahora tenemos el kml en un db (mas de esto abajo)

__Para importar kml en el db:__

https://github.com/goctalab/goctalapp/blob/master/scripts/scripts/writeKMLtoDb.py

lee un directorio de kml y saca el filename, title, raw_kml, coordinates, kml_type, y guarda en el db

(usas './assets/kml'; necesitamos cambiar el script para cualquier dir.
agregar o limpiar...)


### data y db
Data models:

Tables:

Comandos utils:

<img src="https://user-images.githubusercontent.com/92090/90290981-7af15480-de44-11ea-80a5-22e713e7f7ac.jpeg" width="200" />

### Otros recursos por ahora
https://www.pubnub.com/blog/realtime-geo-tracking-app-react-native/
https://docs.expo.io/versions/latest/sdk/map-view/
https://docs.expo.io/workflow/debugging/

### Preguntas
Seguimos usando Google o vendor diferente o custom tiles para permitirnos mas resolution?  
Implementamos QR codes?  


