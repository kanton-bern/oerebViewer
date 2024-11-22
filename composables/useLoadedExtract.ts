import { storeToRefs } from 'pinia'
import { usePropertyStore } from '~/store/property'
import type { GetExtractByIdResponse } from '~/types/extract'

export function useLoadedExtract() {
  const propertyStore = usePropertyStore()
  const { loadedExtract } = storeToRefs(propertyStore) as { loadedExtract: Ref<GetExtractByIdResponse | null> }

  return {
    loadedExtract,
  }
}
