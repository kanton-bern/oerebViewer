<template>
  <MapActionButton @clicked="zoomInActionClicked">
    <MapActionButtonSvg>
      <path
        d="M16 2.667q0.552 0 0.943 0.391t0.391 0.943v10.667h10.667q0.552 0 0.943 0.391t0.391 0.943-0.391 0.943-0.943 0.391h-10.667v10.667q0 0.552-0.391 0.943t-0.943 0.391-0.943-0.391-0.391-0.943v-10.667h-10.667q-0.552 0-0.943-0.391t-0.391-0.943 0.391-0.943 0.943-0.391h10.667v-10.667q0-0.552 0.391-0.943t0.943-0.391z"
      />
    </MapActionButtonSvg>
  </MapActionButton>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('map', ['zoomInActionClicked']),
  },
}
</script>
