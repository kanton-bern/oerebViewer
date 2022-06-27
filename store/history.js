import { extractToTemplateVars } from '~/helpers/transformers'

export const state = () => ({
  properties: [],
})

export const mutations = {
  addProperty(state, extract) {
    const entry = extractToTemplateVars(extract, {
      url: `/d/${extract.RealEstate.EGRID}`,
    })

    state.properties = state.properties.filter((e) => e.EGRID !== entry.EGRID)
    state.properties.unshift(entry)
    state.properties = state.properties.slice(0, 10)
  },
}
