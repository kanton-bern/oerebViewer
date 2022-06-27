<template>
  <div>XYZ</div>
</template>

<script>
import { XYZ } from 'ol/source'
import TileLayer from 'ol/layer/Tile'

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
      layer: null,
    }
  },

  watch: {
    visible() {
      this.layer.setVisible(this.visible)
    },
  },

  created() {
    const settings = {
      visible: this.visible,
      ...this.settings,
    }

    this.validateOrThrow(settings)

    const source = new XYZ({
      url: settings.sourceUrl,
    })

    delete settings.sourceUrl
    delete settings.sourceType

    this.layer = new TileLayer({
      id: this.id,
      ...settings,
      source,
    })

    if (!this.layer) {
      this.throw('invalid layer settings')
    }
  },

  mounted() {
    this.$emit('layer-added', this.layer)
  },

  destroyed() {
    this.$emit('layer-removed', this.layer)
  },

  methods: {
    validateOrThrow(settings) {
      if (settings.sourceType !== 'XYZ') {
        this.throw('invalid configuration')
      }

      if (typeof settings.sourceUrl !== 'string' || !settings.sourceUrl) {
        this.throw('sourceUrl required')
      }
    },

    throw(message) {
      const context = {
        layerId: this.id,
        component: 'WmtsXyz',
        ...this.settings,
      }
      console.error(`Error: ${message}`, context)
      throw new Error(
        `${message} (layerId: ${context.layerId}, component: ${context.component})`
      )
    },
  },
}
</script>
