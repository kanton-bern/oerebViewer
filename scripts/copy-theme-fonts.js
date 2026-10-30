import { cp, mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

if (existsSync('.env')) {
  process.loadEnvFile()
}

const context = process.env.NUXT_ENV_CONFIG_CONTEXT || 'defaults'

if (context === 'graubuenden') {
  const source = resolve('config/graubuenden/fonts')
  const destination = resolve('public/graubuenden/fonts')

  await mkdir(destination, { recursive: true })

  const fonts = await readdir(source)
  for (const font of fonts.filter(file => file.endsWith('.woff2'))) {
    await cp(resolve(source, font), resolve(destination, font), { force: true })
  }
}
