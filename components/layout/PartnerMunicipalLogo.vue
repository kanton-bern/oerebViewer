<template>
  <div class="flex flex-row">
    <div>
      <LayoutPartnerLogo type="municipal" :src="src" />
    </div>
    <div v-if="name">
      <p class="text-theme-secondary">
        {{ $t('imprint_municipality') }} {{ name }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      required: true,
      type: String,
    },

    name: {
      required: false,
      type: String,
      default: '',
    },
  },
}
</script>
