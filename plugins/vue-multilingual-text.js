import Vue from 'vue'

export function multilingualtext(value) {
  return value?.[0]?.Text || value?.Text || ''
}

Vue.filter('multilingualtext', multilingualtext)
