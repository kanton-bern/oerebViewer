<template>
  <div class="z-20 h-full relative p-7 bg-theme-thirdly overflow-y-auto">
    <h1 class="text-theme-secondary text-3xl mt-16 font-bold">
      {{ $t(titleKey) }}
    </h1>
    <div>
      <slot />
    </div>
    <LayoutCloseButton
      class="fixed top-24 right-7"
      @clicked="emitCloseClicked"
    />
  </div>
</template>

<script setup>
defineProps({
  titleKey: {
    required: true,
    type: String,
  },
})

const emit = defineEmits(['close-clicked'])

const emitCloseClicked = () => {
  emit('close-clicked')
}
</script>
