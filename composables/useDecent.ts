import { inject, provide, computed } from 'vue'

export function useDecent(props: { decent: boolean }) {
  const parentIsDecent = inject('parentIsDecent', false)

  const isDecent = computed(() => props.decent || parentIsDecent)

  provide('parentIsDecent', isDecent.value)

  return {
    isDecent,
  }
}
