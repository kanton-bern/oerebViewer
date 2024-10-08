import { useRuntimeConfig } from '#app'

export default async function loadTranslations(locale: string) {
  if (typeof locale !== 'string' || locale.length !== 2) {
    throw new Error('locale must be a string of length 2')
  }

  const config = useRuntimeConfig()
  const defaults = await import(`~/config/defaults/locales/${locale}.json`).then(m => m.default)
  const contextConfig = config.NUX_ENV_CONFIG_CONTEXT
    ? await import(`~/config/${config.NUX_ENV_CONFIG_CONTEXT}/locales/${locale}.json`).then(m => m.default)
    : {}

  const translations = {
    ...defaults,
    ...contextConfig,
  }

  return translations
}
