<template>
  <div class="accordion" :class="{ decent: isDecent }">
    <slot />
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import decent from '~/mixins/decent'

export default {
  mixins: [decent],

  provide() {
    return {
      accordionActiveItem: this.activeItem,
    }
  },

  data() {
    return {
      accordion: true, // mark this component as accordion
      activeItem: ref(null),
    }
  },

  created() {
    this.$on('item-clicked', this.handleItemClicked)
    this.$on('item-show', this.handleItemShow)
  },

  methods: {
    handleItemClicked(id) {
      this.activeItem.value = this.activeItem.value !== id ? id : null
    },

    handleItemShow(id) {
      this.activeItem.value = id
    },
  },
}
</script>
