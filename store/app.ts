import { defineStore } from 'pinia'
import { getLocales } from '~/config/setup.js'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isMenuOpen = ref(false)
  const locales = ref([])

  async function initializeStore() {
    locales.value = await getLocales()
  }

  function toggleMenuOpen() {
    isMenuOpen.value = !isMenuOpen.value
  }

  function setMenuOpen(open: boolean) {
    isMenuOpen.value = open
  }

  return {
    isMenuOpen,
    locales,
    initializeStore,
    toggleMenuOpen,
    setMenuOpen,
  }
})
