import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Extract } from '~/types/extractdata'
import { extractToTemplateVars } from '~/helpers/transformers'

export const useHistoryStore = defineStore('history', () => {
  const properties = ref([])

  function addProperty(extract: Extract, language: string) {
    const languagePrefix = language !== 'de' ? `/${language}` : ''

    if (!extract.RealEstate) {
      return
    }

    const entry = extractToTemplateVars(extract, {
      url: `${languagePrefix}/d/${extract.RealEstate.EGRID}`,
    })

    if (Array.isArray(properties.value)) {
      properties.value = properties.value.filter((e: { EGRID?: string }) => e.EGRID !== entry.EGRID)
      properties.value.unshift(entry as never)
      properties.value = properties.value.slice(0, 10)
    } else {
      properties.value = [entry as never]
    }
  }

  return {
    properties,
    addProperty,
  }
}, {
  persist: {
    key: 'history',
    pick: ['properties'],
  },
})
