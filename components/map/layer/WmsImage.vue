<template>
  <div />
</template>

<script>
import ImageLayer from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'

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

    opacity: {
      type: Number,
      default: 1,
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
        opacity: this.opacity,
        visible: this.visible,
        url: this.settings.sourceUrl,
        serverType: 'geoserver',

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

      const layer = new ImageLayer({
        ...settings,
        source: new ImageWMS(settings),
      })

      if (!layer) {
        this.throw('invalid layer settings')
      }

      layer.setZIndex(50)

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
      if (typeof settings.sourceUrl !== 'string' || !settings.sourceUrl) {
        this.throw('sourceUrl required')
      }
    },

    throw(message) {
      const context = {
        layerId: this.id,
        component: 'WmsImage',
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
