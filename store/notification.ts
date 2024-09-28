import { defineStore } from 'pinia'

interface NotificationMessage {
  type: 'success' | 'error' | 'warning' | 'info'
  text: string
  vars: Record<string, unknown>
  translate: boolean
}

interface NotificationOptions {
  type?: NotificationMessage['type']
  text: string
  vars?: Record<string, unknown>
  translate?: boolean
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    messages: [] as NotificationMessage[],
  }),

  actions: {
    addMessage(message: NotificationMessage): void {
      this.messages.push(message)
    },

    dropFirstMessage(): void {
      if (this.messages.length > 0) {
        this.messages.shift()
      }
    },

    takeFirstMessage(): NotificationMessage | null {
      const message = this.messages.length > 0 ? this.messages[0] : null
      this.dropFirstMessage()
      return message
    },

    notifySuccess(options: string | NotificationOptions): void {
      const wrappedOptions = wrapOptions(options)
      wrappedOptions.type = 'success'
      this.addMessage(wrappedOptions)
    },

    notifyError(options: string | NotificationOptions): void {
      const wrappedOptions = wrapOptions(options)
      wrappedOptions.type = 'error'
      this.addMessage(wrappedOptions)
    },

    notifyWarning(options: string | NotificationOptions): void {
      const wrappedOptions = wrapOptions(options)
      wrappedOptions.type = 'warning'
      this.addMessage(wrappedOptions)
    },
  },
})

function wrapOptions(options: string | NotificationOptions): NotificationMessage {
  if (typeof options === 'string') {
    return {
      type: 'info',
      text: options,
      vars: {},
      translate: false,
    }
  }

  if (typeof options === 'object') {
    return {
      type: options.type || 'info',
      text: options.text,
      vars: options.vars || {},
      translate: options.translate ?? true,
    }
  }

  throw new Error('Invalid notification options')
}
