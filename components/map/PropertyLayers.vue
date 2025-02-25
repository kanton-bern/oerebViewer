<template>
  <div v-if="extract">
    <MapLayerWfsFeature
      v-if="featureFromExtract"
      id="property_plot"
      :features="featureFromExtract"
      :stroke-color="getStrokeColor"
      :fill-color="getFillColor"
      :stroke-width="getStrokeWidth"
      v-bind="$attrs"
    />

    <MapLayerWmsImage
      v-for="(layer, index) in layers"
      :id="'restriction' + index"
      :key="layer.url"
      :opacity="layer.opacity"
      :settings="{ sourceUrl: layer.url }"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MultiPolygon } from 'ol/geom'
import { Feature } from 'ol'
import { getMapLayerStyles } from '~/config/setup'
import { usePropertyStore } from '~/store/property'
import { useMultilingualText } from '~/composables/useMultilingualText'

const { multilingualText } = useMultilingualText()

const mapLayerStyles = await getMapLayerStyles()

// style
const extractFeature = ref(null)
const getStrokeColor = computed(() => extractFeature.value?.stroke ?? 'defaultStrokeColor')
const getFillColor = computed(() => extractFeature.value?.fill ?? 'defaultFillColor')
const getStrokeWidth = computed(() => extractFeature.value?.width ?? 1)

extractFeature.value = await mapLayerStyles.extractFeature

const propertyStore = usePropertyStore()

const { extract, extractFeatures } = storeToRefs(propertyStore)

defineProps({
  pointer: {
    type: Array,
    default: null,
  },
})

const layers = computed(() => {
  const activeThemeCode = propertyStore.activeThemeCode
  if (!activeThemeCode) return []
  const activeLawStatusCode = propertyStore.activeLawStatusCode

  const restrictions = propertyStore.getRestrictionsByThemeCode(
    activeThemeCode,
    activeLawStatusCode,
  ) || []

  return restrictions
    .map((restriction) => ({
      opacity: restriction.Map.layerOpacity,
      url: multilingualText(restriction.Map.ReferenceWMS),
    }))
    .filter((v, i, a) => a.findIndex((f) => f.url === v.url) === i) // unique url
})

const featureFromExtract = computed(() => {
  const rawFeatures = extractFeatures.value
  if (!rawFeatures) return null

  const multiPolygon = new MultiPolygon(rawFeatures.coordinates)

  // Create a new Feature object with a unique id
  return new Feature({
    geometry: multiPolygon,
  })
})
</script>
