<script setup>
import { useAppStore } from '~/store/app'
import { onMounted } from 'vue'

const appStore = useAppStore()

const toggleMenu = () => {
  appStore.toggleMenuOpen()
}

onMounted(() => {
  if (window.innerWidth >= 1024) {
    appStore.setMenuOpen(true)
  }
})
</script>

<template>
  <button
    class="flex items-center gap-2 md:gap-4"
    @click="toggleMenu"
  >
    <IconMenu class="w-6 h-6" />
    {{ $t('menu') }}
  </button>
</template>
