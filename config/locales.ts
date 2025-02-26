import { locales as defaultConfigLocales } from './defaults/setup.js'

// Define types for locale objects
export interface Locale {
  code: string
  language: string
  file: string
  title: string
}

// Define type for module with locales
interface LocaleModule {
  locales?: Locale[]
}

// Pre-load known contexts to make them available synchronously
const contextCache = new Map<string, LocaleModule>()

// Helper function to preload a context
export function preloadContext(context: string): void {
  if (context === 'defaults') return

  try {
    // Use a synchronous require instead of async import for preloading
    // This ensures the context is immediately available
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const contextModule = require(`./${context}/setup.js`)
    contextCache.set(context, contextModule.default || contextModule)
  } catch (error) {
    console.warn(`Failed to preload context '${context}': ${error instanceof Error ? error.message : String(error)}`)
  }
}

export default function getLocales(context: string): Locale[] {
  // Import default locales
  const defaultLocales: Locale[] = defaultConfigLocales || []

  if (context === 'defaults') {
    return defaultLocales
  }

  // Check if context is in cache
  if (contextCache.has(context)) {
    const contextSetup = contextCache.get(context)
    return contextSetup?.locales || defaultLocales
  }

  // If not in cache, try to load synchronously (this won't work in ESM)
  console.warn(`Context '${context}' not pre-loaded. Using default locales.`)
  return defaultLocales
}
