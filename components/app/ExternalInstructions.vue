<template>
  <div>
    <a v-if="url" :href="url" class="flex items-center gap-2 hover:underline">
      {{ $t('external_instructions') }}
      <IconOpen class="w-4 h-4 shrink-0" />
    </a>
  </div>
</template>

<script>
import { externalInstructions } from '~/config/setup'

export default {
  data: () => ({
    url: externalInstructions.instructionUrl,
  }),
}
</script>
