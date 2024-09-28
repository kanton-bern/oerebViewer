<script setup>
import { watch } from 'vue'
import { useLoadedExtract } from '~/composables/useLoadedExtract'
import { useMultilingualText } from '~/composables/useMultilingualText'

const emit = defineEmits(['item-show'])

// Store
const { loadedExtract } = useLoadedExtract()
const { multilingualText }= useMultilingualText()

// Methods
const openActiveTheme = () => {
  emit('item-show', 'accordion-item-concerned-themes')
}

// Watch
watch(loadedExtract, (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    openActiveTheme()
  }
})
</script>

<template>
  <div v-if="loadedExtract">
    <LayoutAccordionItem
      id="accordion-item-concerned-themes"
      :header="$t('detail_concerned_themes')"
      header-class="3xl:text-lg"
      :tag="loadedExtract.ConcernedTheme.length"
    >
      <LayoutAccordion>
        <LayoutAccordionItem
          v-for="theme in loadedExtract.ConcernedTheme"
          :key="`active-${theme.Code}`"
          :header="multilingualText(theme.Text)"
        >
          <ExtractTheme :code="theme.Code" />
        </LayoutAccordionItem>
      </LayoutAccordion>
    </LayoutAccordionItem>

    <LayoutAccordionItem
      :header="$t('detail_no_restrictions')"
      header-class="3xl:text-lg"
      :tag="loadedExtract.NotConcernedTheme.length"
      :decent="true"
    >
      <LayoutAccordion>
        <LayoutAccordionItem
          v-for="theme in loadedExtract.NotConcernedTheme"
          :key="`inactive-${theme.Code}`"
          :header="multilingualText(theme.Text)"
          :disabled="true"
        />
      </LayoutAccordion>
    </LayoutAccordionItem>

    <LayoutAccordionItem
      :header="$t('detail_missing_restrictions')"
      header-class="3xl:text-lg"
      :tag="loadedExtract.ThemeWithoutData.length"
      :decent="true"
    >
      <LayoutAccordion>
        <LayoutAccordionItem
          v-for="theme in loadedExtract.ThemeWithoutData"
          :key="`nodata-${theme.Code}`"
          :header="multilingualText(theme.Text)"
          :disabled="true"
        />
      </LayoutAccordion>
    </LayoutAccordionItem>
  </div>
</template>
