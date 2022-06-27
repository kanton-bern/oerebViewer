<template>
  <div v-if="extract">
    <MapLayerWfsFeature
      v-if="extractFeatures"
      id="property_plot"
      :features="extractFeatures"
      :stroke-color="extractFeature.stroke"
      :fill-color="extractFeature.fill"
      :stroke-width="extractFeature.width"
      v-on="$listeners"
    />

    <MapLayerWmsImage
      v-for="(layer, index) in layers"
      :id="'restriction' + index"
      :key="layer.url"
      :opacity="layer.opacity"
      :settings="{ sourceUrl: layer.url }"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import { MultiPolygon } from 'ol/geom'
import { Feature } from 'ol'
import { mapLayerStyles } from '~/config/setup'
import { multilingualtext } from '~/plugins/vue-multilingual-text'

export default {
  props: {
    pointer: {
      type: Array,
      default: null,
    },
  },

  data() {
    return {
      overlay: null,
      loading: false,
      extractFeature: mapLayerStyles.extractFeature,
    }
  },

  computed: {
    extract() {
      return this.$store.state.property.extract
    },

    layers() {
      const activeThemeCode = this.$store.state.property.activeThemeCode
      if (!activeThemeCode) return []
      const activeLawStatusCode = this.$store.state.property.activeLawStatusCode

      const restrictions =
        this.$store.getters['property/restrictionsByThemeCode'](
          activeThemeCode,
          activeLawStatusCode
        ) || []

      return restrictions
        .map((restriction) => ({
          opacity: restriction.Map.layerOpacity,
          url: multilingualtext(restriction.Map.ReferenceWMS),
        }))
        .filter((v, i, a) => a.findIndex((f) => f.url === v.url) === i) // unique url
    },

    extractFeatures() {
      const rawFeatures = this.$store.state.property.extractFeatures
      if (!rawFeatures) return null

      const multiPolygon = new MultiPolygon(rawFeatures.coordinates)

      return new Feature({ geometry: multiPolygon })
    },
  },
}
</script>
