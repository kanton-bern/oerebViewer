<template>
  <div v-if="loadedExtract" class="text-center">
    {{ $t('detail_header', templateVars) }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLoadedExtract } from '~/composables/useLoadedExtract'
import { extractToTemplateVars } from '~/helpers/transformers'

const { loadedExtract } = useLoadedExtract()

const templateVars = computed(() => {
  if (!loadedExtract.value) return {}
  return extractToTemplateVars(loadedExtract.value)
})
</script>
