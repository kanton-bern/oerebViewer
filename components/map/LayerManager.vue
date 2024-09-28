<template>
  <div>
    <div v-if="!usesEsriToken || mapStore.esriToken">
      <Component
        :is="getComponentForLayer(orthoPhtoLayer)"
        v-for="(orthoPhtoLayer, index) in orthoPhotoLayers"
        :id="'orthoPhoto' + index"
        :key="'orthoPhoto' + index"
        :settings="orthoPhtoLayer"
        :visible="isSatelliteView"
        v-bind="$attrs"
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
        v-bind="$attrs"
      >
        {{ getComponentForLayer(backgroundLayer) }}
      </Component>

      <Component
        :is="getComponentForLayer(additionalLayer)"
        v-for="(additionalLayer, index) in additionalLayers"
        :id="'additional' + index"
        :key="'additional' + index"
        :settings="additionalLayer"
        v-bind="$attrs"
      >
        {{ getComponentForLayer(additionalLayer) }}
      </Component>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useMapStore } from '~/store/map'
import {
  getBackgroundLayers,
  getOrthoPhotoLayers,
  getAdditionalLayers,
  getUsesEsriToken,
} from '~/config/setup.js'
import WfsFeature from '~/components/map/layer/WfsFeature.vue'
import WmsCapabilities from '~/components/map/layer/WmsCapabilities.vue'
import WmtsCapabilities from '~/components/map/layer/WmtsCapabilities.vue'
import WmtsXyz from '~/components/map/layer/WmtsXyz.vue'

const mapStore = useMapStore()

const backgroundLayers = ref(await getBackgroundLayers())
const orthoPhotoLayers = ref(await getOrthoPhotoLayers())
const additionalLayers = ref(await getAdditionalLayers())
const usesEsriToken = await getUsesEsriToken()

const isSatelliteView = computed(() => mapStore.isSatelliteView)
const isMapView = computed(() => mapStore.isMapView)

onBeforeMount(() => {
  if (usesEsriToken) mapStore.enableTokenUpdater()
})

const componentMap = {
  WfsFeature,
  WmsCapabilities,
  WmtsCapabilities,
  WmtsXyz,
}

function camelCase(str) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
}

function upperFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getComponentForLayer(settings) {
  const componentName = upperFirst(
    camelCase(`${settings.type}_${settings.sourceType}`),
  )

  if (!(componentName in componentMap)) {
    console.error('check your configuration')
    throw new Error(
      `Invalid layer type: ${settings.type} or layer source type: ${settings.sourceType}`,
    )
  }

  return componentMap[componentName]
}
</script>
