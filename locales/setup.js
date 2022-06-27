export default function loadTranslations(locale) {
  if (typeof locale !== 'string' || locale.length !== 2) {
    throw new Error('locale must be a string of length 2')
  }

  const defaults = require(`~/config/defaults/locales/${locale}.json`)
  const config = process.env.NUXT_ENV_CONFIG_CONTEXT
    ? require(`~/config/${process.env.NUXT_ENV_CONFIG_CONTEXT}/locales/${locale}.json`)
    : {}

  return {
    ...defaults,
    ...config,
  }
}
