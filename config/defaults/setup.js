/**
 * Configuration Setup
 * --------------------
 *
 * Each section starts with a line like this (view is the name of the section):
 *  export const view
 *
 * A configuration consists of key value pairs and it looks like this:
 *  key: value
 *
 * A value can be a string, a template string, a number or a function.
 *
 * Template strings are strings that contain placeholders.
 * Placeholders are enclosed in curly braces.
 * If a `query` placeholder is used, the placeholder looks like this:
 *  {{query}}
 */

/**
 * Available locales for this app
 */
export const locales = [
  { code: 'de', iso: 'de-CH', file: 'de.js', title: 'Deutsch' },
  { code: 'fr', iso: 'fr-CH', file: 'fr.js', title: 'Français' },
]

/**
 * Initial configuration of the view from MapViewer
 * https://openlayers.org/en/latest/apidoc/module-ol_View.html
 */
export const view = {
  projection: 'EPSG:2056',
  centerX: 2600000,
  centerY: 1150000,
  zoom: 8,
}

/**
 * Zoomlevels
 */
export const zoom = {
  // minimal zoom level to show oerebLayer
  oerebLayer: 16.5,
}

export const searchService = {
  // template url for searching properties - placeholder {{query}}
  search: undefined,

  // function for parsing search results from json response
  // as a result provide an object with the following properties:
  //  - id: unique id for the search result
  //  - bbox: string / bounding box coordinates
  //  - label: string / label shown in search result
  //  - lat: number / latitude
  //  - lon: number / longitude
  //  - x: number / x coordinate in swiss coordinates
  //  - y: number / y coordinate in swiss coordinates
  parser: (response) =>
    response.map((item) => ({
      id: item.id || `${item.x}-${item.y}`,
      bbox: item.bbox,
      label: item.label,
      lat: item.lat,
      lon: item.lon,
      x: item.x,
      y: item.y,
    })),
}

export const projectionDefinitions = {
  // SwissCoordinate
  2056: {
    type: 2056,
    proj4:
      '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
  },
  // GlobalCoordinate
  4326: {
    type: 4326,
    proj4:
      '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees',
  },
  // SwissLV03Coordinate
  21781: {
    type: 21781,
    proj4:
      '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
  },
}

/**
 * Layer configurations
 * --------------------
 * configuration properties from
 * https://openlayers.org/en/latest/apidoc/module-ol_layer_Tile-TileLayer.html#TileLayer
 */

export const backgroundLayers = [
  // example for wmts as xyz source
  {
    type: 'WMTS',
    sourceType: 'XYZ',
    sourceUrl:
      'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg',
  },
  // example for wmts from capabilities
  /*  {
    type: 'WMTS',
    sourceType: 'Capabilities',
    sourceUrl:
      'https://www.geoservice.apps.be.ch/geoservice2/rest/services/a4p/a4p_kanton5_n_bk/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
    capabilityLayer: 'a4p_a4p_kanton5_n_bk',
    capabilityMatrixSet: 'EPSG:2056',
  }, */
]

export const orthoPhotoLayers = []

export const additionalLayers = []

export const esriTokenService = {}

export const usesEsriToken = false

/**
 * Configure WFS Layer Styles
 */
export const mapLayerStyles = {
  extractFeature: {
    stroke: 'rgba(255, 0, 0, 0.9)',
    fill: 'rgba(255, 0, 0, 0)',
    width: 2,
  },
  previewFeature: {
    stroke: 'rgba(255, 100, 0, 0.9)',
    fill: 'rgba(255, 100, 0, 0.2)',
    width: 2,
  },
}

/**
 * ÖREB Service
 * ---------------------
 * provides information about EGRID and extracts
 */
export const oerebService = {
  // - getEGRIDByCoordinate: template url with placeholder {{latitude}} and {{longitude}}
  // - getExtractByEGRID: template url with placeholder {{EGRID}} and {{language}}
}

/**
 * PDF Service
 * ---------------------
 * provides url for fetching PDF files of extracts
 */
export const pdfService = {
  // - getPDFUrlByEGRID: template url with placeholder {{EGRID}} and {{language}}
}

/**
 * External Service
 * ---------------------
 * provides url for visiting the extract externaly
 */
export const externalService = {
  // - getExternalUrlByEGRID: template url with placeholder {{EGRID}} and {{language}} - disabled if false
}

/**
 * External Instructions
 * ---------------------
 * provides url for visiting external instructions
 */
export const externalInstructions = {
  instructionUrl: false, // url to external instruciton - place holder {{language}} and {{languageUppercase}} - disabled if false
}

/**
 * Owner Service
 * ---------------------
 * provides url for visiting information about the owner of the extract
 */
export const ownerService = {
  // - getOwnerUrlByEGRID: template url with placeholder {{number}}, {{municipalityCode}}, {{EGRID}} and {{language}} - disabled if false
}

/**
 * Additional settings for the user interface
 */
export const userInterface = {
  // - disableMapLegendAtWeb: boolean (default: false) - disable link for viewing full map legend at web
}
