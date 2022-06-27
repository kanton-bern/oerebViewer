<template>
  <div class="p-4 overflow-x-hidden">
    <div>
      <div v-if="lawStates.length > 0" class="flex items-center">
        <div
          :class="{
            'text-theme-decent': showChanges,
          }"
        >
          {{ lawStates[0].Text | multilingualtext }}
        </div>
        <template v-if="lawStates.length > 1">
          <LayoutToggle
            v-model="showChanges"
            :title="$t('show_changes')"
            class="mx-2"
          />
          <div
            :class="{
              'text-theme-decent': !showChanges,
            }"
          >
            {{ lawStates[1].Text | multilingualtext }}
          </div>
        </template>
      </div>

      <div class="text-l font-bold mt-8">{{ $t('restriction_legend') }}</div>

      <div class="grid gap-x-2 gap-y-4 grid-legend mt-2">
        <template v-for="(restriction, index) in sortedRestrictions">
          <div :key="`restrictions-${index}-symbol`" class="flex items-center">
            <img
              :src="restriction.SymbolRef"
              class="hover:scale-150 transition-transform duration-500"
            />
          </div>

          <div :key="`restrictions-${index}-label`">
            {{ restriction.LegendText | multilingualtext | wordbreak }}
          </div>

          <div :key="`restrictions-${index}-value`">
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
        v-if="disableLegendAtWeb && restrictions[0].Map.LegendAtWeb"
        :href="restrictions[0].Map.LegendAtWeb"
        class="flex gap-2 mt-2 hover:underline"
        :title="`${$t(
          'restriction_key_download'
        )} (${$options.filters.multilingualtext(restrictions[0].Theme.Text)})`"
      >
        <IconLayers class="w-4 h-4 mt-1 shrink-0" />
        <div>
          {{ $t('restriction_key_download') }} ({{
            restrictions[0].Theme.Text | multilingualtext
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
          {{ document.title | wordbreak }}
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
        <div>{{ document.title | wordbreak }}</div>
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
        <div>{{ document.title | wordbreak }}</div>
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

<script>
import { mapActions } from 'vuex'
import { multilingualtext } from '~/plugins/vue-multilingual-text'

import { userInterface } from '~/config/setup'

export default {
  props: {
    code: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      showChanges: false,
      disableLegendAtWeb: userInterface.disableLegendAtWeb,
    }
  },

  computed: {
    sortedRestrictions() {
      return this.restrictions.concat().sort((b, a) => {
        return (
          this.priorityCompare(a, b) ||
          a.AreaShare - b.AreaShare ||
          a.LengthShare - b.LengthShare ||
          a.NrOfPoints - b.NrOfPoints ||
          ('' + b.Information?.[0].Text).localeCompare(
            '' + a.Information?.[0].Text
          )
        )
      })
    },

    legalProvisions() {
      return this.collectUniqueDocumentType(this.restrictions, 'LegalProvision')
    },

    laws() {
      return this.collectUniqueDocumentType(this.restrictions, 'Law')
    },

    hints() {
      return this.collectUniqueDocumentType(this.restrictions, 'Hint')
    },

    offices() {
      return this.restrictions
        .reduce((offices, restriction) => {
          offices.push(restriction.ResponsibleOffice)
          return offices
        }, [])
        .map((office) => ({
          name: multilingualtext(office.Name),
          url: multilingualtext(office.OfficeAtWeb),
        }))
        .filter(
          (v, i, a) =>
            a.findIndex(
              (office) => office.name === v.name && office.url === v.url
            ) === i
        )
    },

    restrictions() {
      return (
        this.$store.getters['property/restrictionsByThemeCode'](
          this.code,
          this.lawStatusCode
        ) || []
      )
    },

    theme() {
      const theme = this.$store.getters['property/themeByCode'](this.code) || {}
      return theme
    },

    lawStates() {
      const order = ['inForce', 'changeWithPreEffect', 'changeWithoutPreEffect']
      return (
        this.$store.getters['property/lawStatesByThemeCode'](this.code) || []
      ).sort((a, b) => {
        return order.indexOf(a.Code) - order.indexOf(b.Code)
      })
    },

    lawStatusCode() {
      return !this.showChanges
        ? this.lawStates[0]?.Code
        : this.lawStates[1]?.Code
    },
  },

  watch: {
    lawStatusCode() {
      this.setActiveLawStatusCode(this.lawStatusCode)
    },
  },

  mounted() {
    this.setActiveThemeCode(this.code)
    this.setActiveLawStatusCode(this.lawStatusCode)
  },

  destroyed() {
    this.setActiveThemeCode(null)
    this.setActiveLawStatusCode(null)
  },

  methods: {
    ...mapActions('property', ['setActiveThemeCode', 'setActiveLawStatusCode']),

    collectUniqueDocumentType(restrictions, type) {
      return restrictions
        .reduce(
          (provisions, restriction) =>
            provisions.concat(restriction.LegalProvisions),
          []
        )
        .filter((document) => document.Type.Code === type)
        .map((document) => ({
          title: multilingualtext(document.Title),
          url: multilingualtext(document.TextAtWeb),
          type: multilingualtext(document.Type.Text),
          code: document.Type.Code,
        }))
        .filter(uniqueDocument)

      function uniqueDocument(v, i, a) {
        return (
          a.findIndex(
            (document) => document.title === v.title && document.url === v.url
          ) === i
        )
      }
    },

    priorityCompare(first, second) {
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
    },
  },
}
</script>

<style lang="scss" scoped>
.grid-legend {
  grid-template-columns: 1.5rem auto 1fr;
}
</style>
