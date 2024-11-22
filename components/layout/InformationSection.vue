<template>
  <div>
    <h3>{{ title }}</h3>
    <p class="text-theme-secondary"><slot /></p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    required: true,
    type: String,
  },
})
</script>

<style lang="scss" scoped>
h3 {
  @apply text-lg font-bold mt-7 mb-3 text-theme-secondary;
}
</style>
