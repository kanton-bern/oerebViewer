/**
 * This plugin is used to load the translations for the i18n plugin.
 */

export default defineNuxtPlugin(async (nuxtApp) => {
  const loadTranslations = async (locale: string) => {
    const config = useRuntimeConfig()
    const configContext = config.public.configContext || 'defaults'

    try {
      const defaultModule = await import(`../config/defaults/locales/${locale}.json`)

      if (configContext === 'defaults') {
        return defaultModule.default
      }

      let contextTranslations = {}
      try {
        const contextModule = await import(`../config/${configContext}/locales/${locale}.json`)
        contextTranslations = contextModule.default
      } catch (error) {
        console.warn(`No context-specific translations found for ${locale} in ${configContext}`, error)
      }

      const translations = {
        ...defaultModule.default,
        ...contextTranslations,
      }

      return translations
    } catch (error) {
      console.error(`Error loading translations for ${locale}:`, error)
      return {}
    }
  }

  const { $i18n } = useNuxtApp()

  nuxtApp.hook('i18n:beforeLocaleSwitch', async ({ newLocale }) => {
    const newMessages = await loadTranslations(newLocale)
    $i18n.setLocaleMessage(newLocale, newMessages)
  })

  // Initial load
  const initialLocale = $i18n.locale.value || 'de'
  const initialMessages = await loadTranslations(initialLocale)
  $i18n.setLocaleMessage(initialLocale, initialMessages)
})
