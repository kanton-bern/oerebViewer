import { transform } from 'ol/proj'

export function convertToSwissCoordinates(lon, lat) {
  const coordinates = [lon, lat]
  const swissCoordinates = transform(coordinates, 'EPSG:4326', 'EPSG:2056')

  return swissCoordinates
}
