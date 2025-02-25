import { getOerebService } from '~/config/setup'
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
      const data = await $fetch(url)

      // Check if the response is undefined or null (likely a 204 No Content for temporary parcels)
      if (data === undefined || data === null) {
        // Check if this is a temporary parcel number
        const isTempParcel = EGRID.match(/^[A-Z]{2}\d+[A-Z]+\d+-\d+-\d+$/) !== null

        // Create an error with a special property for temporary parcels
        const error = new Error('Empty response') as Error & {
          response?: { status: number },
          isTempParcel?: boolean
        }
        error.response = { status: 204 }
        error.isTempParcel = isTempParcel
        throw error
      }

      // Check if the response has the expected structure
      if (data && typeof data === 'object' && 'GetExtractByIdResponse' in data) {
        return data.GetExtractByIdResponse
      } else if (data && typeof data === 'object' && 'extract' in data) {
        // Some services might return the extract directly
        return data
      } else {
        const error = new Error('Unexpected response structure') as Error & { invalidData?: boolean }
        error.invalidData = true
        throw error
      }
    } catch (error) {
      // If it's already our custom error with isTempParcel, just rethrow it
      if (error instanceof Error && 'isTempParcel' in error) {
        throw error
      }

      // Check if it's a 204 response (No Content)
      if (error &&
          typeof error === 'object' &&
          'response' in error &&
          error.response &&
          typeof error.response === 'object' &&
          'status' in error.response &&
          error.response.status === 204) {

        // Check if this is a temporary parcel number
        const isTempParcel = EGRID.match(/^[A-Z]{2}\d+[A-Z]+\d+-\d+-\d+$/) !== null

        // Create a new Error with the isTempParcel property
        const newError = new Error('204 No Content') as Error & {
          response?: { status: number },
          isTempParcel?: boolean
        }
        newError.response = { status: 204 }
        newError.isTempParcel = isTempParcel

        throw newError
      }

      // For other errors, mark as invalid data
      const newError = error instanceof Error ? error : new Error(String(error))
      ;(newError as Error & { invalidData?: boolean }).invalidData = true

      throw newError
    }
  }

  return {
    getEGRID,
    getExtractById,
  }
}
