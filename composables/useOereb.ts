import { getOerebService } from '~/config/setup.js'
import { stringTemplate } from '~/helpers/template'

export function useOereb() {
  async function getEGRID({
    longitude,
    latitude,
  }: {
    longitude: number;
    latitude: number;
  }) {
    const oerebService = await getOerebService()

    if (!oerebService || typeof oerebService !== 'object') {
      console.error('oerebService is not an object:', oerebService)
      throw new TypeError('oerebService must be an object')
    }

    if (!oerebService.getEGRIDByCoordinate) {
      console.error('oerebService.getEGRIDByCoordinate is missing')
      throw new TypeError('oerebService.getEGRIDByCoordinate is required')
    }

    if (typeof oerebService.getEGRIDByCoordinate !== 'string') {
      console.error(
        'oerebService.getEGRIDByCoordinate is not a string:',
        oerebService.getEGRIDByCoordinate,
      )
      throw new TypeError('oerebService.getEGRIDByCoordinate must be a string')
    }

    const url = stringTemplate(oerebService.getEGRIDByCoordinate, {
      longitude,
      latitude,
    })

    const response = await $fetch(url)

    if (!response) {
      return false
    }

    interface GetEGRIDResponse {
      GetEGRIDResponse: unknown;
    }

    if (
      response &&
      typeof response === 'object' &&
      'GetEGRIDResponse' in response
    ) {
      const typedResponse = response as GetEGRIDResponse
      return typedResponse.GetEGRIDResponse
    } else {
      return false
    }
  }

  async function getExtractById({
    EGRID,
    language,
  }: {
    EGRID: string;
    language: string;
  }) {
    const oerebService = await getOerebService()

    if (!oerebService || typeof oerebService !== 'object') {
      console.error('oerebService is not an object:', oerebService)
      throw new TypeError('oerebService must be an object')
    }

    if (!oerebService.getExtractByEGRID) {
      console.error('oerebService.getExtractByEGRID is missing')
      throw new TypeError('oerebService.getExtractByEGRID is required')
    }

    if (typeof oerebService.getExtractByEGRID !== 'string') {
      console.error(
        'oerebService.getExtractByEGRID is not a string:',
        oerebService.getExtractByEGRID,
      )
      throw new TypeError('oerebService.getExtractByEGRID must be a string')
    }

    const url = stringTemplate(oerebService.getExtractByEGRID, {
      EGRID,
      language,
    })

    try {
      const data = await $fetch<{ GetExtractByIdResponse: unknown }>(url)
      return data.GetExtractByIdResponse
    } catch (error) {
      if (error instanceof Error) {
        (error as Error & { invalidData?: boolean }).invalidData = true
      } else {
        console.error('An unknown error occurred:', error)
      }
      throw error
    }
  }

  return {
    getEGRID,
    getExtractById,
  }
}
