<template>
  <div>
    <MapActionButton @clicked="toggleSearchVisibility">
      <MapActionButtonSvg>
        <path
          d="M13.333 1.333q2.438 0 4.661 0.953t3.828 2.557 2.557 3.828 0.953 4.661q0 2.094-0.682 4.010t-1.943 3.479l7.573 7.563q0.385 0.385 0.385 0.948 0 0.573-0.38 0.953t-0.953 0.38q-0.563 0-0.948-0.385l-7.563-7.573q-1.563 1.26-3.479 1.943t-4.010 0.682q-2.438 0-4.661-0.953t-3.828-2.557-2.557-3.828-0.953-4.661 0.953-4.661 2.557-3.828 3.828-2.557 4.661-0.953zM13.333 4q-1.896 0-3.625 0.74t-2.979 1.99-1.99 2.979-0.74 3.625 0.74 3.625 1.99 2.979 2.979 1.99 3.625 0.74 3.625-0.74 2.979-1.99 1.99-2.979 0.74-3.625-0.74-3.625-1.99-2.979-2.979-1.99-3.625-0.74z"
        />
      </MapActionButtonSvg>
    </MapActionButton>
  </div>
</template>


<script setup>
import { useMapStore } from '~/store/map'

const mapStore = useMapStore()
const { toggleSearchVisibility } = mapStore
</script>
