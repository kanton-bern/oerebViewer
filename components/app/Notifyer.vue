<template>
  <div class="hidden" />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  watch: {
    '$store.state.notification.messages'() {
      this.applyNotification()
    },
  },

  methods: {
    ...mapActions('notification', ['takeFirstMessage']),

    async applyNotification() {
      const message = await this.takeFirstMessage()
      if (!message) return

      const text = message.translate
        ? this.$t(message.text, message.vars)
        : message.text

      if (message.type === 'success') {
        this.notifySuccess(text)
      } else if (message.type === 'warning') {
        this.notifyWarning(text)
      } else {
        this.notifyError(text)
      }
    },

    notifySuccess(text) {
      this.$toast.success(text, {
        position: 'top-right',
        timeout: 3000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: false,
        draggable: true,
        draggablePercent: 0.6,
        hideProgressBar: true,
        closeButton: 'button',
        icon: true,
      })
    },

    notifyWarning(text) {
      this.$toast.warning(text, {
        position: 'top-right',
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        hideProgressBar: true,
        closeButton: 'button',
        icon: true,
      })
    },

    notifyError(text) {
      this.$toast.error(text, {
        position: 'top-right',
        timeout: 7000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        hideProgressBar: true,
        closeButton: 'button',
        icon: true,
      })
    },
  },
}
</script>
