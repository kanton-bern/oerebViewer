<template>
  <div class="hidden" />
</template>

<script setup>
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '~/store/notification'

const { t } = useI18n()
const notificationStore = useNotificationStore()

watch(() => notificationStore.messages, applyNotification, { deep: true })

async function applyNotification() {
  const message = await notificationStore.takeFirstMessage()
  if (!message) return

  const text = message.translate ? t(message.text, message.vars) : message.text

  if (message.type === 'success') {
    notifySuccess(text)
  } else if (message.type === 'warning') {
    notifyWarning(text)
  } else {
    notifyError(text)
  }
}

function notifySuccess(text) {
  useNuxtApp().$toast.success(text, {
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: false,
    draggable: true,
    draggablePercent: 0.6,
    hideProgressBar: true,
    // closeButton: 'button',
    icon: true,
  })
}

function notifyWarning(text) {
  useNuxtApp().$toast.warning(text, {
    position: 'top-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    hideProgressBar: true,
    // closeButton: 'button',
    icon: true,
  })
}

function notifyError(text) {
  useNuxtApp().$toast.error(text, {
    position: 'top-right',
    timeout: 7000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    hideProgressBar: true,
    // closeButton: 'button',
    icon: true,
  })
}
</script>
