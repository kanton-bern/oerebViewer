<template>
  <div>
    <a v-if="url" :href="url" class="flex items-center gap-2 hover:underline">
      {{ $t('external_instructions') }}
      <IconOpen class="w-4 h-4 shrink-0" />
    </a>
  </div>
</template>

<script>
import { externalInstructions, stringTemplate } from '~/config/setup'

export default {
  computed: {
    url() {
      return stringTemplate(externalInstructions.instructionUrl, {
        language: this.$i18n.locale,
        languageUppercase: this.$i18n.locale.toUpperCase(),
      })
    },
  },
}
</script>
