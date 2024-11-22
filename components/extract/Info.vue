<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { extractToTemplateVars } from '~/helpers/transformers'
import { useLoadedExtract } from '~/composables/useLoadedExtract'
import { useMultilingualText } from '~/composables/useMultilingualText'

const { multilingualText } = useMultilingualText()

const { t } = useI18n()

// Store
const { loadedExtract } = useLoadedExtract()

// Computed
const templateVars = computed(() => {
  if (!loadedExtract.value) return {}
  return extractToTemplateVars(loadedExtract.value)
})

const updateDate = computed(() => {
  if (!loadedExtract.value?.UpdateDateCS) return '-'
  const date = new Date(loadedExtract.value.UpdateDateCS)
  return date.toLocaleDateString('de-CH')
})
</script>

<template>
  <LayoutAccordionItem
    v-if="loadedExtract"
    :header="t('detail_property_info', templateVars)"
    header-class="3xl:text-lg"
  >
    <div class="grid divide-y divide-dotted text-l leading-none">
      <div class="px-3 py-2 flex gap-3 w-full">
        <div class="text-theme-decent w-36 lg:w-44">
          {{ $t('detail_real_estate_nr', templateVars) }}
        </div>
        <div>{{ loadedExtract.RealEstate.Number }}</div>
      </div>

      <div class="px-3 py-2 flex gap-3 w-full">
        <div class="text-theme-decent w-36 lg:w-44">
          {{ $t('detail_property_type', templateVars) }}
        </div>
        <div>{{ multilingualText(loadedExtract.RealEstate.Type.Text) }}</div>
      </div>

      <div class="px-3 py-2 flex gap-3 w-full">
        <div class="text-theme-decent w-36 lg:w-44">
          {{ $t('detail_egrid', templateVars) }}
        </div>
        <div>{{ loadedExtract.RealEstate.EGRID }}</div>
      </div>

      <div class="px-3 py-2 flex gap-3 w-full">
        <div class="text-theme-decent w-36 lg:w-44 whitespace-nowrap">
          {{ $t('detail_municipality_bfs', templateVars) }}
        </div>
        <div>
          {{
            `${loadedExtract.RealEstate.MunicipalityName} (${loadedExtract.RealEstate.MunicipalityCode})`
          }}
        </div>
      </div>

      <div class="px-3 py-2 flex gap-3 w-full">
        <div class="text-theme-decent w-36 lg:w-44">
          {{ $t('detail_sub_unit_of_land_register', templateVars) }}
        </div>
        <div>{{ loadedExtract.RealEstate.SubunitOfLandRegister || '-' }}</div>
      </div>

      <div class="px-3 py-2 flex gap-3 w-full">
        <div class="text-theme-decent w-36 lg:w-44">
          {{ $t('detail_real_estate_area', templateVars) }}
        </div>
        <div>{{ loadedExtract.RealEstate.LandRegistryArea }} m<sup>2</sup></div>
      </div>

      <div class="px-3 py-2 flex gap-3 w-full">
        <div class="text-theme-decent w-36 lg:w-44">
          {{ $t('detail_updated_date', templateVars) }}
        </div>
        <div>{{ updateDate }}</div>
      </div>

      <div v-if="loadedExtract.ownerUrl" class="px-3 py-2 w-full">
        <a
          :href="loadedExtract.ownerUrl"
          target="_blank"
          class="flex items-center gap-2 hover:underline"
          :title="t('detail_owner_info', templateVars)"
        >
          {{ $t('detail_owner_info', templateVars) }}
          <IconOpen class="w-4 h-4 flex-shrink-0" />
        </a>
      </div>
    </div>
  </LayoutAccordionItem>
</template>
