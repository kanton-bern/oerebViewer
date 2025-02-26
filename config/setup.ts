// Import default configurations
import * as defaultConfig from './defaults/setup'
import type { Locale } from './locales'
import { useRuntimeConfig } from 'nuxt/app'

// Define types for configuration objects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConfigObject = Record<string, any>

// Define types for layer configurations
interface LayerConfig {
  type: string
  sourceType: string
  sourceUrl: string
  capabilityLayer?: string
  capabilityMatrixSet?: string
}

const mergeConfigs = (defaultObj: ConfigObject, customObj?: ConfigObject): ConfigObject => {
  if (!customObj) return defaultObj

  return Object.keys(defaultObj).reduce<ConfigObject>((acc, key) => {
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

const loadCustomConfig = async (configContext: string | null = null): Promise<ConfigObject> => {
  if (!configContext) {
    const config = useRuntimeConfig()
    configContext = config.public.configContext || null
  }
  try {
    return await import(`./${configContext}/setup.js`).then(m => m.default || m)
  } catch (error: unknown) {
    console.error(`Failed to load custom configuration: ${error instanceof Error ? error.message : String(error)}`)
    return {}
  }
}

export const getConfig = async (): Promise<ConfigObject> => {
  const customConfig = await loadCustomConfig()
  return mergeConfigs(defaultConfig, customConfig)
}

// Export individual configurations (these will be populated after getConfig is called)
export const getOerebService = async (): Promise<ConfigObject> => {
  const config = await getConfig()
  return config.oerebService
}

export const getLocales = async (): Promise<Locale[]> => (await getConfig()).locales
export const getView = async (): Promise<ConfigObject> => (await getConfig()).view
export const getZoom = async (): Promise<ConfigObject> => (await getConfig()).zoom
export const getBackgroundLayers = async (): Promise<LayerConfig[]> => (await getConfig()).backgroundLayers
export const getOrthoPhotoLayers = async (): Promise<LayerConfig[]> => (await getConfig()).orthoPhotoLayers
export const getAdditionalLayers = async (): Promise<LayerConfig[]> => (await getConfig()).additionalLayers
export const getProjectionDefinitions = async (): Promise<ConfigObject> => (await getConfig()).projectionDefinitions
export const getEsriTokenService = async (): Promise<ConfigObject> => (await getConfig()).esriTokenService
export const getUsesEsriToken = async (): Promise<boolean> => (await getConfig()).usesEsriToken
export const getMapLayerStyles = async (): Promise<ConfigObject> => (await getConfig()).mapLayerStyles
export const getPdfService = async (): Promise<ConfigObject> => (await getConfig()).pdfService
export const getExternalService = async (): Promise<ConfigObject> => (await getConfig()).externalService
export const getExternalInstructions = async (): Promise<ConfigObject> => (await getConfig()).externalInstructions
export const getOwnerService = async (): Promise<ConfigObject> => (await getConfig()).ownerService
export const getSearchService = async (): Promise<ConfigObject> => (await getConfig()).searchService
export const getUserInterface = async (): Promise<ConfigObject> => (await getConfig()).userInterface

// Re-export helper functions
export * from '../helpers/template'
