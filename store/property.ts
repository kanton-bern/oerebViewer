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
import type { Extract as ExtractType } from '~/types/extractdata'

interface ConfigObject {
  [key: string]: unknown;
}

interface RealEstate {
  EGRID: string;
  Number?: string;
  MunicipalityName?: string;
  MunicipalityCode?: string | number;
  SubunitOfLandRegister?: string;
  Limit?: Record<string, unknown>;
  RestrictionOnLandownership: Restriction[];
}

interface Theme {
  Code: string;
  SubCode?: string;
  [key: string]: unknown;
}

interface Lawstatus {
  Code: string;
  [key: string]: unknown;
}

interface Restriction {
  Theme: Theme;
  Lawstatus: Lawstatus;
  TypeCode?: string;
  NrOfPoints?: number;
  PartInPercent?: number;
  AreaShare?: number;
  LengthShare?: number;
  LegalProvisions?: unknown[];
  [key: string]: unknown;
}

interface Extract {
  RealEstate: RealEstate;
  pdfExtractUrl?: string;
  externalUrl?: string;
  ownerUrl?: string;
  language?: string;
  [key: string]: unknown;
}

interface TemplateVarsType {
  [key: string]: string | undefined;
}

export const usePropertyStore = defineStore('property', () => {
  const extract = ref<Extract | null>(null)
  const loading = ref<boolean>(false)
  const extractFeatures = ref<Record<string, unknown> | null>(null)
  const activeThemeCode = ref<string | null>(null)
  const activeLawStatusCode = ref<string | null>(null)
  const pdfService = ref<ConfigObject | null>(null)
  const externalService = ref<ConfigObject | null>(null)
  const ownerService = ref<ConfigObject | null>(null)

  const router = useRouter()
  const i18n = useI18n()

  async function initializeStore() {
    pdfService.value = await getPdfService()
    externalService.value = await getExternalService()
    ownerService.value = await getOwnerService()
  }

  async function setExtract({ extract: newExtract, language }: { extract: Extract; language: string }) {
    const templateVars = extractToTemplateVars(newExtract as unknown as {
      RealEstate?: {
        EGRID?: string;
        Number?: string;
        MunicipalityName?: string;
        MunicipalityCode?: string;
        SubunitOfLandRegister?: string;
      };
      CreationDate?: string;
      MunicipalityLogoRef?: string;
    }, { language })

    if (pdfService.value?.getPDFUrlByEGRID) {
      newExtract.pdfExtractUrl = stringTemplate(
        pdfService.value.getPDFUrlByEGRID as string,
        templateVars as Record<string, string>,
      )
    }

    if (externalService.value?.getExternalUrlByEGRID) {
      newExtract.externalUrl = stringTemplate(
        externalService.value.getExternalUrlByEGRID as string,
        templateVars as Record<string, string>,
      )
    }

    if (ownerService.value?.getOwnerUrlByEGRID) {
      newExtract.ownerUrl = stringTemplate(
        ownerService.value.getOwnerUrlByEGRID as string,
        templateVars as Record<string, string>,
      )
    }

    newExtract.language = language

    extract.value = newExtract
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading
  }

  function setFeatures(plotFeatures: Record<string, unknown> | null) {
    extractFeatures.value = plotFeatures
  }

  function setActiveThemeCode(code: string | null) {
    activeThemeCode.value = code
  }

  function setActiveLawStatusCode(code: string | null) {
    activeLawStatusCode.value = code
  }

  function showExtractById(EGRID: string) {
    const languagePrefix = i18n.locale.value !== 'de' ? `/${i18n.locale.value}` : ''
    router.push(`${languagePrefix}/d/${EGRID}`)
  }

  function showActiveExtract(path: string) {
    // Get the full URL to check query parameters for old format of URLs
    const url = window.location.href
    if (url.includes('extract/url')) {
      const urlParams = new URL(url).searchParams
      const egridFromQuery = urlParams.get('EGRID')
      const baseUrl = window.location.origin
      const languagePrefix = i18n.locale.value !== 'de' ? `/${i18n.locale.value}` : ''

      if (egridFromQuery) {
        window.location.href = `${baseUrl}/#d/${egridFromQuery}`
        return
      } else {
        window.location.href = `${baseUrl}/#/${languagePrefix}`
        return
      }
    }

    // Handle new format: /d/EGRID
    const newFormatMatch = path.match(/\/d\/([A-Z0-9-]+)$/i)
    if (newFormatMatch) {
      return loadExtractById(newFormatMatch[1])
    }
  }

  function reloadExtract(language: string | null = null) {
    if (!extract.value) return
    return loadExtractByIdAndLanguage({
      EGRID: extract.value.RealEstate.EGRID,
      language: language || (i18n.locale.value as string),
    })
  }

  async function loadExtractById(EGRID: string) {
    await loadExtractByIdAndLanguage({ EGRID, language: i18n.locale.value as string })
  }

  async function loadExtractByIdAndLanguage({
    EGRID,
    language,
  }: {
    EGRID: string;
    language: string;
  }) {
    setLoading(true)

    let newExtract: Extract | null = null

    let templateVars = extractToTemplateVars(undefined, { municipality: EGRID })
    try {
      const { getExtractById } = await useOereb()
      const response = await getExtractById({ EGRID, language })

      if (response && typeof response === 'object' && 'extract' in response && response.extract) {
        newExtract = response.extract as Extract
        templateVars = extractToTemplateVars(newExtract as unknown as {
          RealEstate?: {
            EGRID?: string;
            Number?: string;
            MunicipalityName?: string;
            MunicipalityCode?: string;
            SubunitOfLandRegister?: string;
          };
          CreationDate?: string;
          MunicipalityLogoRef?: string;
        })

        setActiveThemeCode(null)
        setActiveLawStatusCode(null)
      } else {
        throw new Error('Invalid response structure')
      }

      await setExtract({ extract: newExtract, language })
      setFeatures(newExtract.RealEstate.Limit || null)

      const historyStore = useHistoryStore()
      historyStore.addProperty(newExtract as unknown as ExtractType, language)

      const notificationStore = useNotificationStore()
      notificationStore.notifySuccess({
        text: 'notification_load_success',
        vars: templateVars,
      })
    } catch (error) {
      const err = error as {
        response?: { status?: number };
        invalidData?: boolean;
        message?: string;
        name?: string;
        isTempParcel?: boolean;
      }

      // Check if this is a temporary parcel number format
      const isTempParcel = err.isTempParcel || EGRID.match(/^[A-Z]{2}\d+[A-Z]+\d+-\d+-\d+$/) !== null

      let warning = 'oereb_service_not_available'

      // Special case for temporary parcel numbers with 204 response or undefined response
      if ((err.response?.status === 204 && isTempParcel) ||
          (err.message === 'Empty response' && isTempParcel)) {
        warning = 'oereb_service_204_temp'
        // For temporary parcel numbers with 204 response, we don't want to include the parcel number in the message
        // Create a new template vars object without the municipality/number to avoid showing them in the message
        templateVars = {} as TemplateVarsType
      }
      // Regular 204 response
      else if (err.response?.status === 204) {
        warning = 'oereb_service_204'
      }
      // 500 error
      else if (err.response?.status === 500) {
        warning = 'oereb_service_500'
      }
      // Network errors (FetchError, TypeError for undefined properties)
      else if (err.name === 'FetchError' || err.message?.includes('Cannot read properties of undefined')) {
        warning = 'oereb_service_not_available'
      }
      // Invalid data error
      else if (err.invalidData || err.message === 'Unexpected response structure' || err.message === 'Invalid response structure') {
        warning = 'oereb_service_invalid_data'
      }
      // Other errors
      else if (newExtract || !err.response?.status) {
        warning = 'oereb_service_invalid_data'
      }

      const notificationStore = useNotificationStore()

      // Always use translate: true to ensure the message is properly translated from the locale files
      notificationStore.notifyWarning({
        text: warning,
        vars: templateVars,
        translate: true,
      })
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

    function uniqueSubCode(v: Restriction, i: number, a: Restriction[]) {
      return a.findIndex((s) => s.Theme.SubCode === v.Theme.SubCode) === i
    }
  }

  const getRestrictionsByThemeCode = computed(() => (code: string, lawStatusCode?: string) => {
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

  const themeByCode = computed(() => (code: string) => {
    return !extract.value
      ? null
      : extract.value.RealEstate.RestrictionOnLandownership.find(
        (restriction) =>
          restriction.Theme.SubCode === code ||
            restriction.Theme.Code === code,
      )
  })

  const lawStatesByThemeCode = computed(() => (code: string) => {
    return !extract.value
      ? null
      : extract.value.RealEstate.RestrictionOnLandownership.filter(
        (restriction) =>
          restriction.Theme.Code === code ||
            restriction.Theme.SubCode === code,
      ).reduce((states: Lawstatus[], restriction) => {
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

function combineRestrictionByTypeCodeAndLawStatus(restrictions: Restriction[]) {
  return Object.values(
    restrictions.reduce((acc: Record<string, Restriction>, restriction) => {
      if (!acc[restriction.TypeCode + restriction.Lawstatus.Code]) {
        acc[restriction.TypeCode + restriction.Lawstatus.Code] = {
          ...restriction,
        }
        return acc
      }

      const accumulation =
        acc[restriction.TypeCode + restriction.Lawstatus.Code]

      if (typeof accumulation.NrOfPoints !== 'undefined') {
        accumulation.NrOfPoints += restriction.NrOfPoints || 0
      }
      if (typeof accumulation.PartInPercent !== 'undefined') {
        accumulation.PartInPercent += restriction.PartInPercent || 0
      }
      if (typeof accumulation.AreaShare !== 'undefined') {
        accumulation.AreaShare += restriction.AreaShare || 0
      }
      if (typeof accumulation.LengthShare !== 'undefined') {
        accumulation.LengthShare += restriction.LengthShare || 0
      }
      if (
        typeof accumulation.LegalProvisions !== 'undefined' &&
        Array.isArray(accumulation.LegalProvisions)
      ) {
        accumulation.LegalProvisions = accumulation.LegalProvisions.concat(
          restriction.LegalProvisions || [],
        )
      }

      return acc
    }, {}),
  )
}
