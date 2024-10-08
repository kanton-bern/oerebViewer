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
  { code: 'de', language: 'de-CH', file: 'de.js', title: 'Deutsch' },
  { code: 'fr', language: 'fr-CH', file: 'fr.js', title: 'Français' },
  { code: 'rm', language: 'rm-CH', file: 'rm.js', title: 'Rumantsch' },
]

/**
 * Initial configuration of the view from MapViewer
 * https://openlayers.org/en/latest/apidoc/module-ol_View.html
 */
export const view = {
  projection: 'EPSG:2056',
  centerX: 2760000,
  centerY: 1170000,
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
    'https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText={{query}}&type=locations',

  // function for parsing search results from json response
  // as a result provide an object with the following properties:
  //  - id: unique id for the search result
  //  - bbox: string / bounding box coordinates
  //  - label: string / label shown in search result
  //  - lat: number / latitude
  //  - lon: number / longitude
  //  - x: number / x coordinate in swiss coordinates
  //  - y: number / y coordinate in swiss coordinates
  parser: (response) => [
    ...response.results.map((item) => ({
      id: item.id || `${item.x}-${item.y}`,
      bbox: item.attrs.geom_st_box2d,
      label: item.attrs.label,
      lat: item.attrs.lat,
      lon: item.attrs.lon,
      x: item.attrs.x,
      y: item.attrs.y,
    })),
  ],

  // search labels are formatted with html
  isHtmlFormatted: true,
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
      'https://geodienste.ch/db/av_situationsplan_oereb_0?SERVICE=WMS&REQUEST=GetCapabilities',
    capabilityLayer: 'daten',
    zIndex: 1,
  },
]

export const orthoPhotoLayers = [
  {
    type: 'WMS',
    sourceType: 'Capabilities',
    sourceUrl: 'https://wms.geo.gr.ch/hg_luftbild',
    capabilityLayer: 'hg_luftbild',
    capabilityMatrixSet: 'EPSG:2056',
    zIndex: 3,
    minZoom: 11,
  },
]

export const additionalLayers = [
  {
    type: 'WMS',
    sourceType: 'Capabilities',
    sourceUrl: 'https://wms.geo.gr.ch/hg_luftbild',
    capabilityLayer: 'hg_luftbild',
    capabilityMatrixSet: 'EPSG:2056',
    zIndex: 3,
    minZoom: 11,
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
    'https://oereb.geo.gr.ch/main/oereb/getegrid/json/?GNSS={{latitude}},{{longitude}}',

  // get Extract by EGRID - placeholder {{EGRID}} and {{language}}
  getExtractByEGRID:
    'https://oereb.geo.gr.ch/main/oereb/extract/reduced/json/{{EGRID}}?LANG={{language}}&geometry=true',
}

/**
 * PDF Service
 * ---------------------
 * provides url for fetching PDF files of extracts
 */
export const pdfService = {
  // get PDF by EGRID - placeholder {{EGRID}} and {{language}}
  getPDFUrlByEGRID:
    'https://oereb.geo.gr.ch/main/oereb/extract/reduced/pdf/{{EGRID}}?lang={{language}}',
}

/**
 * External Service
 * ---------------------
 * provides url for visiting the extract externaly
 */
export const externalService = {
  // get external URL by EGRID - placeholder {{EGRID}} and {{language}} - disabled if false
  getExternalUrlByEGRID: false,
  // 'http://map.geo.gr.ch/gr_webmaps/wsgi/theme/Basisinformationen?wfs_url=https://wfs.geo.gr.ch/search&wfs_layer=Liegenschaften&wfs_egris_egrid={{EGRID}}',
}

/**
 * External Instructions
 * ---------------------
 * provides url for visiting the external instructions
 */
export const externalInstructions = {
  // - instructionUrl: url to external instruciton - place holder {{language}} and {{languageUppercase}} - disabled if false
}

/**
 * Owner Service
 * ---------------------
 * provides url for visiting information about the owner of the extract
 */
export const ownerService = {
  // get external URL by EGRID - placeholder {{number}}, {{municipalityCode}}, {{EGRID}} and {{language}} - disabled if false
  getOwnerUrlByEGRID:
    'https://geogr.mapplus.ch/terravis/owners/getParcelOwners.php?lang={{language}}&map_proj=EPSG:2056&bfs_nr={{municipalityCode}}&egrid={{EGRID}}&parz_nr={{number}}',
}

/**
 * Additional settings for the user interface
 */
export const userInterface = {
  // boolean (default: false) - disable link for viewing full map legend at web
  disableMapLegendAtWeb: true,
}
