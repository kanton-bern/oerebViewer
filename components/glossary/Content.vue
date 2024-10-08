<template>
  <LayoutClosablePage title-key="glossary_title" @close-clicked="closeGlossary">
    <section v-if="loadedExtract" class="block sm:flex flex-wrap">
      <div
        v-for="glossaryItem in loadedExtract.Glossary"
        :key="multilingualText(glossaryItem.Title)"
        class="item"
      >
        <LayoutInformationSection
          :title="multilingualText(glossaryItem.Title)"
        >
          {{ multilingualText(glossaryItem.Content) }}
        </LayoutInformationSection>
      </div>
    </section>
  </LayoutClosablePage>
</template>

<script setup>
import { onBeforeUnmount } from 'vue'
import { useAppStore } from '~/store/app'
import { useMapStore } from '~/store/map'
import { useLoadedExtract } from '~/composables/useLoadedExtract'
import { useMultilingualText } from '~/composables/useMultilingualText'

const { multilingualText } = useMultilingualText()

const appStore = useAppStore()
const mapStore = useMapStore()

const { loadedExtract } = useLoadedExtract()

const closeGlossary = () => {
  mapStore.closeGlossary()
}

onBeforeUnmount(() => {
  appStore.setMenuOpen(true)
})
</script>

<style lang="scss" scoped>
section .item {
  width: 100%;
  flex-basis: 50%;
  padding-right: 10%;
}
</style>
