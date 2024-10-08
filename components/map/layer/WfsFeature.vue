<template>
  <div />
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import WFS from 'ol/format/WFS'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Stroke, Fill, Style } from 'ol/style'

const props = defineProps({
  id: {
    required: true,
    type: String,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  features: {
    type: [String, Object],
    required: false,
    default: null,
  },
  fillColor: {
    type: String,
    required: true,
  },
  strokeColor: {
    type: String,
    required: true,
  },
  strokeWidth: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['layeradded', 'layerremoved', 'layerfocus'])

const layer = ref(null)
const source = ref(null)
const mounted = ref(false)

const createLayer = () => {
  if (!props.features) return

  let vectorSource = new VectorSource()

  if (typeof props.features === 'object') {
    source.value = [props.features]
    vectorSource.addFeature(props.features)
  } else {
    const features = new WFS().readFeatures(props.features)
    source.value = features

    vectorSource = new VectorSource({
      features,
    })
  }

  layer.value = new VectorLayer({
    id: props.id,
    source: vectorSource,
    zIndex: 5000,
    style: new Style({
      stroke: new Stroke({
        color: props.strokeColor,
        width: props.strokeWidth,
      }),
      fill: new Fill({
        color: props.fillColor,
      }),
    }),
  })

  if (!layer.value) {
    throwError('invalid layer settings')
  }
}

const throwError = (message) => {
  const context = {
    layerId: props.id,
    component: 'WfsFeature',
  }
  console.error(`Error: ${message}`, context)
  throw new Error(
    `${message} (layerId: ${context.layerId}, component: ${context.component})`,
  )
}

const onMountedHandler = () => {
  if (layer.value && mounted.value) {
    emit('layeradded', layer.value)
  }
}

const onUnmountedHandler = () => {
  if (!layer.value) return
  emit('layerremoved', layer.value)
}

const onFocus = () => {
  if (!layer.value) return
  emit('layerfocus', {
    target: source.value?.[0]?.getGeometry(),
  })
}

watch(() => props.visible, (newVisible) => {
  layer.value.setVisible(newVisible)
})

watch(() => props.features, () => {
  onUnmountedHandler()
  createLayer()
  onMountedHandler()
  onFocus()
})

// Lifecycle hooks
onMounted(() => {
  createLayer()
  mounted.value = true
  onMountedHandler()
  onFocus()
})

onUnmounted(() => {
  mounted.value = false
  onUnmountedHandler()
})

// Initial layer creation
createLayer()
onMountedHandler()
</script>
