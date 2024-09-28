<template>
  <div class="px-4 pt-4 pb-12 md:pt-6 md:pb-16 bg-theme-secondary text-theme-secondary">
    <div v-if="!loadedExtract" class="py-8">
      <div class="font-bold">
        {{ $t('detail_no_property_yet_title') }}
      </div>
      <div>
        {{ $t('detail_no_property_yet_text') }}
      </div>
    </div>

    <div v-else>
      <h1 class="text-2xl leading-none">
        {{ $t('detail_title', templateVars) }}
        <span v-if="loadedExtract.RealEstate.SubunitOfLandRegister && loadedExtract.RealEstate.MunicipalityName != loadedExtract.RealEstate.SubunitOfLandRegister">
          , {{ loadedExtract.RealEstate.SubunitOfLandRegister }}
        </span>
      </h1>

      <p class="text-theme-decent text-sm">
        {{ creationDate }}
      </p>

      <div class="pdf-download">
        <div class="flex mt-6">
          <IconFile class="w-4 h-4 mr-3" />
          <a class="leading-none hover:underline" target="_blank" :href="loadedExtract.pdfExtractUrl" :title="t('detail_download_pdf', templateVars)">
            {{ $t('detail_download_pdf', templateVars) }}
          </a>
        </div>

        <div v-if="loadedExtract.externalUrl" class="flex mt-6">
          <IconMap class="w-4 h-4 mr-3" />
          <a class="leading-none hover:underline" target="_blank" :href="loadedExtract.externalUrl" :title="t('detail_property_gis_map', templateVars)">
            {{ $t('detail_property_gis_map', templateVars) }}
          </a>
        </div>

        <div class="flex mt-6">
          <IconInbox class="w-4 h-4 mr-3" />
          <button class="leading-none hover:underline" :title="t('detail_copy_link', templateVars)" @click.prevent="copyUrlToClipboard">
            {{ $t('detail_copy_link', templateVars) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '~/store/notification'
import { extractToTemplateVars } from '~/helpers/transformers'
import { useLoadedExtract } from '~/composables/useLoadedExtract'

const { t } = useI18n()
const notificationStore = useNotificationStore()

const { loadedExtract } = useLoadedExtract()

const creationDate = computed(() => {
  if (!loadedExtract.value) return ''
  const date = new Date(loadedExtract.value.CreationDate)
  return new Intl.DateTimeFormat('de-CH', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).format(date)
})

const templateVars = computed(() => {
  if (!loadedExtract.value) return {}
  return extractToTemplateVars(loadedExtract.value)
})

function copyUrlToClipboard() {
  const url = window.location.href

  if (copyToClipboard(url)) {
    notificationStore.notifySuccess(t('notification_copied'))
  } else {
    window.prompt(t('prompt_copy'), url)
  }
}

// http://stackoverflow.com/a/33928558
function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // IE specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData('Text', text)
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported('copy')
  ) {
    const textarea = document.createElement('textarea')
    textarea.textContent = text
    textarea.style.position = 'fixed' // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea)
    textarea.select()
    try {
      return document.execCommand('copy') // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn('Copy to clipboard failed.', ex)
      return false
    } finally {
      document.body.removeChild(textarea)
    }
  }
}
</script>
