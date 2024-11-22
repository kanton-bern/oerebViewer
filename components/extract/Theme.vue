<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePropertyStore } from '~/store/property'
import { useMultilingualText } from '~/composables/useMultilingualText'

const { multilingualText } = useMultilingualText()

const propertyStore = usePropertyStore()
const { getSubThemesByCode } = propertyStore

// Define an interface for the theme object
interface Theme {
  SubCode: string
  Text: [
    {
      Language: string,
      Text: string,
    },
  ],
  Code: string,
}

// Props
const props = defineProps({
  code: {
    type: String as () => string,
    required: true,
  },
})

const subThemes = ref<Theme[]>([])

onMounted(async () => {
  const subThemesTemp = await getSubThemesByCode(props.code)
  subThemes.value = subThemesTemp as Theme[]
})

</script>

<template>
  <div>
    <LayoutAccordion v-if="subThemes.length">
      <LayoutAccordionItem
        v-for="theme in subThemes"
        :key="`subtheme-${theme.SubCode}`"
        :header="multilingualText(theme.Text)"
      >
        <ExtractRestrictions :code="theme.SubCode" />
      </LayoutAccordionItem>
    </LayoutAccordion>
    <ExtractRestrictions v-else :code="code" />
  </div>
</template>
