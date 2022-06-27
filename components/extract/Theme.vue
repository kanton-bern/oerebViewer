<template>
  <div>
    <LayoutAccordion v-if="subThemes.length">
      <LayoutAccordionItem
        v-for="theme in subThemes"
        :key="`subtheme-${theme.SubCode}`"
        :header="theme.Text | multilingualtext"
      >
        <ExtractRestrictions :code="theme.SubCode" />
      </LayoutAccordionItem>
    </LayoutAccordion>
    <ExtractRestrictions v-else :code="code" />
  </div>
</template>

<script>
import loadedextract from '~/mixins/loadedextract'

export default {
  mixins: [loadedextract],

  props: {
    code: {
      type: String,
      required: true,
    },
  },

  computed: {
    subThemes() {
      return this.$store.getters['property/subThemesByCode'](this.code) || []
    },
  },
}
</script>
