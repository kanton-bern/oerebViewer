<!-- components/Accordion.vue -->
<template>
  <div class="accordion" :class="{ decent: isDecent }">
    <slot />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useDecent } from '~/composables/useDecent'

const props = defineProps({
  decent: {
    type: Boolean,
    default: false,
  },
})

const { isDecent } = useDecent(props)

const activeItem = ref(null)

const toggleItem = (id) => {
  activeItem.value = activeItem.value !== id ? id : null
}

provide('accordionActiveItem', activeItem)
provide('toggleAccordionItem', toggleItem)

const handleItemShow = (id) => {
  activeItem.value = id
}

defineExpose({
  handleItemShow,
})
</script>
