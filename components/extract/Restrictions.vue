<template>
  <div class="p-4 overflow-x-hidden">
    <div>
      <div v-if="lawStates.length > 0" class="flex items-center">
        <div
          :class="{
            'text-theme-decent': showChanges,
          }"
        >
          {{ multilingualText(lawStates[0].Text) }}
        </div>
        <template v-if="lawStates.length > 1">
          <LayoutToggle
            v-model="showChanges"
            :title="t('show_changes')"
            class="mx-2"
          />
          <div
            :class="{
              'text-theme-decent': !showChanges,
            }"
          >
            {{ multilingualText(lawStates[1].Text) }}
          </div>
        </template>
      </div>

      <div class="text-l font-bold mt-8">{{ $t('restriction_legend') }}</div>

      <div class="grid gap-x-2 gap-y-4 grid-legend mt-2">
        <template v-for="(restriction, index) in sortedRestrictions" :key="`restrictions-${index}`">
          <div class="flex items-center">
            <img
              :src="restriction.SymbolRef"
              class="hover:scale-150 transition-transform duration-500"
            >
          </div>

          <div>
            {{ multilingualText(wordbreak(restriction.LegendText)) }}
          </div>

          <div>
            <span v-if="restriction.AreaShare" class="whitespace-nowrap">
              {{ restriction.AreaShare }}m² ({{
                restriction.PartInPercent.toFixed(1)
              }}%)
            </span>
            <span v-if="restriction.LengthShare">
              {{ restriction.LengthShare }}m
            </span>
            <span v-if="restriction.NrOfPoints">
              {{ $t('amount') }}: {{ restriction.NrOfPoints }}
            </span>
          </div>
        </template>
      </div>

      <a
        v-if="!disableMapLegendAtWeb && restrictions[0].Map.LegendAtWeb"
        :href="restrictions[0].Map.LegendAtWeb"
        class="flex gap-2 mt-2 hover:underline"
        :title="`${$t(
          'restriction_key_download'
        )} (${multilingualText(restrictions[0].Theme.Text)})`"
      >
        <IconLayers class="w-4 h-4 mt-1 shrink-0" />
        <div>
          {{ $t('restriction_key_download') }} ({{
            multilingualText(restrictions[0].Theme.Text)
          }})
        </div>
      </a>
    </div>
    <div>
      <div v-if="legalProvisions.length" class="text-l font-bold mt-8">
        {{ $t('restriction_legal_provision') }}
      </div>

      <a
        v-for="(document, index) in legalProvisions"
        :key="`legal-${index}`"
        class="flex gap-2 mt-2 hover:underline"
        :href="document.url"
        :title="document.title"
        target="_blank"
      >
        <IconFile class="w-4 h-4 mt-1 shrink-0" />
        <div>
          {{ wordbreak(document.title) }}
        </div>
      </a>
    </div>

    <div>
      <div v-if="laws.length" class="text-l font-bold mt-8">
        {{ $t('restriction_law') }}
      </div>

      <a
        v-for="(document, index) in laws"
        :key="`law-${index}`"
        class="flex gap-2 mt-2 hover:underline"
        :href="document.url"
        :title="document.title"
        target="_blank"
      >
        <IconOpen class="w-4 h-4 mt-1 shrink-0" />
        <div>{{ wordbreak(document.title) }}</div>
      </a>
    </div>

    <div>
      <div v-if="hints.length" class="text-l font-bold mt-8">
        {{ $t('restriction_hint') }}
      </div>

      <Component
        :is="document.url ? 'a' : 'div'"
        v-for="(document, index) in hints"
        :key="`hint-${index}`"
        class="flex gap-2 mt-2"
        :href="document.url"
        :title="document.title"
        target="_blank"
      >
        <IconOpen v-if="document.url" class="w-4 h-4 mt-1 shrink-0" />
        <div>{{ wordbreak(document.title) }}</div>
      </Component>
    </div>

    <div>
      <div class="text-l font-bold mt-8">
        {{ $t('restriction_authority') }}
      </div>

      <a
        v-for="(office, index) in offices"
        :key="`office-${index}`"
        class="flex gap-2 mt-2 hover:underline"
        :href="office.url"
        :title="office.name"
        target="_blank"
      >
        <IconOpen class="w-4 h-4 mt-1 shrink-0" />
        <div>{{ office.name }}</div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePropertyStore } from '~/store/property'
import { useI18n } from 'vue-i18n'
import { getUserInterface } from '~/config/setup'
import { useMultilingualText } from '~/composables/useMultilingualText'
import { useWordbreak } from '~/composables/useWordbreak'

const { multilingualText } = useMultilingualText()
const { wordbreak } = useWordbreak()
const userInterface = await getUserInterface()

// Props
const props = defineProps({
  code: {
    type: String,
    required: true,
  },
})

// Composables
const { t } = useI18n()
const propertyStore = usePropertyStore()

// State
const showChanges = ref(false)
const disableMapLegendAtWeb = ref(userInterface.disableMapLegendAtWeb)

// Store state
const {
  getRestrictionsByThemeCode,
  lawStatesByThemeCode,
} = storeToRefs(propertyStore)

// Computed properties
const sortedRestrictions = computed(() => {
  return restrictions.value.concat().sort((b, a) => {
    return (
      priorityCompare(a, b) ||
      a.AreaShare - b.AreaShare ||
      a.LengthShare - b.LengthShare ||
      a.NrOfPoints - b.NrOfPoints ||
      ('' + b.Information?.[0].Text).localeCompare(
        '' + a.Information?.[0].Text,
      )
    )
  })
})

const legalProvisions = computed(() => collectUniqueDocumentType(restrictions.value, 'LegalProvision'))
const laws = computed(() => collectUniqueDocumentType(restrictions.value, 'Law'))
const hints = computed(() => collectUniqueDocumentType(restrictions.value, 'Hint'))

const offices = computed(() => {
  return restrictions.value
    .reduce((offices, restriction) => {
      offices.push(restriction.ResponsibleOffice)
      return offices
    }, [])
    .map((office) => ({
      name: multilingualText(office.Name),
      url: multilingualText(office.OfficeAtWeb),
    }))
    .filter(
      (v, i, a) =>
        a.findIndex(
          (office) => office.name === v.name && office.url === v.url,
        ) === i,
    )
})

const restrictions = computed(() => {
  const themeRestrictions = getRestrictionsByThemeCode.value(props.code, lawStatusCode.value)
  return themeRestrictions || []
})

const lawStates = computed(() => {
  const order = ['inForce', 'changeWithPreEffect', 'changeWithoutPreEffect']
  return (lawStatesByThemeCode.value(props.code) || [])
    .sort((a, b) => order.indexOf(a.Code) - order.indexOf(b.Code))
})

const lawStatusCode = computed(() =>
  !showChanges.value ? lawStates.value[0]?.Code : lawStates.value[1]?.Code,
)

// Methods
const collectUniqueDocumentType = (restrictions, type) => {
  return restrictions
    .reduce(
      (provisions, restriction) =>
        provisions.concat(restriction.LegalProvisions),
      [],
    )
    .filter((document) => document.Type.Code === type)
    .map((document) => ({
      title:
        multilingualText(document.Title) +
        (document.OfficialNumber
          ? ', ' + multilingualText(document.OfficialNumber)
          : ''),
      url: multilingualText(document.TextAtWeb),
      type: multilingualText(document.Type.Text),
      code: document.Type.Code,
      index: document.Index,
    }))
    .filter(uniqueDocument)
    .sort((a, b) => a.index - b.index)

  function uniqueDocument(v, i, a) {
    return (
      a.findIndex(
        (document) => document.title === v.title && document.url === v.url,
      ) === i
    )
  }
}

const priorityCompare = (first, second) => {
  let prioFirst = 0
  if (first.AreaShare) {
    prioFirst = 3
  } else if (first.LengthShare) {
    prioFirst = 2
  } else if (first.NrOfPoints) {
    prioFirst = 1
  }
  let prioSecond = 0
  if (second.AreaShare) {
    prioSecond = 3
  } else if (second.LengthShare) {
    prioSecond = 2
  } else if (second.NrOfPoints) {
    prioSecond = 1
  }

  return prioFirst - prioSecond
}

// Lifecycle hooks
onMounted(() => {
  propertyStore.setActiveThemeCode(props.code)
  propertyStore.setActiveLawStatusCode(lawStatusCode.value)
})

onUnmounted(() => {
  propertyStore.setActiveThemeCode(null)
  propertyStore.setActiveLawStatusCode(null)
})

// Watchers
watch(lawStatusCode, (newValue) => {
  propertyStore.setActiveLawStatusCode(newValue)
})
</script>

<style scoped>
.grid-legend {
  grid-template-columns: 1.5rem auto 1fr;
}
</style>
