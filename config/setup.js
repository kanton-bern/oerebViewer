// Import default configurations
import * as defaultConfig from './defaults/setup'

const mergeConfigs = (defaultObj, customObj) => {
  if (!customObj) return defaultObj

  return Object.keys(defaultObj).reduce((acc, key) => {
    if (customObj[key] !== undefined) {
      if (Array.isArray(customObj[key])) {
        // For arrays, use the custom array if it's not empty, otherwise use the default
        acc[key] = customObj[key].length > 0 ? customObj[key] : defaultObj[key]
      } else if (typeof customObj[key] === 'object' && customObj[key] !== null) {
        // For objects, use the custom object if it has any own properties, otherwise use the default
        acc[key] = Object.keys(customObj[key]).length > 0 ? customObj[key] : defaultObj[key]
      } else {
        // For primitive values, use the custom value
        acc[key] = customObj[key]
      }
    } else {
      // If the key doesn't exist in customObj, use the default value
      acc[key] = defaultObj[key]
    }
    return acc
  }, {})
}

const loadCustomConfig = async (configContext = null) => {
  if (!configContext) {
    const config = useRuntimeConfig()
    configContext = config.public.configContext
  }
  try {
    return await import(`./${configContext}/setup.js`).then(m => m.default || m)
  } catch (error) {
    console.error(`Failed to load custom configuration: ${error.message}`)
    return {}
  }
}

export const getConfig = async () => {
  const customConfig = await loadCustomConfig()
  return mergeConfigs(defaultConfig, customConfig)
}

// Export individual configurations (these will be populated after getConfig is called)
export const getOerebService = async () => {
  const config = await getConfig()
  return config.oerebService
}

export const getLocales = async () => (await getConfig()).locales
export const getView = async () => (await getConfig()).view
export const getZoom = async () => (await getConfig()).zoom
export const getBackgroundLayers = async () => (await getConfig()).backgroundLayers
export const getOrthoPhotoLayers = async () => (await getConfig()).orthoPhotoLayers
export const getAdditionalLayers = async () => (await getConfig()).additionalLayers
export const getProjectionDefinitions = async () => (await getConfig()).projectionDefinitions
export const getEsriTokenService = async () => (await getConfig()).esriTokenService
export const getUsesEsriToken = async () => (await getConfig()).usesEsriToken
export const getMapLayerStyles = async () => (await getConfig()).mapLayerStyles
export const getPdfService = async () => (await getConfig()).pdfService
export const getExternalService = async () => (await getConfig()).externalService
export const getExternalInstructions = async () => (await getConfig()).externalInstructions
export const getOwnerService = async () => (await getConfig()).ownerService
export const getSearchService = async () => (await getConfig()).searchService
export const getUserInterface = async () => (await getConfig()).userInterface

// Re-export helper functions
export * from '../helpers/template'
