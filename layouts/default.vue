<template>
  <LayoutAppShell>
    <template #header>
      <div
        class="h-full flex justify-between lg:grid grid-cols-3 bg-theme-primary text-theme-primary px-4 md:px-6"
      >
        <div class="flex items-center text-xl">
          <AppMenuToggle class="block lg:hidden" />
          <AppLanguageSwitcher
            class="hidden lg:block"
            list-class="flex items-center gap-4"
            icon-class="h-6 w-6"
          />
        </div>

        <div
          class="hidden lg:flex items-center justify-center text-xl 3xl:text-2xl"
        >
          <ExtractHeader />
        </div>

        <div class="flex items-center justify-end text-2xl font-thin">
          <span>{{ $t('app_title') }}</span>
        </div>
      </div>
    </template>

    <template #sidebar>
      <div
        class="bg-theme-secondary text-theme-secondary h-full overflow-y-auto"
      >
        <ExtractDetail />
        <button
          class="w-full text-left px-4 py-3 border-t border-theme-primary hover:bg-theme-active hover:text-theme-active 3xl:text-lg"
          @click="toggleGlossaryVisibility"
        >
          {{ $t('glossary_title') }}
        </button>
        <button
          class="w-full text-left px-4 py-3 border-t border-theme-primary border-b hover:bg-theme-active hover:text-theme-active 3xl:text-lg"
          @click="toggleImprintAndLegalVisibility"
        >
          {{ $t('imprint_title') }}
        </button>
        <AppLanguageSwitcher
          class="lg:hidden px-4 py-3"
          list-class="flex items-center gap-2"
          icon-class="h-4 w-4"
        />
        <Nuxt />
      </div>
    </template>

    <template #content>
      <div class="h-full bg-theme-base text-theme-base">
        <ImprintAndLegalContent
          v-if="$store.state.map.contentType === 'imprintAndLegal'"
        />
        <GlossaryContent v-if="$store.state.map.contentType === 'glossary'" />
        <MapViewer :visible="$store.state.map.contentType === 'map'" />
        <ExtractLoadingOverlay />
        <AppNotifyer />
      </div>
    </template>
  </LayoutAppShell>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('map', [
      'toggleImprintAndLegalVisibility',
      'toggleGlossaryVisibility',
    ]),
  },
}
</script>

<style lang="scss">
@import '~/config/defaults/setup.scss';
</style>
