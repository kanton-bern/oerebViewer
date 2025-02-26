<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getExternalInstructions } from '~/config/setup'
import { stringTemplate } from '~/helpers/template'
import IconOpen from '~/components/icon/Open.vue'

const { locale } = useI18n()

const externalInstructions = await getExternalInstructions()

const url = computed(() => {
  return externalInstructions.instructionUrl
    ? stringTemplate(externalInstructions.instructionUrl, {
      language: locale.value,
      languageUppercase: locale.value.toUpperCase(),
    })
    : false
})
</script>

<template>
  <div>
    <a v-if="url" :href="url" class="flex items-center gap-2 hover:underline">
      {{ $t('external_instructions') }}
      <IconOpen class="w-4 h-4 shrink-0" />
    </a>
  </div>
</template>
