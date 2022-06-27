<template>
  <LayoutClosablePage
    title-key="imprint_title"
    @close-clicked="closeImprintAndLegal"
  >
    <h2 class="mb-5">{{ $t('imprint_oereb_title') }}</h2>

    <div class="block sm:flex">
      <div class="w-72"><IconOerebLogo /></div>
      <div class="flex-auto sm:ml-5 mt-3 ms:mt-0 text-theme-secondary">
        {{ $t('imprint_oereb_text') }}
      </div>
    </div>

    <h2 class="mb-5">{{ $t('imprint_oereb_thirdparties_title') }}</h2>
    <ImprintAndLegalNoMunicipalInvolved v-if="!loadedExtract" />

    <template v-if="loadedExtract">
      <section class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
        <div class="item">
          <LayoutPartnerLogo
            v-if="loadedExtract.FederalLogoRef"
            type="federal"
            :src="loadedExtract.FederalLogoRef"
          />
        </div>
        <div class="item">
          <LayoutPartnerLogo
            v-if="loadedExtract.CantonalLogoRef"
            type="canton"
            :src="loadedExtract.CantonalLogoRef"
          />
        </div>
        <div class="item">
          <LayoutPartnerMunicipalLogo
            v-if="loadedExtract.MunicipalityLogoRef"
            :src="loadedExtract.MunicipalityLogoRef"
            :name="loadedExtract.RealEstate.MunicipalityName"
          />
        </div>
      </section>

      <h2>{{ $t('imprint_hint_title') }}</h2>

      <section class="block sm:grid grid-cols-2 gap-4">
        <div class="item">
          <LayoutInformationSection
            :title="$t('imprint_general_information_title')"
          >
            <p
              v-for="(text, index) in loadedExtract.GeneralInformation"
              :key="index"
            >
              {{ text | multilingualtext }}
            </p>
          </LayoutInformationSection>
        </div>
        <div
          v-for="liabilityItem in loadedExtract.Disclaimer"
          :key="liabilityItem.Title | multilingualtext"
          class="item"
        >
          <LayoutInformationSection
            :title="liabilityItem.Title | multilingualtext"
          >
            <p v-for="(text, index) in liabilityItem.Content" :key="index">
              {{ text | multilingualtext }}
            </p>
          </LayoutInformationSection>
        </div>
      </section>

      <h2>{{ $t('imprint_responsibility_title') }}</h2>

      <section class="block sm:grid grid-cols-2 gap-4">
        <div class="item">
          <LayoutInformationSection
            :title="loadedExtract.PLRCadastreAuthority.Name | multilingualtext"
          >
            {{ loadedExtract.PLRCadastreAuthority.Street }}
            {{ loadedExtract.PLRCadastreAuthority.Number }}<br />
            {{ loadedExtract.PLRCadastreAuthority.PostalCode }}
            {{ loadedExtract.PLRCadastreAuthority.City }}<br />
            <a
              :href="
                loadedExtract.PLRCadastreAuthority.OfficeAtWeb
                  | multilingualtext
              "
              target="_blank"
              class="url-link"
              :title="
                $options.filters.multilingualtext(
                  loadedExtract.PLRCadastreAuthority.Name
                )
              "
              >{{
                loadedExtract.PLRCadastreAuthority.Name | multilingualtext
              }}</a
            >
          </LayoutInformationSection>
        </div>
      </section>
    </template>
  </LayoutClosablePage>
</template>

<script>
import { mapActions } from 'vuex'
import { extractToTemplateVars } from '~/helpers/transformers'
import loadedextract from '~/mixins/loadedextract'

export default {
  mixins: [loadedextract],

  computed: {
    templateVars() {
      return extractToTemplateVars(this.loadedExtract)
    },
  },

  mounted() {
    this.$store.commit('app/setMenuOpen', false)
  },

  beforeDestroy() {
    this.$store.commit('app/setMenuOpen', true)
  },

  methods: {
    ...mapActions('map', ['closeImprintAndLegal']),
  },
}
</script>

<style lang="scss" scoped>
h2 {
  @apply text-lg leading-tight font-bold mt-12 text-theme-secondary;
}

.url-link:link,
.url-link:visited {
  text-decoration: underline;
}
.url-link:hover,
.url-link:active {
  text-decoration: none;
}
</style>
