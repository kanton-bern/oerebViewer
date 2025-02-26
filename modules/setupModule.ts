import { defineNuxtModule, useLogger } from '@nuxt/kit'
import fs from 'fs'
import path from 'path'

export default defineNuxtModule({
  meta: {
    name: 'setup',
    configKey: 'setupModule',
  },
  setup(options, nuxt) {
    const logger = useLogger('setupModule')
    const CONFIG_CONTEXT = process.env.NUXT_ENV_CONFIG_CONTEXT || ''

    // Log the config context
    logger.info(`Loaded Config: ${CONFIG_CONTEXT}`)

    // Use Nuxt 3 hooks
    nuxt.hook('builder:generateApp', () => {
      // copy config file to default location
      let styles = ''
      const styleFile = path.resolve(
        process.cwd(),
        'config',
        CONFIG_CONTEXT,
        'setup.css',
      )
      if (fs.existsSync(styleFile)) {
        logger.success('found setup.css')
        styles = fs.readFileSync(styleFile, 'utf-8')
      }
      fs.writeFileSync(
        path.resolve(process.cwd(), 'config/defaults/setup.css'),
        styles,
      )
    })
  },
})
