const fs = require('fs')
const path = require('path')

export default function () {
  const { nuxt } = this
  const CONFIG_CONTEXT = process.env.NUXT_ENV_CONFIG_CONTEXT

  nuxt.options.cli.badgeMessages.push(`Loaded Config: ${CONFIG_CONTEXT}`)

  nuxt.hook('builder:prepared', (builder) => {
    // copy config file to default location
    let styles = ''

    const styleFile = path.resolve(
      __dirname,
      '../../config',
      CONFIG_CONTEXT,
      'setup.scss'
    )

    if (fs.existsSync(styleFile)) {
      console.success('found setup.scss')
      styles = fs.readFileSync(styleFile)
    }

    fs.writeFileSync(
      path.resolve(__dirname, '../../config/defaults/setup.scss'),
      styles
    )
  })
}
