<template>
  <div v-if="loadedExtract" class="text-center">
    {{ $t('detail_header', templateVars) }}
  </div>
</template>

<script>
import { extractToTemplateVars } from '~/helpers/transformers'
import loadedextract from '~/mixins/loadedextract'

export default {
  mixins: [loadedextract],

  computed: {
    templateVars() {
      if (!this.loadedExtract) return {}

      return extractToTemplateVars(this.loadedExtract)
    },
  },
}
</script>
