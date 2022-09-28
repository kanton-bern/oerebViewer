<template>
  <LayoutAccordionItem
    :header="$t('detail_extract_history')"
    header-class="3xl:text-lg"
    :tag="properties.length"
  >
    <div class="p-4 gap-y-4 grid">
      <NuxtLink
        v-for="(item, index) in properties"
        :key="index"
        :to="item.url"
        class="flex gap-x-2 hover:underline"
      >
        <div class="w-8 flex-grow-0 flex-shrink-0">
          <div
            :style="`background-image: url(${item.municipalityLogo})`"
            class="municipality-banner"
          />
        </div>

        <div>
          <div class="text-l leading-none flex-auto">
            {{
              [
                $t('detail_of_property', item),
                $t('detail_of_municipality', item),
                item.subunitOfLandRegister
                  ? $t('detail_of_subunit_of_land_register', item)
                  : null,
              ]
                .filter((x) => x)
                .join(', ')
            }}
          </div>
          <div class="text-theme-decent text-xs mt-1">
            {{ creationDate(item.creationDate) }}
          </div>
        </div>
      </NuxtLink>
    </div>
  </LayoutAccordionItem>
</template>

<script>
export default {
  computed: {
    properties() {
      return this.$store.state.history.properties
    },
  },

  methods: {
    creationDate(rawDate) {
      if (!rawDate) return ''
      const date = new Date(rawDate)
      // Then specify how you want your dates to be formatted
      return new Intl.DateTimeFormat('de-CH', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      }).format(date)
    },

    i18nAlly() {
      // used for vs code extension i18n ally
      // $t('detail_extract_history')
      // $t('detail_of_property')
      // $t('detail_of_municipality')
      // $t('detail_of_subunit_of_land_register')
    },
  },
}
</script>

<style scoped>
.municipality-banner {
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  width: 100%;
  padding-top: calc(100% * var(--ratio-municipality-banner));
}
</style>
