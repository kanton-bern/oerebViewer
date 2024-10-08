<template>
  <div class="hidden" />
</template>

<script setup>
import { useRoute, useRouter, onMounted, watch } from '#imports'
import { usePropertyStore } from '~/store/property'
import { useMapStore } from '~/store/map'
import { useAppStore } from '~/store/app'

const route = useRoute()
const router = useRouter()

const propertyStore = usePropertyStore()
const mapStore = useMapStore()
const appStore = useAppStore()

definePageMeta({
})

onMounted(async () => {
  await Promise.all([
    propertyStore.initializeStore(),
    mapStore.initializeStore(),
    appStore.initializeStore(),
  ])
})

watch(() => route.path, (path) => {
  if (path.includes('!')) {
    router.push(path.replace('!/', '').replace('//', ''))
    return
  }

  propertyStore.showActiveExtract(path)
}, { immediate: true })
</script>
