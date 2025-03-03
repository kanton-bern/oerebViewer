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
            :title="t('imprint_general_information_title')"
          >
            <p
              v-for="(text, index) in loadedExtract.GeneralInformation"
              :key="index"
            >
              {{ multilingualText(text) }}
            </p>
          </LayoutInformationSection>
        </div>
        <div
          v-for="liabilityItem in loadedExtract.Disclaimer"
          :key="multilingualText(liabilityItem.Title)"
          class="item"
        >
          <LayoutInformationSection
            :title="multilingualText(liabilityItem.Title)"
          >
            <p v-for="(text, index) in liabilityItem.Content" :key="index">
              {{ multilingualText(text) }}
            </p>
          </LayoutInformationSection>
        </div>
      </section>

      <h2>{{ $t('imprint_responsibility_title') }}</h2>

      <section class="block sm:grid grid-cols-2 gap-4">
        <div class="item">
          <LayoutInformationSection
            :title="multilingualText(loadedExtract.PLRCadastreAuthority.Name)"
          >
            {{ loadedExtract.PLRCadastreAuthority.Street }}
            {{ loadedExtract.PLRCadastreAuthority.Number }}<br />
            {{ loadedExtract.PLRCadastreAuthority.PostalCode }}
            {{ loadedExtract.PLRCadastreAuthority.City }}<br />
            <a
              :href="
                multilingualText(loadedExtract.PLRCadastreAuthority.OfficeAtWeb)
  "
              target="_blank"
              class="url-link"
              :title="
                multilingualText(
                  loadedExtract.PLRCadastreAuthority.Name
                )
              "
              >{{
                multilingualText(loadedExtract.PLRCadastreAuthority.Name)
              }}</a
            >
          </LayoutInformationSection>
        </div>
      </section>
    </template>
  </LayoutClosablePage>
</template>

<script setup>
import { onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '~/store/app'
import { useMapStore } from '~/store/map'
import { useLoadedExtract } from '~/composables/useLoadedExtract'
import { useMultilingualText } from '~/composables/useMultilingualText'

const { multilingualText } = useMultilingualText()
const { t } = useI18n()
const appStore = useAppStore()
const mapStore = useMapStore()
const { loadedExtract } = useLoadedExtract()

const closeImprintAndLegal = () => {
  mapStore.closeImprintAndLegal()
}

onBeforeUnmount(() => {
  appStore.setMenuOpen(true)
})
</script>

<style>
h2 {
  @apply text-lg leading-tight font-bold mt-12 text-theme-secondary;
}

.url-link {
  &:link,
  &:visited {
    text-decoration: underline;
  }

  &:hover,
  &:active {
    text-decoration: none;
  }
}
</style>
