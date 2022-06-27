import { locales } from '~/config/setup'

export const state = () => ({
  isMenuOpen: true,
  locales,
})

export const mutations = {
  toggleMenuOpen(state) {
    state.isMenuOpen = !state.isMenuOpen
  },

  setMenuOpen(state, open) {
    state.isMenuOpen = open
  },
}
