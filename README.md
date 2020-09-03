# GoctaLapp

Queremos construir un app que puede llevarte alrededor 
el terreño y dar informacion al usuario en sitio.

Por ejemplo, a cualquier punto, puede decirte informacion de puntos de interes que estan cerca.

Quizas tambien podemos hacer un poco de juego con el app, secretos escondido o collecion de cosas como un concurso.
Podemos usar QR codes por sitios tambien.


## dev

Vamos a construir con [Expo](https://docs.expo.io/) y React Native.

Ahora vamos a ver como implementar un map basico.

Usamos [react-native-maps](https://github.com/react-native-community/react-native-maps) por ahora con Google.
Puede ser que el Zoom level no es suficiente.


Ahora importamos nuestra puntos de GPS con un proceso de node con este script:
https://github.com/goctalab/goctalapp/blob/master/scripts/writeKMLDataRequires.js  

para enumerar todos los puntos kml que estan en este dir:  
https://github.com/goctalab/goctalapp/tree/master/assets/kml  

con `yarn start` corre este proceso y inicia el expo app.

<img src="https://user-images.githubusercontent.com/92090/90290981-7af15480-de44-11ea-80a5-22e713e7f7ac.jpeg" width="200" />

## database

https://sqlite.org/index.html
https://desktop.arcgis.com/en/arcmap/latest/manage-data/databases/spatially-enable-sqlilte.htm
https://nozbe.github.io/WatermelonDB/Advanced/Sync.html

### Otros recursos por ahora
https://www.pubnub.com/blog/realtime-geo-tracking-app-react-native/
https://docs.expo.io/versions/latest/sdk/map-view/
https://docs.expo.io/workflow/debugging/

### Preguntas
Seguimos usando Google o vendor diferente o custom tiles para permitirnos mas resolution?  
Implementamos QR codes?  


