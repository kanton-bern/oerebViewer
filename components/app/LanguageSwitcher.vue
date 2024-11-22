<template>
  <div>
    <div :class="listClass">
      <IconGlobe :class="iconClass" />
      <button
        v-for="localeName in availableLocales"
        :key="localeName.code"
        class="block cursor-pointer hover:underline"
        @click="use(localeName.code)"
      >
        {{ localeName.title || localeName.code }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAppStore } from '~/store/app'
import { usePropertyStore } from '~/store/property'

defineProps({
  iconClass: {
    type: String,
    default: 'h-4 w-4',
  },
  listClass: {
    type: String,
    default: 'flex gap-2',
  },
})

const { locale, setLocale } = useI18n()
const appStore = useAppStore()
const propertyStore = usePropertyStore()

const { locales } = storeToRefs(appStore)

const availableLocales = computed(() =>
  locales.value.filter((l) => locale.value !== l.code),
)

const use = (language) => {
  setLocale(language)
  propertyStore.reloadExtract(language)
}
</script>
