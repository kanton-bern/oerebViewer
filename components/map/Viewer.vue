<template>
  <div v-show="visible" class="h-full relative">
    <div id="map" class="h-full" />
    <MapActions
      @layerfocus="focus"
    />
    <MapLayerManager
      @layeradded="addLayer"
      @layerremoved="removeLayer"
      @layerfocus="focus"
    />
    <MapPointerPreview
      @overlayadded="addOverlay"
      @overlayremoved="removeOverlay"
      @layeradded="addLayer"
      @layerremoved="removeLayer"
      @layerfocus="focus"
    />
    <MapPropertyLayers
      @layeradded="addLayer"
      @layerremoved="removeLayer"
      @layerfocus="focus"
    />
    <slot />
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, onBeforeMount } from 'vue'
import { useMapStore } from '~/store/map'
import { storeToRefs } from 'pinia'
import 'ol/ol.css'
import { register } from 'ol/proj/proj4'
import proj4 from 'proj4'
import { Map, View } from 'ol'
import { get as getProjection, transform } from 'ol/proj'
import { ScaleLine } from 'ol/control'
import { getZoom, getProjectionDefinitions, getView } from '~/config/setup'

const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
})

const mapStore = useMapStore()
const { zoom, jumpToCoordinates, skipZoomWatch } = storeToRefs(mapStore)

const zoomConfig = await getZoom()
const projectionDefinitions = await getProjectionDefinitions()
const view = await getView()

const map = ref(null)
const mapInitialized = ref(false)
const pendingOperations = ref([])

const registerSwissProjections = () => {
  for (const key in projectionDefinitions) {
    if (Object.hasOwnProperty.call(projectionDefinitions, key)) {
      const definition = projectionDefinitions[key]
      proj4.defs(`EPSG:${definition.type}`, definition.proj4)
    }
  }
  register(proj4)
}

const initMap = () => {
  if (mapInitialized.value) return

  const view = createView()
  const controls = createControls()
  map.value = new Map({
    target: 'map',
    controls,
    view,
  })

  registerForZoomChanged()
  if (map.value) {
    map.value.on('singleclick', handleSingleClick)
  }
  mapInitialized.value = true

  // Process any pending operations
  pendingOperations.value.forEach(op => op())
  pendingOperations.value = []
}

const safeMapOperation = (operation) => {
  if (mapInitialized.value) {
    operation()
  } else {
    pendingOperations.value.push(operation)
  }
}

const registerForZoomChanged = () => {
  if (!map.value) return

  map.value.on('moveend', () => {
    const newValue = view.getZoom()
    if (zoom.value !== newValue) {
      mapStore.setZoom(newValue)
    }
  })

  const view = map.value.getView()
  view.on('change:resolution', () => {
    const newValue = map.value.getView().getZoom()
    if (zoom.value !== newValue) {
      mapStore.setZoom(newValue)
    }
  })
}

const createView = () => {
  const settings = { ...view }
  settings.center = [settings.centerX, settings.centerY]
  delete settings.centerX
  delete settings.centerY
  settings.projection = getProjection(settings.projection)
  return new View(settings)
}

const createControls = () => {
  return [
    new ScaleLine({
      units: 'metric',
    }),
  ]
}

const addLayer = (layer) => {
  safeMapOperation(() => {
    map.value.addLayer(layer)
  })
}

const removeLayer = (layer) => {
  safeMapOperation(() => {
    map.value.removeLayer(layer)
  })
}

const addOverlay = (overlay) => {
  safeMapOperation(() => {
    map.value.addOverlay(overlay)
  })
}

const removeOverlay = (overlay) => {
  safeMapOperation(() => {
    map.value.removeOverlay(overlay)
  })
}

const focus = ({ target }) => {
  safeMapOperation(() => {
    if (target) {
      map.value.getView().fit(target, { padding: [100, 100, 50, 50] })
    }
  })
}

const handleSingleClick = async (pointerEvent) => {
  const currentZoom = map.value.getView().getZoom()
  console.log('handleSingleClick', currentZoom, zoomConfig.oerebLayer)
  if (currentZoom < zoomConfig.oerebLayer) return

  mapStore.setSkipZoomWatch(true)
  const transformedXYCoordinate = transform(
    pointerEvent.coordinate,
    'EPSG:2056',
    'EPSG:4326',
  )

  const globalCoordinate = {
    latitude: transformedXYCoordinate[1],
    longitude: transformedXYCoordinate[0],
  }
  const swissCoordinate = {
    longitude: pointerEvent.coordinate[0],
    latitude: pointerEvent.coordinate[1],
  }

  await mapStore.previewCoordinate({
    globalCoordinate,
    swissCoordinate,
  })
}

watch(() => zoom.value, (newValue) => {
  if (map.value && !skipZoomWatch?.value) {
    const view = map.value.getView()
    if (view.getZoom() !== newValue) {
      view.setZoom(newValue)
    }
  }

  if (skipZoomWatch?.value) {
    mapStore.setSkipZoomWatch(false)
  }
}, { immediate: true, deep: true })

watch(() => jumpToCoordinates.value, (swissCoordinates) => {
  if (map.value && swissCoordinates) {
    mapStore.setSkipZoomWatch(true)
    const view = map.value.getView()
    view.setCenter(swissCoordinates)
    mapStore.setZoom(18)
  }
}, { immediate: true, deep: true })

watch(() => props.visible, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    render()
  }
}, { deep: true })

onBeforeMount(() => {
  registerSwissProjections()
})

onMounted(() => {
  nextTick(() => {
    initMap()
  })
})

const render = () => {
  nextTick(() => {
    if (map.value) {
      map.value.updateSize()
    }
  })
}
</script>
