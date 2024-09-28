type MultilingualText = {
  Text: string
  Language?: string
}

export function useMultilingualText() {
  const multilingualText = (value: MultilingualText[] | MultilingualText | string | null | undefined): string => {
    if (Array.isArray(value)) {
      return value[0]?.Text || ''
    }
    if (typeof value === 'object' && value !== null) {
      return value.Text || ''
    }
    return value || ''
  }

  return {
    multilingualText,
  }
}
