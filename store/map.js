import axios from 'axios'
import { convertToSwissCoordinates } from '../helpers/coordinates.js'
import { view, searchService, stringTemplate } from '~/config/setup'
import { fetchEsriToken } from '~/services/esritoken'
import { getEGRID } from '~/services/oereb'

export const state = () => {
  return {
    tokenUpdateIntervalId: null,
    esriToken: null,
    esriTokenExpiredAt: null,
    viewType: 'map',
    zoom: view.zoom,
    searchQuery: null,
    searchResults: [],
    selectedSearchResult: null,
    isSearchResultLoading: false,
    isSearchVisible: false,
    jumpToSwissCoordinates: null,

    previewCoordinate: null,
    previewFeatures: null,
    previewEGRID: null,
    contentType: 'map',
  }
}

export const mutations = {
  setTokenUpdateIntervalId(state, id) {
    state.tokenUpdateIntervalId = id
  },

  clearTokenUpdateInvtervalId(state) {
    if (state.tokenUpdateIntervalId) clearInterval(state.tokenUpdateIntervalId)
    state.tokenUpdateIntervalId = null
  },

  useEsriToken(state, { token, expires }) {
    state.esriToken = token
    state.esriTokenExpiredAt = expires
  },

  setView(state, viewType) {
    state.viewType = viewType
  },

  jumpToSwissCoordinates(state, coordinates) {
    state.jumpToSwissCoordinates = coordinates
  },

  setZoom(state, zoom) {
    state.zoom = zoom
  },

  setSearchQuery(state, searchQuery) {
    state.searchQuery = searchQuery
  },

  setSearchResults(state, searchResults) {
    state.searchResults = searchResults
  },

  setSelectedSearchResult(state, selectedSearchResult) {
    state.selectedSearchResult = selectedSearchResult
  },

  markSearchResultIsLoading(state) {
    state.isSearchResultLoading = true
  },

  markSearchResultIsCompleted(state) {
    state.isSearchResultLoading = false
  },

  showSearch(state) {
    state.isSearchVisible = true
  },

  hideSearch(state) {
    state.isSearchVisible = false
  },

  clearPreview(state) {
    state.previewCoordinate = null
    state.previewFeatures = null
    state.previewEGRID = null
  },

  setPreviewCoordinate(state, { longitude, latitude }) {
    state.previewCoordinate = { longitude, latitude }
  },

  setPreviewEGRID(state, egridResponse) {
    state.previewEGRID = egridResponse
  },

  setPreviewFeatures(state, plotFeatures) {
    state.previewFeatures = plotFeatures
  },

  setContentType(state, contentType) {
    state.contentType = contentType
  },
}

