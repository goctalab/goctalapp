
export default [
  { 
    filename: "Batan.kml",
    coordinates: '[["-77.89805", "-6.055825", "1735.16"]]',
    rowid: 2,
    kml_type: "Point",
    placeData: {
      description: "hello I'm a point",
      title: "Batan"
    }
  },
  { 
    filename: "Orchideas.kml",
    coordinates: '[["-77.89805", "-6.055825", "1735.16"]]',
    rowid: 3,
    kml_type: "Point",
    placeData: {
      description: "hello I'm a point",
      title: "Orchids"
    }
  }
]


export const markersProcessed = [
  { 
    filename: "Batan.kml",
    coordinates: [{
      latitude: -77.89805,
      longitude: -6.055825 // ignore z coord...
    }],
    rowid: 2,
    kml_type: "Point",
    placeData: {
      description: "hello I'm a point",
      title: "Batan"
    }
  },
  { 
    filename: "Orchideas.kml",
    coordinates: [{
      latitude: -77.89805,
      longitude: -6.055825 // ignore z coord...
    }],
    rowid: 3,
    kml_type: "Point",
    placeData: {
      description: "hello I'm a point",
      title: "Orchids"
    }
  }
]
