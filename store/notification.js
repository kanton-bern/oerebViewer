export const state = () => ({
  messages: [],
})

export const mutations = {
  addMessage(state, { type, text, vars, translate }) {
    state.messages.push({
      type,
      text,
      vars,
      translate,
    })
  },

  dropFirstMessage(state) {
    if (state.messages.length > 0) {
      state.messages.shift()
    }
  },
}

export const actions = {
  takeFirstMessage({ state, commit }) {
    const message = state.messages.length > 0 ? state.messages[0] : null
    commit('dropFirstMessage')
    return message
  },

  notifySuccess(store, options) {
    options = wrapOptions(options)
    options.type = 'success'
    store.commit('addMessage', options)
  },

  notifyError(store, options) {
    options = wrapOptions(options)
    options.type = 'error'
    store.commit('addMessage', options)
  },

  notifyWarning(store, options) {
    options = wrapOptions(options)
    options.type = 'warning'
    store.commit('addMessage', options)
  },
}

function wrapOptions(options) {
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
      vars: options.vars,
      translate: options.translate ?? true,
    }
  }

  throw new Error('Invalid notification options')
}
