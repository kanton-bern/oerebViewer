<template>
  <div />
</template>

<script>
import TileLayer from 'ol/layer/Tile'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS'
import WMTSCapabilities from 'ol/format/WMTSCapabilities'

export default {
  props: {
    id: {
      required: true,
      type: String,
    },

    visible: {
      type: Boolean,
      default: true,
    },

    settings: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      wmtsOptions: null,
      layer: null,
      mounted: false,
    }
  },

  computed: {
    esriToken() {
      return this.$store.state.map.esriToken
    },
  },

  watch: {
    async esriToken() {
      const newLayer = await this.createLayer()

      if (this.mounted) {
        this.onUnmounted()
      }

      this.layer = newLayer
      this.onMounted()
    },

    visible() {
      this.layer.setVisible(this.visible)
    },
  },

  async created() {
    this.layer = await this.createLayer()
    this.onMounted()
  },

  mounted() {
    this.mounted = true
    this.onMounted()
  },

  destroyed() {
    this.mounted = false
    this.onUnmounted()
  },

  methods: {
    async createLayer() {
      const settings = {
        visible: this.visible,
        ...this.settings,
      }

      this.validateOrThrow(settings)

      if (this.esriToken) {
        settings.sourceUrl += `?token=${this.esriToken}`
      }

      const response = await fetch(settings.sourceUrl)
      const text = await response.text()

      if (!text) this.throw('could not load capabilities')

      const parser = new WMTSCapabilities()
      const result = parser.read(text)

      this.wmtsOptions = optionsFromCapabilities(result, {
        layer: settings.capabilityLayer,
        matrixSet: settings.capabilityMatrixSet,
      })

      if (this.esriToken) {
        for (let i = 0; i < this.wmtsOptions.urls.length; i++) {
          this.wmtsOptions.urls[i] += '?token=' + this.esriToken
        }
      }

      delete settings.sourceType
      delete settings.sourceUrl
      delete settings.capabilityLayer
      delete settings.capabilityMatrixSet

      const layer = new TileLayer({
        ...settings,
        source: new WMTS(this.wmtsOptions),
      })

      if (!layer) {
        this.throw('invalid layer settings')
      }

      return layer
    },

    onMounted() {
      if (this.layer && this.mounted) {
        this.$emit('layer-added', this.layer)
      }
    },

    onUnmounted() {
      if (!this.layer) return
      this.$emit('layer-removed', this.layer)
    },

    validateOrThrow(settings) {
      if (settings.sourceType !== 'Capabilities') {
        this.throw('sourceType should be "Capabilities"')
      }

      if (typeof settings.sourceUrl !== 'string' || !settings.sourceUrl) {
        this.throw('sourceUrl required')
      }

      if (
        typeof settings.capabilityLayer !== 'string' ||
        !settings.capabilityLayer
      ) {
        this.throw('capabilityLayer required')
      }

      if (
        typeof settings.capabilityMatrixSet !== 'string' ||
        !settings.capabilityMatrixSet
      ) {
        this.throw('capabilityMatrixSet required')
      }
    },

    throw(message) {
      const context = {
        layerId: this.id,
        component: 'WmtsCapabilities',
        ...this.settings,
      }
      console.error(message, context)
      throw new Error(
        `Error: ${message} (layerId: ${context.layerId}, component: ${context.component})`
      )
    },
  },
}
</script>
