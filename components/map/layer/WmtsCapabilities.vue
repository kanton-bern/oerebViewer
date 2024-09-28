<template>
  <div />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useMapStore } from '~/store/map'
import TileLayer from 'ol/layer/Tile'
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS'
import WMTSCapabilities from 'ol/format/WMTSCapabilities'

const props = defineProps({
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
})

const emit = defineEmits(['layeradded', 'layerremoved'])

const mapStore = useMapStore()
const wmtsOptions = ref(null)
const layer = ref(null)
const mounted = ref(false)

const esriToken = computed(() => mapStore.esriToken)

const createLayer = async () => {
  const settings = {
    visible: props.visible,
    ...props.settings,
  }

  await validateOrThrow(settings)

  if (esriToken.value) {
    settings.sourceUrl += `?token=${esriToken.value}`
  }

  const response = await fetch(settings.sourceUrl)
  const text = await response.text()

  if (!text) throwError('could not load capabilities')

  const parser = new WMTSCapabilities()
  const result = parser.read(text)

  wmtsOptions.value = optionsFromCapabilities(result, {
    layer: settings.capabilityLayer,
    matrixSet: settings.capabilityMatrixSet,
  })

  if (esriToken.value) {
    for (let i = 0; i < wmtsOptions.value.urls.length; i++) {
      wmtsOptions.value.urls[i] += '?token=' + esriToken.value
    }
  }

  delete settings.sourceType
  delete settings.sourceUrl
  delete settings.capabilityLayer
  delete settings.capabilityMatrixSet

  const source = new WMTS(wmtsOptions.value)

  const layer = new TileLayer({
    ...settings,
    source,
  })


  if (!layer) {
    throwError('invalid layer settings')
  }

  return layer
}

watch(esriToken, async () => {
  const newLayer = await createLayer()

  if (mounted.value) {
    onUnmountedHandler()
  }

  layer.value = newLayer
  onMountedHandler()
})

watch(() => props.visible, () => {
  if (layer.value) {
    layer.value.setVisible(props.visible)
  }
})

onMounted(async () => {
  layer.value = await createLayer()
  mounted.value = true
  onMountedHandler()
})

onUnmounted(() => {
  mounted.value = false
  onUnmountedHandler()
})

const onMountedHandler = () => {
  if (layer.value && mounted.value) {
    emit('layeradded', layer.value)
  }
}

const onUnmountedHandler = () => {
  if (!layer.value) return
  emit('layerremoved', layer.value)
}

const validateOrThrow = (settings) => {
  if (settings.sourceType !== 'Capabilities') {
    throwError('sourceType should be "Capabilities"')
  }

  if (typeof settings.sourceUrl !== 'string' || !settings.sourceUrl) {
    throwError('sourceUrl required')
  }

  if (
    typeof settings.capabilityLayer !== 'string' ||
    !settings.capabilityLayer
  ) {
    throwError('capabilityLayer required')
  }

  if (
    typeof settings.capabilityMatrixSet !== 'string' ||
    !settings.capabilityMatrixSet
  ) {
    throwError('capabilityMatrixSet required')
  }
}

const throwError = (message) => {
  const context = {
    layerId: props.id,
    component: 'WmtsCapabilities',
    ...props.settings,
  }
  console.error(message, context)
  throw new Error(
    `Error: ${message} (layerId: ${context.layerId}, component: ${context.component})`,
  )
}
</script>
