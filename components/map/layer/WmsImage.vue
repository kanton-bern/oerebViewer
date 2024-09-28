<template>
  <div />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import ImageLayer from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'
import { useMapStore } from '~/store/map'

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  opacity: {
    type: Number,
    default: 1,
  },
  settings: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['layeradded', 'layerremoved'])

const mapStore = useMapStore()
const esriToken = computed(() => mapStore.esriToken)

const layer = ref(null)
const mounted = ref(false)

function createLayer() {
  const settings = {
    opacity: props.opacity,
    visible: props.visible,
    url: props.settings.sourceUrl,
    serverType: 'geoserver',
    ...props.settings,
  }

  validateOrThrow(settings)

  if (esriToken.value) {
    settings.url += `?token=${esriToken.value}`
  }
  delete settings.sourceType
  delete settings.sourceUrl
  delete settings.capabilityLayer
  delete settings.capabilityMatrixSet

  const newLayer = new ImageLayer({
    ...settings,
    source: new ImageWMS(settings),
  })

  if (!newLayer) {
    throwError('invalid layer settings')
  }

  newLayer.setZIndex(50)

  return newLayer
}

function onMountedHandler() {
  if (layer.value && mounted.value) {
    emit('layeradded', layer.value)
  }
}

function onUnmountedHandler() {
  if (!layer.value) return
  emit('layerremoved', layer.value)
}

function validateOrThrow(settings) {
  if (typeof settings.sourceUrl !== 'string' || !settings.sourceUrl) {
    throwError('sourceUrl required')
  }
}

function throwError(message) {
  const context = {
    layerId: props.id,
    component: 'WmsImage',
    ...props.settings,
  }
  console.error(message, context)
  throw new Error(
    `Error: ${message} (layerId: ${context.layerId}, component: ${context.component})`,
  )
}

onMounted(async () => {
  mounted.value = true
  layer.value = await createLayer()
  onMountedHandler()
})

onUnmounted(() => {
  mounted.value = false
  onUnmountedHandler()
})

watch(esriToken, async () => {
  const newLayer = await createLayer()

  if (mounted.value) {
    onUnmountedHandler()
  }

  layer.value = newLayer
  onMountedHandler()
})

watch(() => props.visible, (newVisible) => {
  if (layer.value) {
    layer.value.setVisible(newVisible)
  }
})
</script>
