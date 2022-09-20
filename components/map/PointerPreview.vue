<template>
  <div
    v-if="$store.state.map.previewCoordinate"
    class="bg-theme-primary text-theme-primary opacity-90 p-4 rounded-md relative max-w-xs"
  >
    <MapMarkerIcon class="marker-position absolute top-0 left-0 h-7 w-7" />
    <div v-if="previewEGRID && previewEGRID.length === 0">
      {{ $t('no_property_found') }}
    </div>
    <div v-else-if="previewEGRID">
      <MapLayerWfsFeature
        v-if="previewFeatures"
        id="preview_plot"
        :features="previewFeatures"
        :fill-color="featureStyle.fill"
        :stroke-color="featureStyle.stroke"
        :stroke-width="featureStyle.width"
        v-on="$listeners"
      />
      <div>{{ $t('preview_show_extract') }}</div>
      <div
        v-for="plot in previewEGRID"
        :key="plot.egird"
        class="font-thin text-sm"
      >
        <button class="hover:underline" @click.prevent="startExtraction(plot)">
          {{ $t('plot') }} {{ plot.number }}
          <span v-if="plot.egrid === loadedEGRID">({{ $t('active') }})</span>
        </button>
      </div>
    </div>
    <div v-else class="font-thin text-sm">
      {{ $t('preview_loading') }}
    </div>
  </div>
</template>

<script>
import Overlay from 'ol/Overlay'
import { mapActions, mapMutations } from 'vuex'
import { MultiPolygon } from 'ol/geom'
import { Feature } from 'ol'
import { mapLayerStyles } from '~/config/setup'

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
      featureStyle: mapLayerStyles.previewFeature,
    }
  },

  computed: {
    loadedEGRID() {
      return this.$store.state.property.extract?.RealEstate?.EGRID
    },

    previewEGRID() {
      return this.$store.state.map.previewEGRID
    },

    previewFeatures() {
      const rawFeatures = this.$store.state.map.previewFeatures
      if (!rawFeatures) return null

      const multiPolygon = new MultiPolygon(rawFeatures.coordinates)

      return new Feature({ geometry: multiPolygon })
    },
  },

  watch: {
    '$store.state.map.previewCoordinate'() {
      if (this.overlay && this.$store.state.map.previewCoordinate) {
        this.$emit('overlay-removed', this.overlay)
        this.overlay = null
      }

      if (!this.overlay && this.$store.state.map.previewCoordinate) {
        this.overlay = new Overlay({
          element: this.$el,
        })
        this.$emit('overlay-added', this.overlay)
      }

      if (this.overlay && this.$store.state.map.previewCoordinate) {
        const coordinate = [
          this.$store.state.map.previewCoordinate.longitude,
          this.$store.state.map.previewCoordinate.latitude,
        ]
        this.overlay.setPosition(coordinate)
      }
    },
  },

  methods: {
    ...mapActions('property', ['showExtractById']),
    ...mapMutations('map', ['clearPreview']),

    startExtraction({ egrid }) {
      this.showExtractById(egrid)
      this.clearPreview()
    },
  },
}
</script>

<style scoped>
.marker-position {
  transform: translate(-50%, -50%);
}
</style>
