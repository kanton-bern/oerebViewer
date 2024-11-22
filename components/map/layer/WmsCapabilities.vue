<template>
  <div />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useMapStore } from '~/store/map'
import ImageLayer from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'

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
const esriToken = computed(() => mapStore.esriToken)
const layer = ref(null)
const mounted = ref(false)

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

onMounted(async () => {
  layer.value = await createLayer()
  mounted.value = true
  onMountedHandler()
})

onUnmounted(() => {
  mounted.value = false
  onUnmountedHandler()
})

async function createLayer() {
  const settings = {
    visible: props.visible,
    url: props.settings.sourceUrl,
    params: {
      LAYERS: props.settings.capabilityLayer,
    },
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

  const imageWMSSettings = {
    ...settings,
    params: {
      ...settings.params,
      FORMAT: 'image/png',
    },
    ratio: 1,
    pixelRatio: 2,
    imageSmoothing: true,
  }

  const source = new ImageWMS(imageWMSSettings)

  const newLayer = new ImageLayer({
    ...settings,
    source,
  })

  newLayer.set('id', props.id)

  if (!newLayer) {
    throwError('invalid layer settings')
  }

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
  if (settings.sourceType !== 'Capabilities') {
    throwError('sourceType should be "Capabilities"')
  }
  if (typeof settings.sourceUrl !== 'string' || !settings.sourceUrl) {
    throwError('sourceUrl required')
  }
  if (typeof settings.capabilityLayer !== 'string' || !settings.capabilityLayer) {
    throwError('capabilityLayer required')
  }
}

function throwError(message) {
  const context = {
    layerId: props.id,
    component: 'WmsCapabilities',
    ...props.settings,
  }
  console.error(message, context)
  throw new Error(
    `Error: ${message} (layerId: ${context.layerId}, component: ${context.component})`,
  )
}
</script>
