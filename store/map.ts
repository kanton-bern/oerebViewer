import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { convertToSwissCoordinates } from '~/helpers/coordinates.js'
import { usePropertyStore } from '~/store/property'
import { useNotificationStore } from '~/store/notification'
import { getView, getSearchService } from '~/config/setup.js'
import { stringTemplate } from '~/helpers/template'
import { fetchEsriToken } from '~/services/esritoken'
import { useOereb } from '~/composables/useOereb'

interface EsriToken {
  token: string
  expires: number
}

export const useMapStore = defineStore('map', () => {
  const tokenUpdateIntervalId = ref<string | null>(null)
  const esriToken = ref<string | null>(null)
  const esriTokenExpiredAt = ref<number | null>(null)
  const viewType = ref<string>('map')
  const zoom = ref<number | null>(null)
  const searchQuery = ref<string | null>(null)
  const searchResults = ref<any[]>([])
  const selectedSearchResult = ref<any>(null)
  const isSearchResultLoading = ref<boolean>(false)
  const isSearchVisible = ref<boolean>(true)
  const jumpToCoordinates = ref(null)
  const previewCoordinates = ref<{ longitude: number; latitude: number } | null>(null)
  const previewFeatures = ref(null)
  const previewEGRID = ref(null)
  const contentType = ref('map')
  const view = ref(null)
  const searchService = ref(null)
  const skipZoomWatch = ref(false)

  async function initializeStore() {
    const viewConfig = await getView()
    view.value = viewConfig
    zoom.value = viewConfig.zoom
    searchService.value = await getSearchService()
  }

  const isSatelliteView = computed(() => viewType.value === 'satellite')
  const isMapView = computed(() => viewType.value === 'map')

  function setTokenUpdateIntervalId(id: string) {
    tokenUpdateIntervalId.value = id
  }

  function clearTokenUpdateIntervalId() {
    if (tokenUpdateIntervalId.value) clearInterval(tokenUpdateIntervalId.value)
    tokenUpdateIntervalId.value = null
  }

  function useEsriToken({ token, expires }: EsriToken) {
    esriToken.value = token
    esriTokenExpiredAt.value = expires
  }

  function setView(newViewType: string) {
    viewType.value = newViewType
  }

  function setJumpToCoordinates(coordinates) {
    jumpToCoordinates.value = coordinates
  }

  function jumpToSwissCoordinates(coordinates) {
    setJumpToCoordinates(coordinates)
  }

  function setZoom(newZoom: number) {
    if (!skipZoomWatch.value) {
      zoom.value = newZoom
    }
  }

  function setSearchQuery(newSearchQuery) {
    searchQuery.value = newSearchQuery
  }

  function setSearchResults(newSearchResults) {
    searchResults.value = newSearchResults
  }

  function setSelectedSearchResult(newSelectedSearchResult) {
    selectedSearchResult.value = newSelectedSearchResult
  }

  function markSearchResultIsLoading() {
    isSearchResultLoading.value = true
  }

  function markSearchResultIsCompleted() {
    isSearchResultLoading.value = false
  }

  function showSearch() {
    isSearchVisible.value = true
  }

  function hideSearch() {
    isSearchVisible.value = false
  }

  function clearPreview() {
    previewCoordinates.value = null
    previewFeatures.value = null
    previewEGRID.value = null
  }

  function setPreviewCoordinate({ longitude, latitude }: { longitude: number; latitude: number }) {
    previewCoordinates.value = { longitude, latitude }
  }

  function setPreviewEGRID(egridResponse) {
    previewEGRID.value = egridResponse
  }

  function setPreviewFeatures(plotFeatures) {
    previewFeatures.value = plotFeatures
  }

  function setContentType(newContentType) {
    contentType.value = newContentType
  }

  function toggleGlossaryVisibility() {
    contentType.value = contentType.value === 'glossary' ? 'map' : 'glossary'
  }

  function toggleImprintAndLegalVisibility() {
    contentType.value = contentType.value === 'imprintAndLegal' ? 'map' : 'imprintAndLegal'
  }

  function closeGlossary() {
    contentType.value = 'map'
  }

  function closeImprintAndLegal() {
    contentType.value = 'map'
  }

  function toggleSearchVisibility() {
    isSearchVisible.value = !isSearchVisible.value
  }

  async function searchResultSelected(item) {
    setSelectedSearchResult(item)

    if (item) {
      const swissCoordinates =
        item.x && item.y
          ? [item.x, item.y]
          : convertToSwissCoordinates(item.lon, item.lat)

      setJumpToCoordinates(swissCoordinates)

      const globalCoordinate = { longitude: item.lon, latitude: item.lat }
      const swissCoordinate = {
        longitude: swissCoordinates[0],
        latitude: swissCoordinates[1],
      }
      await previewCoordinate({ swissCoordinate, globalCoordinate })
    }
  }

  async function updateSearchQuery(newSearchQuery) {
    if (!newSearchQuery || newSearchQuery === '') {
      return
    }

    markSearchResultIsLoading()
    setSearchQuery(newSearchQuery)

    const encodedQuery = encodeURI(searchQuery.value)
    const endpoint = stringTemplate(searchService.value.search, {
      query: encodedQuery,
    })

    try {
      const response = await fetch(endpoint)
      const data = await response.json()

      if (typeof searchService.value.parser !== 'function')
        throw new Error(
          'searchService.parse is not a function. provide a function to parse the response as search result.',
        )

      const results = searchService.value.parser(data)

      setSearchResults(results)
      markSearchResultIsCompleted()
    } catch (err) {
      setSearchResults([])
      markSearchResultIsCompleted()
      throw err
    }
  }

  function centerObjectActionClicked() {
    const propertyStore = usePropertyStore()
    propertyStore.refocusFeatures()
  }

  function zoomInActionClicked() {
    const newValue = zoom.value + 0.5
    if (newValue <= 42) {
      setZoom(newValue)
    }
  }

  function zoomOutActionClicked() {
    const newValue = zoom.value - 0.5
    if (newValue >= 0) {
      setZoom(newValue)
    }
  }

  function setSatelliteView() {
    setView('satellite')
  }

  function setMapView() {
    setView('map')
  }

  async function enableTokenUpdater() {
    const id = setInterval(async () => {
      if (esriTokenExpiredAt.value && esriTokenExpiredAt.value > Date.now()) {
        // skip if token not expired
        return
      }

      const token = await fetchEsriToken()
      useEsriToken(token)
    }, 30 * 1000)

    setTokenUpdateIntervalId(id)

    const token = await fetchEsriToken()
    useEsriToken(token)
  }

  function disableTokenUpdater() {
    clearTokenUpdateIntervalId()
  }

  async function updateToken() {
    const token = await fetchEsriToken()
    useEsriToken(token)
  }

  async function previewCoordinate({ globalCoordinate, swissCoordinate }) {
    const notificationStore = useNotificationStore()
    const { getEGRID } = useOereb()

    clearPreview()
    setPreviewCoordinate(swissCoordinate)

    let EGRIDs

    try {
      EGRIDs = (await getEGRID(globalCoordinate)) || []

      setPreviewEGRID(EGRIDs)
      setPreviewFeatures(EGRIDs[0]?.limit ?? null)

      if (EGRIDs.length === 1) {
        // auto start extraction
        const propertyStore = usePropertyStore()
        await propertyStore.showExtractById(EGRIDs[0].egrid)
        clearPreview()
      }
    } catch (error) {
      console.error('Error in previewCoordinate:', error)

      clearPreview()

      let warning = 'oereb_service_not_available'
      if (error.response?.status === 500) warning = 'oereb_service_500'
      if (error.response?.status === 204) warning = 'oereb_service_204'

      notificationStore.notifyWarning({ text: warning, vars: {} })
    }
  }

  function setSkipZoomWatch(value: boolean) {
    skipZoomWatch.value = value
  }

  return {
    tokenUpdateIntervalId,
    esriToken,
    esriTokenExpiredAt,
    viewType,
    zoom,
    searchQuery,
    searchResults,
    selectedSearchResult,
    isSearchResultLoading,
    isSearchVisible,
    jumpToCoordinates,
    previewCoordinates,
    previewFeatures,
    previewEGRID,
    contentType,
    isSatelliteView,
    isMapView,
    skipZoomWatch,
    initializeStore,
    setTokenUpdateIntervalId,
    clearTokenUpdateIntervalId,
    useEsriToken,
    setView,
    setJumpToCoordinates,
    jumpToSwissCoordinates,
    setZoom,
    setSearchQuery,
    setSearchResults,
    setSelectedSearchResult,
    markSearchResultIsLoading,
    markSearchResultIsCompleted,
    showSearch,
    hideSearch,
    clearPreview,
    setPreviewCoordinate,
    setPreviewEGRID,
    setPreviewFeatures,
    setContentType,
    toggleGlossaryVisibility,
    toggleImprintAndLegalVisibility,
    closeGlossary,
    closeImprintAndLegal,
    toggleSearchVisibility,
    searchResultSelected,
    updateSearchQuery,
    centerObjectActionClicked,
    zoomInActionClicked,
    zoomOutActionClicked,
    setSatelliteView,
    setMapView,
    enableTokenUpdater,
    disableTokenUpdater,
    updateToken,
    previewCoordinate,
    setSkipZoomWatch,
  }
})
