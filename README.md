# OEREB-Viewer

Source code to setup a viewer for the Cadastre of Public-law Restrictions on landownership (DE: ÖREB-Kataster) displaying the JSON-Extract of the PLR-cadastre.

# Setup
## Configuration
Before building the OEREB-Viewer, copy `.env.example` into `.env` and edit the configuration.

Replace `local` with your directory name under `./config`. For example, use `bern` instead.

```ini
# apply configurations from this directory in ./config
NUXT_ENV_CONFIG_CONTEXT=local

# credentials for esri token authentication
NUXT_ENV_TOKEN_USERNAME=user
NUXT_ENV_TOKEN_PASSWORD=password
```

See [Custom Configuration](#custom-configuration) for configuration instructions.

## Platform
If you don't use Docker, the `Node` runtime at the latest version of `16` is required for the build step.
Check out [Node](https://nodejs.org/) for more information.

# Use with Docker
For simple deployment with Docker, a `Dockerfile` is provided.
During the build, a static build of the app is generated and bundled with an HTTP server.

## Build Docker image
Change the directory to where the OEREB-Viewer code is placed and run the build command.
This command tags the image with `oereb-viewer`

```bash
docker build -t oereb-viewer .
```

## Run Docker image
The `oereb-viewer` image exposes the port `3000`.

> Make sure your final port is linked to the exposed port of the image

```bash
# link local port 3000 to exposed port 3000
docker run -it -p 3000:3000 oereb-app
```


# Use without Docker
For detailed explanation on how things work,
check out [Nuxt.js docs](https://nuxtjs.org).

## Based on Node server
The OEREB-Viewer provides a simple server based on Node. A process monitoring is required, to ensure continuous uptime.

```bash
# install dependencies
npm install

# build to be served with node server
# and launch server localhost:3000
npm run build
npm run start
```

## Based on static files
Static files are generated in the `./dist` directory. A web server is required to serve the static files.

```bash
# install dependencies
npm install

# build to be served statically from ./dist
npm run generate
```

## Build for development and testing purpose
```bash
# install dependencies
npm install

# build for development via localhost:3000
npm run dev
```

# Custom Configuration
Configuration are stored under `./config` and can be selected by setting `NUXT_ENV_CONFIG_CONTEXT` in the `.env` file.

```ini
# change the title shown in the browser tab
NUXT_ENV_TITLE="ÖREB-Viewer | Visualiseur RDPPF"

# define wich configuration should be applied
NUXT_ENV_CONFIG_CONTEXT=bern

# if your viewer reqires 
NUXT_ENV_TOKEN_USERNAME=user
NUXT_ENV_TOKEN_PASSWORD=password
```

Custom configurations are merged with the default configurations by merging and overwriting same configurations.

When starting a new custom configuration, consider copying an existing configuration into a new directory, updating `.env` and updating each configuration carefully.

Place local configurations in `./config/local` or `./config/<any-name>-local` like `./config/bern-local`.
They won't be tracked by git, as they are in `.gitignore`.

## setup.js
This is where you place your settings.

## setup.scss
Create a `setup.scss` file in your config directory, if you wan't to overwrite theme colors or any css.

```scss
/** overwrite theme css variables with your own RGB colors */
:root {
    --color-background-primary: 45, 54, 62;
    --color-text-primary: 255, 255, 255;

    --color-background-secondary: 203, 211, 219;
    --color-text-secondary: 45, 54, 62;

    --color-background-accent: 255, 255, 255;
    --color-text-accent: 203, 0, 14;

    --color-text-decent: 94, 114, 135;

    --color-background-base: 254, 254, 254;
    --color-text-base: 45, 54, 62;

    --color-background-active: 94, 114, 135;
    --color-text-active: 255, 255, 255;

    --color-border-primary: 94, 114, 135;
    --color-border-secondary: 187, 187, 187;

    --color-background-thirdly: 228, 233, 237;
}

/** place your custom css here */
```

## locales
Add custom translations as JSON-files, for example `./config/{customdir}/locales/de.json`.

Overwrite languages by adding locales to your `setup.js`

```js
export const locales = [
  { code: 'de', iso: 'de-CH', file: 'de.js', title: 'Deutsch' },
  { code: 'fr', iso: 'fr-CH', file: 'fr.js', title: 'Français' },
  { code: 'rm', iso: 'rm-CH', file: 'rm.js', title: 'Rumantsch' },
  { code: 'en', iso: 'en-CH', file: 'en.js', title: 'English' },
]
```

A JavaScript language file is required, to add merge capabilities with default locales

# Built With
- [Vue](https://v2.vuejs.org/)
- [Nuxt](https://nuxtjs.org/)
- [Tailwind](https://tailwindcss.com/)
- [Open Layers](https://openlayers.org/)