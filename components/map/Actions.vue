<template>
  <div class="absolute top-4 right-4">
    <div class="relative">
      <div class="flex flex-col space-y-2">
        <div>
          <SearchButton />
        </div>
        <div>
          <ShowMyLocationButton />
        </div>

        <div>
          <CenterObjectButton />
        </div>

        <div>
          <ZoomInButton />
        </div>

        <div>
          <ZoomOutButton />
        </div>

        <div>
          <ViewToggleButton />
        </div>
      </div>

      <div
        v-show="$store.state.map.isSearchVisible"
        class="absolute top-0 right-16"
      >
        <MapSearchControl />
      </div>
    </div>
  </div>
</template>

<script>
import SearchButton from '~/components/map/action/SearchButton.vue'
import ShowMyLocationButton from '~/components/map/action/ShowMyLocationButton.vue'
import CenterObjectButton from '~/components/map/action/CenterObjectButton.vue'
import ZoomInButton from '~/components/map/action/ZoomInButton.vue'
import ZoomOutButton from '~/components/map/action/ZoomOutButton.vue'
import ViewToggleButton from '~/components/map/action/ViewToggleButton.vue'

export default {
  components: {
    SearchButton,
    ShowMyLocationButton,
    CenterObjectButton,
    ZoomInButton,
    ZoomOutButton,
    ViewToggleButton,
  },
}
</script>
