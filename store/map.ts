import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { convertToSwissCoordinates } from '~/helpers/coordinates'
import { usePropertyStore } from '~/store/property'
import { useNotificationStore } from '~/store/notification'
import { getView, getSearchService } from '~/config/setup'
import { stringTemplate } from '~/helpers/template'
import { fetchEsriToken } from '~/services/esritoken'
import { useOereb } from '~/composables/useOereb'

interface EsriToken {
  token: string
  expires: number
}

interface SearchResult {
  x?: number
  y?: number
  lon?: number
  lat?: number
  [key: string]: unknown
}

interface Coordinates {
  longitude: number
  latitude: number
}

interface ConfigObject {
  [key: string]: unknown
}

interface EGRIDResponse {
  egrid?: string
  limit?: Record<string, unknown>
  [key: string]: unknown
}

export const useMapStore = defineStore('map', () => {
  const tokenUpdateIntervalId = ref<NodeJS.Timeout | null>(null)
  const esriToken = ref<string | null>(null)
  const esriTokenExpiredAt = ref<number | null>(null)
  const viewType = ref<string>('map')
  const zoom = ref<number | null>(null)
  const searchQuery = ref<string | null>(null)
  const searchResults = ref<SearchResult[]>([])
  const selectedSearchResult = ref<SearchResult | null>(null)
  const isSearchResultLoading = ref<boolean>(false)
  const isSearchVisible = ref<boolean>(true)
  const jumpToCoordinates = ref<[number, number] | null>(null)
  const previewCoordinates = ref<Coordinates | null>(null)
  const previewFeatures = ref<Record<string, unknown> | null>(null)
  const previewEGRID = ref<EGRIDResponse[] | null>(null)
  const contentType = ref<string>('map')
  const view = ref<ConfigObject | null>(null)
  const searchService = ref<ConfigObject | null>(null)
  const minZoom = ref<number>(0)
  const maxZoom = ref<number>(42)

  async function initializeStore() {
    const viewConfig = await getView()
    view.value = viewConfig
    zoom.value = viewConfig.zoom
    minZoom.value = viewConfig.minZoom || 0
    maxZoom.value = viewConfig.maxZoom || 42
    searchService.value = await getSearchService()
  }

  const isSatelliteView = computed(() => viewType.value === 'satellite')
  const isMapView = computed(() => viewType.value === 'map')

  function setTokenUpdateIntervalId(id: NodeJS.Timeout) {
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

  function setJumpToCoordinates(coordinates: [number, number] | null) {
    jumpToCoordinates.value = coordinates
  }

  function jumpToSwissCoordinates(coordinates: [number, number]) {
    setJumpToCoordinates(coordinates)
  }

  function setZoom(newZoom: number) {
    zoom.value = newZoom
  }

  function setSearchQuery(newSearchQuery: string | null) {
    searchQuery.value = newSearchQuery
  }

  function setSearchResults(newSearchResults: SearchResult[]) {
    searchResults.value = newSearchResults
  }

  function setSelectedSearchResult(newSelectedSearchResult: SearchResult | null): void {
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

  function setPreviewEGRID(egridResponse: EGRIDResponse[]) {
    previewEGRID.value = egridResponse
  }

  function setPreviewFeatures(plotFeatures: Record<string, unknown> | null) {
    previewFeatures.value = plotFeatures
  }

  function setContentType(newContentType: string) {
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

  async function searchResultSelected(item: SearchResult) {
    setSelectedSearchResult(item)

    if (item) {
      const swissCoordinates =
        item.x && item.y
          ? [item.x, item.y] as [number, number]
          : convertToSwissCoordinates(item.lon!, item.lat!)

      setJumpToCoordinates(swissCoordinates)

      const globalCoordinate = { longitude: item.lon!, latitude: item.lat! }
      const swissCoordinate = {
        longitude: swissCoordinates[0],
        latitude: swissCoordinates[1],
      }
      await setPreviewCoordinate({ globalCoordinate, swissCoordinate })
    }
  }

  async function updateSearchQuery(newSearchQuery: string) {
    if (!newSearchQuery || newSearchQuery === '') {
      return
    }

    markSearchResultIsLoading()
    setSearchQuery(newSearchQuery)

    const encodedQuery = encodeURI(searchQuery.value || '')

    if (!searchService.value) {
      throw new Error('Search service not initialized')
    }

    const endpoint = stringTemplate(searchService.value.search as string, {
      query: encodedQuery,
    })

    try {
      const response = await fetch(endpoint)
      const data = await response.json()

      if (typeof searchService.value?.parser !== 'function')
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
    if (zoom.value === null) return

    const newValue = zoom.value + 0.5
    console.log('zoomInActionClicked', newValue, zoom.value)
    if (newValue <= maxZoom.value) {
      console.log('zoomInActionClicked2', newValue, zoom.value)
      setZoom(newValue)
    }
  }

  function zoomOutActionClicked() {
    if (zoom.value === null) return

    const newValue = zoom.value - 0.5
    console.log('zoomOutActionClicked', newValue, zoom.value)
    if (newValue >= minZoom.value) {
      console.log('zoomOutActionClicked2', newValue, zoom.value)
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

  async function setPreviewCoordinate({ globalCoordinate, swissCoordinate }: { globalCoordinate: Coordinates, swissCoordinate: Coordinates }) {
    const notificationStore = useNotificationStore()
    const { getEGRID } = useOereb()

    clearPreview()
    previewCoordinates.value = swissCoordinate

    let EGRIDs: EGRIDResponse[] = []

    try {
      const response = await getEGRID(globalCoordinate)
      EGRIDs = Array.isArray(response) ? response : []

      setPreviewEGRID(EGRIDs)
      setPreviewFeatures(EGRIDs[0]?.limit ?? null)

      if (EGRIDs.length === 1 && EGRIDs[0].egrid) {
        // auto start extraction
        const propertyStore = usePropertyStore()
        propertyStore.showExtractById(EGRIDs[0].egrid as string)
        clearPreview()
      }
    } catch (error: unknown) {
      console.error('Error in previewCoordinate:', error)

      clearPreview()

      let warning = 'oereb_service_not_available'

      // Type guard for error with response property
      interface ErrorWithResponse {
        response?: { status?: number };
      }

      const isErrorWithResponse = (err: unknown): err is ErrorWithResponse => {
        return typeof err === 'object' && err !== null && 'response' in err
      }

      if (isErrorWithResponse(error)) {
        if (error.response?.status === 500) warning = 'oereb_service_500'
        if (error.response?.status === 204) warning = 'oereb_service_204'
      }

      notificationStore.notifyWarning({ text: warning, vars: {} })
    }
  }

  return {
    tokenUpdateIntervalId,
    esriToken,
    esriTokenExpiredAt,
    viewType,
    zoom,
    minZoom,
    maxZoom,
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
  }
})
