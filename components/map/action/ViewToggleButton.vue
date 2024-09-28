<template>
  <div>
    <div v-if="isSatelliteView">
      <MapActionMapViewButton />
    </div>
    <div v-else>
      <MapActionSatelliteViewButton />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useMapStore } from '~/store/map'

// Use the map store
const mapStore = useMapStore()

// Destructure and make reactive refs from the store
const { isSatelliteView } = storeToRefs(mapStore)
</script>
