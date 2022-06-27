<template>
  <div>
    <div v-if="!usesEsriToken || $store.state.map.esriToken">
      <Component
        :is="getComponentForLayer(orthoPhtoLayer)"
        v-for="(orthoPhtoLayer, index) in orthoPhotoLayers"
        :id="'orthoPhoto' + index"
        :key="'orthoPhoto' + index"
        :settings="orthoPhtoLayer"
        :visible="isSatelliteView"
        v-on="$listeners"
      >
        {{ getComponentForLayer(orthoPhtoLayer) }}
      </Component>

      <Component
        :is="getComponentForLayer(backgroundLayer)"
        v-for="(backgroundLayer, index) in backgroundLayers"
        :id="'background' + index"
        :key="'background' + index"
        :settings="backgroundLayer"
        :visible="isMapView"
        v-on="$listeners"
      >
        {{ getComponentForLayer(backgroundLayer) }}
      </Component>

      <Component
        :is="getComponentForLayer(additionalLayer)"
        v-for="(additionalLayer, index) in additionalLayers"
        :id="'additional' + index"
        :key="'additional' + index"
        :settings="additionalLayer"
        v-on="$listeners"
      >
        {{ getComponentForLayer(additionalLayer) }}
      </Component>
    </div>
  </div>
</template>

<script>
import { camelCase, upperFirst } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import {
  backgroundLayers,
  orthoPhotoLayers,
  additionalLayers,
  usesEsriToken,
} from '~/config/setup'
import WfsFeature from '~/components/map/layer/WfsFeature'
import WmsCapabilities from '~/components/map/layer/WmsCapabilities'
import WmtsCapabilities from '~/components/map/layer/WmtsCapabilities'
import WmtsXyz from '~/components/map/layer/WmtsXyz'

export default {
  components: {
    WfsFeature,
    WmsCapabilities,
    WmtsCapabilities,
    WmtsXyz,
  },

  data() {
    return {
      backgroundLayers: [...backgroundLayers],
      orthoPhotoLayers: [...orthoPhotoLayers],
      additionalLayers: [...additionalLayers],
      usesEsriToken,
    }
  },

  computed: {
    ...mapGetters('map', ['isSatelliteView', 'isMapView']),
  },

  created() {
    if (this.usesEsriToken) this.enableTokenUpdater()
  },

  methods: {
    ...mapActions('map', ['enableTokenUpdater', 'updateToken']),
    getComponentForLayer(settings) {
      // convert to component name ex.: MapLayerWmtsXyz
      const componentName = upperFirst(
        camelCase('MapLayer_' + settings.type + '_' + settings.sourceType)
      )

      if (!(componentName in this.$options.components)) {
        console.error('check your configuration')
        throw new Error(
          `Invalid layer type: ${settings.type} or layer source type: ${settings.sourceType}`
        )
      }

      return componentName
    },
  },
}
</script>
