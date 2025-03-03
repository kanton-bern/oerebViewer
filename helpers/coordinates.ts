import { transform } from 'ol/proj'

/**
 * Converts longitude and latitude to Swiss coordinate system (EPSG:2056)
 *
 * @param lon - Longitude in WGS84 (EPSG:4326)
 * @param lat - Latitude in WGS84 (EPSG:4326)
 * @returns Array of coordinates in Swiss coordinate system [easting, northing]
 */
export function convertToSwissCoordinates(lon: number, lat: number): [number, number] {
  const coordinates: [number, number] = [lon, lat]
  const swissCoordinates = transform(coordinates, 'EPSG:4326', 'EPSG:2056')

  return swissCoordinates as [number, number]
}
