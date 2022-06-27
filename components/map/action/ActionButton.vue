<template>
  <button
    class="p-2 bg-theme-primary text-theme-primary bg-opacity-90 rounded"
    @click="$emit('clicked')"
  >
    <slot />
  </button>
</template>
