<template>
    <div
      v-if="previewCoordinates"
      ref="previewContainer"
      class="bg-theme-primary text-theme-primary opacity-90 p-4 rounded-md relative max-w-xs"
    >
      <MapMarkerIcon class="marker-position absolute top-0 left-0 h-7 w-7" />
      <div v-if="previewEGRID && previewEGRID.length === 0">
        {{ $t('no_property_found') }}
      </div>
      <div v-else-if="previewEGRID">
        <MapLayerWfsFeature
          v-if="previewFeatures && featureStyle"
          id="preview_plot"
          :features="previewFeatures"
          :fill-color="featureStyle.fill"
          :stroke-color="featureStyle.stroke"
          :stroke-width="featureStyle.width"
          v-bind="$attrs"
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

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useMapStore } from '~/store/map'
import { usePropertyStore } from '~/store/property'
import Overlay from 'ol/Overlay'
import { MultiPolygon } from 'ol/geom'
import { Feature } from 'ol'
import { getMapLayerStyles } from '~/config/setup.js'

const mapStore = useMapStore()
const propertyStore = usePropertyStore()

const previewCoordinates = computed(() => mapStore.previewCoordinates)

const startExtraction = ({ egrid }) => {
  propertyStore.showExtractById(egrid)
  mapStore.clearPreview()
}

defineExpose({
  startExtraction,
})

const mapStyles = await getMapLayerStyles()

const mapLayerStyles = ref(mapStyles)
const overlay = ref(null)
const previewContainer = ref(null)

const featureStyle = computed(() => mapLayerStyles.value?.previewFeature || null)

const loadedEGRID = computed(() => propertyStore.extract?.RealEstate?.EGRID)
const previewEGRID = computed(() => mapStore.previewEGRID)
const previewFeatures = computed(() => {
  const rawFeatures = mapStore.previewFeatures
  if (!rawFeatures) return null

  const multiPolygon = new MultiPolygon(rawFeatures.coordinates)
  return new Feature({ geometry: multiPolygon })
})

const emit = defineEmits(['overlayadded', 'overlayremoved'])

watch(previewCoordinates, async (newCoordinate) => {
  if (overlay.value && newCoordinate) {
    emit('overlayremoved', overlay.value)
    overlay.value = null
  }

  if (!overlay.value && newCoordinate) {
    await nextTick()
    overlay.value = new Overlay({
      element: previewContainer.value,
      positioning: 'top-left',
      stopEvent: false,
    })
    emit('overlayadded', overlay.value)
  }

  if (overlay.value && newCoordinate) {
    const coordinate = [newCoordinate.longitude, newCoordinate.latitude]
    await overlay.value.setPosition(coordinate)
  }
}, { immediate: true, deep: true })
</script>

<style scoped>
.marker-position {
  transform: translate(-50%, -50%);
}
</style>
