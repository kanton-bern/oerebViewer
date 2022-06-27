<template>
  <div />
</template>

<script>
import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'

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
    createLayer() {
      const settings = {
        visible: this.visible,
        url: this.settings.sourceUrl,
        params: {
          LAYERS: this.settings.capabilityLayer,
        },

        ...this.settings,
      }

      this.validateOrThrow(settings)

      if (this.esriToken) {
        settings.url += `?token=${this.esriToken}`
      }
      delete settings.sourceType
      delete settings.sourceUrl
      delete settings.capabilityLayer
      delete settings.capabilityMatrixSet

      const layer = new TileLayer({
        ...settings,
        source: new TileWMS(settings),
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
    },

    throw(message) {
      const context = {
        layerId: this.id,
        component: 'WmsCapabilities',
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
