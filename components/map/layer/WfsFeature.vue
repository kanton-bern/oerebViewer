<template>
  <div />
</template>

<script>
import WFS from 'ol/format/WFS'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Stroke, Fill, Style } from 'ol/style'

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

    features: {
      type: [String, Object],
      required: false,
      default: null,
    },

    fillColor: {
      type: String,
      required: true,
    },

    strokeColor: {
      type: String,
      required: true,
    },

    strokeWidth: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      layer: null,
      source: null,
      mounted: false,
    }
  },

  watch: {
    visible() {
      this.layer.setVisible(this.visible)
    },

    features() {
      this.onUnmounted()
      this.createLayer()
      this.onMounted()
      this.onFocus()
    },
  },

  created() {
    this.createLayer()
    this.onMounted()
  },

  mounted() {
    this.mounted = true
    this.onMounted()
    this.onFocus()
  },

  destroyed() {
    this.mounted = false
    this.onUnmounted()
  },

  methods: {
    createLayer() {
      if (!this.features) return

      let vectorSource = new VectorSource()

      if (typeof this.features === 'object') {
        this.source = [this.features]
        vectorSource.addFeature(this.features)
      } else {
        const features = new WFS().readFeatures(this.features)
        this.source = features

        vectorSource = new VectorSource({
          features,
        })
      }

      this.layer = new VectorLayer({
        id: this.id,
        source: vectorSource,
        zIndex: 5000,
        style: new Style({
          stroke: new Stroke({
            color: this.strokeColor,
            width: this.strokeWidth,
          }),

          fill: new Fill({
            color: this.fillColor,
          }),
        }),
      })

      if (!this.layer) {
        this.throw('invalid layer settings')
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

    onMounted() {
      if (this.layer && this.mounted) {
        this.$emit('layer-added', this.layer)
      }
    },

    onUnmounted() {
      if (!this.layer) return
      this.$emit('layer-removed', this.layer)
    },

    onFocus() {
      if (!this.layer) return

      this.$emit('layer-focus', {
        target: this.source?.[0]?.getGeometry(),
      })
    },
  },
}
</script>
