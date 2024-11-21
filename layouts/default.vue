<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMapStore } from '~/store/map'
import ExternalInstructions from '~/components/app/ExternalInstructions.vue'

const mapStore = useMapStore()
const { contentType } = storeToRefs(mapStore)

const toggleGlossaryVisibility = () => {
  mapStore.toggleGlossaryVisibility()
}

const toggleImprintAndLegalVisibility = () => {
  mapStore.toggleImprintAndLegalVisibility()
}
</script>

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

         <div
          class="flex items-center justify-end lg:text-xl xl:text-2xl font-thin"
        >
          <span>{{ $t('app_title') }}</span>
        </div>
      </div>
    </template>

    <template #sidebar>
      <div
        class="bg-theme-secondary text-theme-secondary h-full overflow-y-auto flex flex-col justify-between"
      >
        <div>
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
          <NuxtPage />
        </div>
        <div>
          <ExternalInstructions class="px-4 pt-3 pb-8 relative bottom-0" />
        </div>
      </div>
    </template>

    <template #content>
      <div class="h-full bg-theme-base text-theme-base">
        <ImprintAndLegalContent
          v-if="contentType === 'imprintAndLegal'"
        />
        <GlossaryContent v-if="contentType === 'glossary'" />
        <MapViewer :visible="contentType === 'map'" />
        <ExtractLoadingOverlay />
        <AppNotificationComponent />
      </div>
    </template>
  </LayoutAppShell>
</template>

<style lang="scss">
@use '~/config/defaults/setup.scss';
</style>
