<template>
  <div>
    <MapActionButton @clicked="zoomOutActionClicked">
      <MapActionButtonSvg>
        <path
          d="M4 14.667h24q0.552 0 0.943 0.391t0.391 0.943-0.391 0.943-0.943 0.391h-24q-0.552 0-0.943-0.391t-0.391-0.943 0.391-0.943 0.943-0.391z"
        />
      </MapActionButtonSvg>
    </MapActionButton>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('map', ['zoomOutActionClicked']),
  },
}
</script>
