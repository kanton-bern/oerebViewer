<template>
  <div>
    <MapActionButton @clicked="setMapView">
      <MapActionButtonSvg>
        <path
          d="M21.333 6.667l10.667-6.667v25.333l-10.667 6.667-10.667-6.667-10.667 6.667v-25.333l10.667-6.667zM9.333 23.021v-19.031l-6.667 4.167v19.031zM20 8.979l-8-5.010v19.052l8 5v-19.042zM29.333 23.854v-19.042l-6.667 4.167v19.042z"
        />
      </MapActionButtonSvg>
    </MapActionButton>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('map', ['setMapView']),
  },
}
</script>
