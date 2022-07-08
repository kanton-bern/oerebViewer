import * as defaults from './defaults/setup'

export * from '../helpers/template'

let config = {}

if (process.env.NUXT_ENV_CONFIG_CONTEXT) {
  config = require('./' + process.env.NUXT_ENV_CONFIG_CONTEXT + '/setup')
}

export const locales = config.locales || defaults.locales

export const view = {
  ...defaults.view,
  ...config.view,
}

export const zoom = {
  ...defaults.zoom,
  ...config.zoom,
}

export const backgroundLayers =
  config.backgroundLayers || defaults.backgroundLayers

export const orthoPhotoLayers =
  config.orthoPhotoLayers || defaults.orthoPhotoLayers

export const additionalLayers =
  config.additionalLayers || defaults.additionalLayers

export const projectionDefinitions = {
  ...defaults.projectionDefinitions,
  ...config.projectionDefinitions,
}

export const esriTokenService = {
  ...defaults.esriTokenService,
  ...config.esriTokenService,
}

export const usesEsriToken =
  typeof config.usesEsriToken !== 'undefined'
    ? config.usesEsriToken
    : defaults.usesEsriToken

export const mapLayerStyles = {
  ...defaults.mapLayerStyles,
  ...config.mapLayerStyles,
}

export const oerebService = {
  ...defaults.oerebService,
  ...config.oerebService,
}

export const pdfService = {
  ...defaults.pdfService,
  ...config.pdfService,
}

export const externalService = {
  ...defaults.externalService,
  ...config.externalService,
}

export const externalInstructions = {
  ...defaults.externalInstructions,
  ...config.externalInstructions,
}

export const ownerService = {
  ...defaults.ownerService,
  ...config.ownerService,
}

export const searchService = {
  ...defaults.searchService,
  ...config.searchService,
}

export const userInterface = {
  ...defaults.userInterface,
  ...config.userInterface,
}
