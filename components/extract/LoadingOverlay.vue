<template>
  <div
    :class="{ hidden: !isLoading }"
    class="absolute top-0 left-0 w-full h-full bg-white bg-opacity-30 flex justify-center items-center"
  >
    <IconSpinner class="text-theme-accent" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { usePropertyStore } from '~/store/property'

const propertyStore = usePropertyStore()
const { loading: isLoading } = storeToRefs(propertyStore)
</script>
