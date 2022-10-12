<template>
  <LayoutClosablePage title-key="glossary_title" @close-clicked="closeGlossary">
    <section v-if="loadedExtract" class="block sm:flex flex-wrap">
      <div
        v-for="glossaryItem in loadedExtract.Glossary"
        :key="glossaryItem.Title | multilingualtext"
        class="item"
      >
        <LayoutInformationSection
          :title="glossaryItem.Title | multilingualtext"
          >{{
            glossaryItem.Content | multilingualtext
          }}</LayoutInformationSection
        >
      </div>
    </section>
  </LayoutClosablePage>
</template>

<script>
import { mapActions } from 'vuex'
import loadedextract from '~/mixins/loadedextract'

export default {
  mixins: [loadedextract],

  beforeDestroy() {
    this.$store.commit('app/setMenuOpen', true)
  },

  methods: {
    ...mapActions('map', ['closeGlossary']),
  },
}
</script>

<style lang="scss" scoped>
section .item {
  width: 100%;
  flex-basis: 50%;
  padding-right: 10%;
}
</style>
