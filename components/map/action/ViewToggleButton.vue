<template>
  <div>
    <div v-show="isSatelliteView">
      <MapViewButton />
    </div>
    <div v-show="isMapView">
      <SatelliteViewButton />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MapViewButton from './MapViewButton.vue'
import SatelliteViewButton from './SatelliteViewButton.vue'

export default {
  components: {
    MapViewButton,
    SatelliteViewButton,
  },

  computed: {
    ...mapGetters('map', ['isSatelliteView', 'isMapView']),
  },
}
</script>
