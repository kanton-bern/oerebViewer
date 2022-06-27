import isArray from 'lodash/isArray'
import { getExtractById } from '~/services/oereb'
import {
  pdfService,
  externalService,
  stringTemplate,
  ownerService,
} from '~/config/setup'
import { extractToTemplateVars } from '~/helpers/transformers'

export const state = () => {
  return {
    extract: null,
    loading: false,
    extractFeatures: null,
    activeThemeCode: null,
    activeLawStatusCode: null,
  }
}

export const mutations = {
  /**
   *
   * @param {*} state
   * @param GetExtractByIdResponse extract
   * @param string language
   */
  setExtract(state, { extract, language }) {
    const templateVars = extractToTemplateVars(extract, { language })
    extract.pdfExtractUrl = stringTemplate(
      pdfService.getPDFUrlByEGRID,
      templateVars
    )

    extract.externalUrl =
      externalService.getExternalUrlByEGRID &&
      stringTemplate(externalService.getExternalUrlByEGRID, templateVars)

    extract.ownerUrl =
      ownerService.getOwnerUrlByEGRID &&
      stringTemplate(ownerService.getOwnerUrlByEGRID, templateVars)

    extract.language = language

    state.extract = extract
  },

  setLoading(state, loading) {
    state.loading = loading
  },

  setFeatures(state, plotFeatures) {
    state.extractFeatures = plotFeatures
  },

  setActiveThemeCode(state, activeThemeCode) {
    state.activeThemeCode = activeThemeCode
  },

  setActiveLawStatusCode(state, activeLawStatusCode) {
    state.activeLawStatusCode = activeLawStatusCode
  },
}

export const actions = {
  showExtractById(store, EGRID) {
    // update url for active Extract
    this.$router.push(`/d/${EGRID}`)
  },

  showActiveExtract({ dispatch }, path) {
    // show extract by active url
    const EGRID = path.match(/\/d\/([A-Z0-9]+)$/i)?.[1]

    if (EGRID) {
      return dispatch('loadExtractById', { EGRID, language: this.$i18n.locale })
    }
  },

  reloadExtract({ dispatch, state }, language = null) {
    if (!state.extract) return
    return dispatch('loadExtractById', {
      EGRID: state.extract.RealEstate.EGRID,
      language: language || this.$i18n.locale,
    })
  },

  async loadExtractById({ commit, dispatch }, { EGRID, language }) {
    commit('setLoading', true)
    let extract
    let templateVars = extractToTemplateVars(null, { municipality: EGRID })

    try {
      const response = await getExtractById({ EGRID, language })

      /** @type {import('~/types/extract').GetEGRIDResponse} */
      extract = response.extract
      templateVars = extractToTemplateVars(extract)
      commit('setActiveThemeCode', null)
      commit('setActiveLawStatusCode', null)
      commit('setExtract', { extract, language })
      commit('setFeatures', extract.RealEstate.Limit)
      commit('history/addProperty', extract, { root: true })

      // used for vs code extension i18n ally
      // $t('notification_load_success')
      dispatch(
        'notification/notifySuccess',
        { text: 'notification_load_success', vars: templateVars },
        { root: true }
      )
    } catch (error) {
      console.error('whoops', error)

      // used for vs code extension i18n ally
      // $t('oereb_service_not_available')
      // $t('oereb_service_500')
      // $t('oereb_service_204')
      // $t('oereb_service_invalid_data')
      let warning = 'oereb_service_not_available'
      if (error.response?.status === 500) warning = 'oereb_service_500'
      if (error.response?.status === 204) warning = 'oereb_service_204'
      if (error.invalidData || extract || !error.response?.status)
        warning = 'oereb_service_invalid_data'

      dispatch(
        'notification/notifyWarning',
        { text: warning, vars: templateVars },
        { root: true }
      )
    }
    commit('setLoading', false)
  },

  setActiveThemeCode({ commit }, activeThemeCode) {
    commit('setActiveThemeCode', activeThemeCode)
  },

  setActiveLawStatusCode({ commit }, activeLawStatusCode) {
    commit('setActiveLawStatusCode', activeLawStatusCode)
  },

  refocusFeatures({ commit, state }) {
    if (state.extractFeatures) {
      const features = state.extractFeatures
      commit('setFeatures', null)
      setTimeout(() => {
        commit('setFeatures', features)
      }, 100)
    }
  },
}

export const getters = {
  loadedExtract(state) {
    return state.loading || !state.extract ? null : state.extract
  },

  subThemesByCode: (state) => (code) => {
    return !state.extract
      ? null
      : state.extract.RealEstate.RestrictionOnLandownership.filter(
          (restriction) =>
            restriction.Theme.SubCode && restriction.Theme.Code === code
        )
          .filter(uniqueSubCode)
          .map((restriction) => restriction.Theme)

    function uniqueSubCode(v, i, a) {
      return a.findIndex((s) => s.Theme.SubCode === v.Theme.SubCode) === i
    }
  },

  restrictionsByThemeCode: (state) => (code, lawStatusCode) => {
    return !state.extract
      ? null
      : combineRestrictionByTypeCodeAndLawStatus(
          state.extract.RealEstate.RestrictionOnLandownership.filter(
            (restriction) =>
              restriction.Theme.Code === code ||
              restriction.Theme.SubCode === code
          ).filter(
            (restriction) =>
              !lawStatusCode || restriction.Lawstatus.Code === lawStatusCode
          )
        )
  },

  themeByCode: (state) => (code) => {
    return !state.extract
      ? null
      : state.extract.RealEstate.RestrictionOnLandownership.find(
          (restriction) =>
            restriction.Theme.SubCode === code ||
            restriction.Theme.Code === code
        )
  },

  lawStatesByThemeCode: (state) => (code) => {
    return !state.extract
      ? null
      : state.extract.RealEstate.RestrictionOnLandownership.filter(
          (restriction) =>
            restriction.Theme.Code === code ||
            restriction.Theme.SubCode === code
        ).reduce((states, restriction) => {
          const lawStatus = restriction.Lawstatus
          if (
            lawStatus &&
            !states.find((status) => status.Code === lawStatus.Code)
          ) {
            states.push(lawStatus)
          }
          return states
        }, [])
  },
}

function combineRestrictionByTypeCodeAndLawStatus(restrictions) {
  return Object.values(
    restrictions.reduce((acc, restriction) => {
      if (!acc[restriction.TypeCode + restriction.Lawstatus.Code]) {
        acc[restriction.TypeCode + restriction.Lawstatus.Code] = {
          ...restriction,
        }
        return acc
      }

      const accumulation =
        acc[restriction.TypeCode + restriction.Lawstatus.Code]

      if (typeof accumulation.NrOfPoints !== 'undefined') {
        accumulation.NrOfPoints += restriction.NrOfPoints
      }
      if (typeof accumulation.PartInPercent !== 'undefined') {
        accumulation.PartInPercent += restriction.PartInPercent
      }
      if (typeof accumulation.AreaShare !== 'undefined') {
        accumulation.AreaShare += restriction.AreaShare
      }
      if (typeof accumulation.LengthShare !== 'undefined') {
        accumulation.LengthShare += restriction.LengthShare
      }
      if (
        typeof accumulation.LegalProvisions !== 'undefined' &&
        isArray(accumulation.LegalProvisions)
      ) {
        accumulation.LegalProvisions = accumulation.LegalProvisions.concat(
          restriction.LegalProvisions
        )
      }

      return acc
    }, {})
  )
}