export const actions = {
  toggleGlossaryVisibility({ commit, state }) {
    if (state.contentType === 'glossary') {
      commit('setContentType', 'map')
    } else {
      commit('setContentType', 'glossary')
    }
  },

  toggleImprintAndLegalVisibility({ commit, state }) {
    if (state.contentType === 'imprintAndLegal') {
      commit('setContentType', 'map')
    } else {
      commit('setContentType', 'imprintAndLegal')
    }
  },

  closeGlossary({ commit }) {
    commit('setContentType', 'map')
  },

  closeImprintAndLegal({ commit }) {
    commit('setContentType', 'map')
  },

  toggleSearchVisibility({ commit, state }) {
    if (state.isSearchVisible === true) {
      commit('hideSearch')
    } else {
      commit('showSearch')
    }
  },

  searchResultSelected({ commit, dispatch }, item) {
    commit('setSelectedSearchResult', item)

    if (item) {
      const swissCoordinates =
        item.x && item.y
          ? [item.x, item.y]
          : convertToSwissCoordinates(item.lon, item.lat)

      commit('jumpToSwissCoordinates', swissCoordinates)

      const globalCoordinate = { longitude: item.lon, latitude: item.lat }
      const swissCoordinate = {
        longitude: swissCoordinates[0],
        latitude: swissCoordinates[1],
      }
      dispatch('previewCoordinate', { swissCoordinate, globalCoordinate })
    }
  },

  async updateSearchQuery({ commit, state }, searchQuery) {
    if (!searchQuery || searchQuery === '') {
      return
    }

    commit('markSearchResultIsLoading')
    commit('setSearchQuery', searchQuery)

    const encodedQuery = encodeURI(state.searchQuery)
    const endpoint = stringTemplate(searchService.search, {
      query: encodedQuery,
    })

    try {
      const response = await axios.get(endpoint)

      if (typeof searchService.parser !== 'function')
        throw new Error(
          'searchService.parse is not a function. provide a function to parse the response as search result.'
        )

      const results = searchService.parser(response.data)

      commit('setSearchResults', results)
      commit('markSearchResultIsCompleted')
    } catch (err) {
      commit('setSearchResults', [])
      commit('markSearchResultIsCompleted')
      throw err
    }
  },

  jumpToSwissCoordinates({ commit, state }, coordinates) {
    commit('jumpToSwissCoordinates', coordinates)
  },

  centerObjectActionClicked({ dispatch }) {
    dispatch('property/refocusFeatures', null, { root: true })
  },

  zoomInActionClicked({ commit, state }) {
    const newValue = state.zoom + 0.5

    if (newValue > 42) {
      return
    }

    commit('setZoom', newValue)
  },

  zoomOutActionClicked({ commit, state }) {
    const newValue = state.zoom - 0.5

    if (newValue < 0) {
      return
    }

    commit('setZoom', newValue)
  },

  setZoom({ commit, state }, value) {
    if (value < 0 || state.zoom === value) {
      return
    }

    commit('setZoom', value)
  },

  setSatelliteView({ commit, state }) {
    commit('setView', 'satellite')
  },

  setMapView({ commit }) {
    commit('setView', 'map')
  },

  async enableTokenUpdater({ commit, state }) {
    const id = setInterval(async function () {
      if (state.esriTokenExpiredAt && state.esriTokenExpiredAt > Date.now()) {
        // skip if token not expired
        return
      }

      const token = await fetchEsriToken({ commit, state })
      commit('useEsriToken', token)
    }, 30 * 1000)

    commit('setTokenUpdateIntervalId', id)

    const token = await fetchEsriToken({ commit, state })
    commit('useEsriToken', token)
  },

  disableTokenUpdater({ commit }) {
    commit('clearTokenUpdateInvtervalId')
  },

  async updateToken({ commit }) {
    const token = await fetchEsriToken()
    commit('useEsriToken', token)
  },

  async previewCoordinate(
    { commit, dispatch },
    { globalCoordinate, swissCoordinate }
  ) {
    commit('clearPreview')
    commit('setPreviewCoordinate', swissCoordinate)

    let EGRIDs

    try {
      EGRIDs = (await getEGRID(globalCoordinate)) || []

      commit('setPreviewEGRID', EGRIDs)
      commit('setPreviewFeatures', EGRIDs[0]?.limit ?? null)

      if (EGRIDs.length === 1) {
        // auto start extraction
        await dispatch('property/showExtractById', EGRIDs[0].egrid, {
          root: true,
        })
        commit('clearPreview')
      }
    } catch (error) {
      console.error('whoops', error)

      commit('clearPreview')

      // used for vs code extension i18n ally
      // $t('oereb_service_not_available')
      // $t('oereb_service_500')
      // $t('oereb_service_204')
      let warning = 'oereb_service_not_available'
      if (error.response?.status === 500) warning = 'oereb_service_500'
      if (error.response?.status === 204) warning = 'oereb_service_204'

      dispatch(
        'notification/notifyWarning',
        { text: warning, vars: {} },
        { root: true }
      )
    }
  },
}

export const getters = {
  isSatelliteView(state) {
    return state.viewType === 'satellite'
  },

  isMapView(state) {
    return state.viewType === 'map'
  },
}
