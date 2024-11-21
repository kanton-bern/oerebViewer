import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useOereb } from '~/composables/useOereb'
import {
  getPdfService,
  getExternalService,
  getOwnerService,
} from '~/config/setup'
import { stringTemplate } from '~/helpers/template'
import { extractToTemplateVars } from '~/helpers/transformers'
import { useHistoryStore } from '~/store/history'
import { useNotificationStore } from '~/store/notification'
import { useMapStore } from './map'

export const usePropertyStore = defineStore('property', () => {
  const extract = ref(null)
  const loading = ref(false)
  const extractFeatures = ref(null)
  const activeThemeCode = ref(null)
  const activeLawStatusCode = ref(null)
  const pdfService = ref(null)
  const externalService = ref(null)
  const ownerService = ref(null)

  const router = useRouter()
  const i18n = useI18n()

  async function initializeStore() {
    pdfService.value = await getPdfService()
    externalService.value = await getExternalService()
    ownerService.value = await getOwnerService()
  }

  async function setExtract({ extract: newExtract, language }) {
    const templateVars = extractToTemplateVars(newExtract, { language })
    newExtract.pdfExtractUrl = stringTemplate(
      pdfService.value.getPDFUrlByEGRID,
      templateVars,
    )

    newExtract.externalUrl =
      externalService.value.getExternalUrlByEGRID &&
      stringTemplate(externalService.value.getExternalUrlByEGRID, templateVars)

    newExtract.ownerUrl =
      ownerService.value.getOwnerUrlByEGRID &&
      stringTemplate(ownerService.value.getOwnerUrlByEGRID, templateVars)

    newExtract.language = language

    extract.value = newExtract
  }
  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setFeatures(plotFeatures) {
    extractFeatures.value = plotFeatures
  }

  function setActiveThemeCode(code) {
    activeThemeCode.value = code
  }

  function setActiveLawStatusCode(code) {
    activeLawStatusCode.value = code
  }

  function showExtractById(EGRID: string) {
    const languagePrefix = i18n.locale.value !== 'de' ? `/${i18n.locale.value}` : ''
    router.push(`${languagePrefix}/d/${EGRID}`)
  }

  function showActiveExtract(path: string) {
    const EGRID = path.match(/\/d\/([A-Z0-9]+)$/i)?.[1]

    if (EGRID) {
      return loadExtractById(EGRID)
    }
  }

  function reloadExtract(language = null) {
    if (!extract.value) return
    return loadExtractByIdAndLanguage({
      EGRID: extract.value.RealEstate.EGRID as string,
      language: language || (i18n.locale.value as string),
    })
  }

  async function loadExtractById(EGRID: string) {
    const i18n = useI18n()
    await loadExtractByIdAndLanguage({ EGRID, language: i18n.locale.value })
  }

  async function loadExtractByIdAndLanguage({
    EGRID,
    language,
  }: {
    EGRID: string;
    language: string;
  }) {
    setLoading(true)

    let newExtract: Extract|null

    let templateVars = extractToTemplateVars(null, { municipality: EGRID })
    try {

      const { getExtractById } = await useOereb()
      const response = await getExtractById({ EGRID, language })

      if ('extract' in response && response.extract) {
        newExtract = response.extract as Extract
        templateVars = extractToTemplateVars(newExtract)

        setActiveThemeCode(null)
        setActiveLawStatusCode(null)
      } else {
        throw new Error('Invalid response structure')
      }

      await setExtract({ extract: newExtract, language })
      setFeatures(newExtract.RealEstate.Limit)

      const historyStore = useHistoryStore()
      historyStore.addProperty(newExtract, language)

      const notificationStore = useNotificationStore()
      notificationStore.notifySuccess({
        text: 'notification_load_success',
        vars: templateVars,
      })
    } catch (error) {
      const err = error as {
        response?: { status?: number };
        invalidData?: boolean;
      }

      let warning = 'oereb_service_not_available'
      if (err.response?.status === 500) warning = 'oereb_service_500'
      if (err.response?.status === 204) warning = 'oereb_service_204'
      if (err.invalidData || newExtract || !err.response?.status)
        warning = 'oereb_service_invalid_data'

      const notificationStore = useNotificationStore()
      notificationStore.notifyWarning({ text: warning, vars: templateVars })
    } finally {
      setLoading(false)
    }
  }

  function refocusFeatures() {
    if (extractFeatures.value) {
      const features = extractFeatures.value
      setFeatures(null)
      setTimeout(() => {
        setFeatures(features)
      }, 100)
    }
  }

  const loadedExtract = computed(() => {
    return loading.value || !extract.value ? null : extract.value
  })

  async function getSubThemesByCode(code: string) {
    return !extract.value
      ? null
      : extract.value.RealEstate.RestrictionOnLandownership.filter(
        (restriction) =>
          restriction.Theme.SubCode && restriction.Theme.Code === code,
      )
        .filter(uniqueSubCode)
        .map((restriction) => restriction.Theme)

    function uniqueSubCode(v, i, a) {
      return a.findIndex((s) => s.Theme.SubCode === v.Theme.SubCode) === i
    }
  }

  const getRestrictionsByThemeCode = computed(() => (code, lawStatusCode) => {
    return !extract.value
      ? null
      : combineRestrictionByTypeCodeAndLawStatus(
        extract.value.RealEstate.RestrictionOnLandownership.filter(
          (restriction) =>
            restriction.Theme.Code === code ||
              restriction.Theme.SubCode === code,
        ).filter(
          (restriction) =>
            !lawStatusCode || restriction.Lawstatus.Code === lawStatusCode,
        ),
      )
  })

  const themeByCode = computed(() => (code) => {
    return !extract.value
      ? null
      : extract.value.RealEstate.RestrictionOnLandownership.find(
        (restriction) =>
          restriction.Theme.SubCode === code ||
            restriction.Theme.Code === code,
      )
  })

  const lawStatesByThemeCode = computed(() => (code) => {
    return !extract.value
      ? null
      : extract.value.RealEstate.RestrictionOnLandownership.filter(
        (restriction) =>
          restriction.Theme.Code === code ||
            restriction.Theme.SubCode === code,
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
  })

  return {
    extract,
    loading,
    extractFeatures,
    activeThemeCode,
    activeLawStatusCode,
    initializeStore,
    setExtract,
    setLoading,
    setFeatures,
    setActiveThemeCode,
    setActiveLawStatusCode,
    showExtractById,
    showActiveExtract,
    reloadExtract,
    loadExtractById,
    loadExtractByIdAndLanguage,
    refocusFeatures,
    loadedExtract,
    getSubThemesByCode,
    getRestrictionsByThemeCode,
    themeByCode,
    lawStatesByThemeCode,
  }
})

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
        Array.isArray(accumulation.LegalProvisions)
      ) {
        accumulation.LegalProvisions = accumulation.LegalProvisions.concat(
          restriction.LegalProvisions,
        )
      }

      return acc
    }, {}),
  )
}
