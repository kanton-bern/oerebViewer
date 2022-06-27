import axios from 'axios'
import { oerebService, stringTemplate } from '~/config/setup'

/**
 * Resolve EGRID by Coordinate
 *
 * @param {Object} coordinate as globalCoordinate(EPSG:4326) {latitude, longitude}
 * @param {Number} coordinate.latitude
 * @param {Number} coordinate.longitude
 * @returns {Promise<import('~/types/extract').GetEGRIDResponse>}
 */
export async function getEGRID({ longitude, latitude }) {
  if (
    !oerebService ||
    !oerebService.getEGRIDByCoordinate ||
    typeof oerebService.getEGRIDByCoordinate !== 'string'
  ) {
    throw new TypeError(
      'Requires oerebService.getEGRIDByCoordinate to be String'
    )
  }

  const url = stringTemplate(oerebService.getEGRIDByCoordinate, {
    longitude,
    latitude,
  })

  const response = await axios.get(url)

  if (response.status === 204) {
    return false
  }

  const data = response.data

  if (data !== Object(data) || !data.GetEGRIDResponse) {
    return false
  }

  return data.GetEGRIDResponse
}

/**
 * Get extract by EGRID
 *
 * @param {Object} request as {EGRID, language}
 * @param {String} request.EGRID id to be extracted
 * @param {String} request.language langauge of the extract
 * @returns {Promise<import('~/types/extract').GetExtractByIdResponse>}
 */
export async function getExtractById({ EGRID, language }) {
  const url = stringTemplate(oerebService.getExtractByEGRID, {
    EGRID,
    language,
  })

  const response = await axios.get(url)

  try {
    const data = response.data

    return data.GetExtractByIdResponse
  } catch (error) {
    error.invalidData = true
    throw error
  }
}
