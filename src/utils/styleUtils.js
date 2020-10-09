
// https://coolors.co/606c38-283618-fefae0-dda15e-bc6c25
// https://coolors.co/386641-6a994e-a7c957-f2e8cf-873132


export const colors = {
  "Hunter Green":"#386641",
  "May Green":"#6a994e",
  "Android Green":"#a7c957",
  "Eggshell":"#f2e8cf",
  "Brandy":"#873132",
  "Dark Olive Green":"#606c38",
  "Kombu Green":"#283618",
  "Cornsilk":"#fefae0",
  "Fawn":"#dda15e",
  "Liver Dogs":"#bc6c25",
  "Lapis Lazuli": "#005FA3",
  "Middle Blue": "#8DC9D7"
};

export const headerStyles = {
  headerStyle: {
    backgroundColor: colors["Fawn"],
  },
  headerTintColor: colors["Brandy"],
  headerTitleStyle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18
  }
}

export const drawerStyles = {
  backgroundColor: 'rgba(96, 108, 56, .3)',
  //backgroundColor: 'rgba(254, 250, 224, 0.8)',
}

// https://mapstyle.withgoogle.com/
export const mapStyles = [
  {
    "featureType": "administrative.country",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#127d40"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#127d40"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#127d40"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#127d40"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f0ce93"
      }
    ]
  }
]
