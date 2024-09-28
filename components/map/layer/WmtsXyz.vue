<template>
  <div>XYZ</div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { XYZ } from 'ol/source'
import TileLayer from 'ol/layer/Tile'

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

const layer = ref(null)

watch(() => props.visible, (newVisible) => {
  layer.value.setVisible(newVisible)
})

const validateOrThrow = (settings) => {
  if (settings.sourceType !== 'XYZ') {
    throwError('invalid configuration')
  }

  if (typeof settings.sourceUrl !== 'string' || !settings.sourceUrl) {
    throwError('sourceUrl required')
  }
}

const throwError = (message) => {
  const context = {
    layerId: props.id,
    component: 'WmtsXyz',
    ...props.settings,
  }
  console.error(`Error: ${message}`, context)
  throw new Error(
    `${message} (layerId: ${context.layerId}, component: ${context.component})`,
  )
}

// Create the layer
const settings = {
  visible: props.visible,
  ...props.settings,
}

validateOrThrow(settings)

const source = new XYZ({
  url: settings.sourceUrl,
})

delete settings.sourceUrl
delete settings.sourceType

layer.value = new TileLayer({
  id: props.id,
  ...settings,
  source,
})

if (!layer.value) {
  throwError('invalid layer settings')
}

// Lifecycle hooks
onMounted(() => {
  emit('layeradded', layer.value)
})

onUnmounted(() => {
  emit('layerremoved', layer.value)
})
</script>
