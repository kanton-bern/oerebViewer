const defaultConfig = require('./defaults/setup')

export default function getLocales(context) {
  // Import default locales
  const defaultLocales = defaultConfig.locales || []

  if (context === 'defaults') {
    return defaultLocales
  }

  // Import context-specific locales
  let contextLocales = []
  try {
    const contextSetup = require(`./${context}/setup.js`)
    contextLocales = contextSetup.locales || false
  }
  catch (error) {
    console.warn(`Failed to load locales for context '${context}': ${error.message}`)
  }

  return contextLocales || defaultLocales
}
