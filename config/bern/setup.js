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
  centerX: 2616445.3125,
  centerY: 1190976.5625,
  zoom: 10,
  minZoom: 9,
  maxZoom: 22.5,
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
  search:
    'https://www.metawarehouse-test.apps.be.ch/rpc/oereb_search?searchtext={{query}}',

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
    response
      // .sort((a, b) => a.weight - b.weight) // sort by weight
      // .reverse() // reverse to get highest weight first
      .map((item) => ({
        id: item.id || `${item.x}-${item.y}`,
        bbox: item.bbox,
        label: item.label,
        lat: item.lat,
        lon: item.lon,
        x: item.x,
        y: item.y,
      })),
}

/**
 * Layer configurations
 * --------------------
 * configuration properties from
 * https://openlayers.org/en/latest/apidoc/module-ol_layer_Tile-TileLayer.html#TileLayer
 */

export const backgroundLayers = [
  {
    type: 'WMS',
    sourceType: 'Capabilities',
    sourceUrl:
      'https://geodienste.ch/db/av_situationsplan_0/deu?SERVICE=WMS&REQUEST=GetCapabilities',
    capabilityLayer: 'daten',
    zIndex: 1,
  },
]

export const orthoPhotoLayers = [
  {
    type: 'WMTS',
    sourceType: 'Capabilities',
    sourceUrl:
      'https://www.geoservice.apps.be.ch/geoservice2/rest/services/a4p/a4p_orthofoto_n_bk/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
    capabilityLayer: 'a4p_a4p_orthofoto_n_bk',
    capabilityMatrixSet: 'EPSG:2056',
    zIndex: 3,
    minZoom: 11,
  },
]

export const additionalLayers = [
  {
    type: 'WMTS',
    sourceType: 'Capabilities',
    sourceUrl:
      'https://www.geoservice.apps.be.ch/geoservice2/rest/services/a4p/a4p_kanton5_n_bk/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
    capabilityLayer: 'a4p_a4p_kanton5_n_bk',
    capabilityMatrixSet: 'EPSG:2056',
    zIndex: 500,
  },
]

export const esriTokenService = {
  endpoint:
    'https://www.geoservice.apps.be.ch/geoservice2/tokens/generateToken',
  username: process.env.NUXT_ENV_TOKEN_USERNAME,
  password: process.env.NUXT_ENV_TOKEN_PASSWORD,
  intervalMinutes: 59, // token for 59min
}

export const usesEsriToken = false

/**
 * Configure WFS Layer Styles
 */
export const mapLayerStyles = {}

/**
 * ÖREB Service
 * ---------------------
 * provides information about EGRID and extracts
 */
export const oerebService = {
  // get EGRID by coordinates - placeholder {{latitude}} and {{longitude}}
  getEGRIDByCoordinate:
    'https://www.oereb2.apps.be.ch/getegrid/json/?GNSS={{latitude}},{{longitude}}&GEOMETRY=True',

  // get Extract by EGRID - placeholder {{EGRID}} and {{language}}
  getExtractByEGRID:
    'https://www.oereb2.apps.be.ch/extract/json?egrid={{EGRID}}&lang={{language}}&geometry=true',
}

/**
 * PDF Service
 * ---------------------
 * provides url for fetching PDF files of extracts
 */
export const pdfService = {
  // get PDF by EGRID - placeholder {{EGRID}} and {{language}}
  getPDFUrlByEGRID:
    'https://www.oereb.apps.be.ch/extract/reduced/pdf/{{EGRID}}?lang={{language}}',
}

/**
 * External Service
 * ---------------------
 * provides url for visiting the extract externaly
 */
export const externalService = {
  // get external URL by EGRID - placeholder {{EGRID}} and {{language}} - disabled if false
  getExternalUrlByEGRID: false,
  // 'https://www.map.apps.be.ch/pub/externalcall.jsp?query1=egrid&keyvalue1={{EGRID}}&keyname1=EGRID&project=a42pub_oereb_oeffen_{{languageUppercase}}&language={{language}}&userprofile=geo&client=auto',
}

/**
 * External Instructions
 * ---------------------
 * provides url for visiting the external instructions
 */
export const externalInstructions = {
  // - instructionUrl: url to external instruciton - disabled if false
}

/**
 * Owner Service
 * ---------------------
 * provides url for visiting information about the owner of the extract
 */
export const ownerService = {
  // get external URL by EGRID - placeholder {{number}}, {{municipalityCode}}, {{EGRID}} and {{language}} - disabled if false
  getOwnerUrlByEGRID: false,
}

/**
 * Additional settings for the user interface
 */
export const userInterface = {
  // boolean (default: false) - disable link for viewing full map legend at web
  disableMapLegendAtWeb: true,
}
