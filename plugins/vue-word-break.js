import isString from 'lodash/isString'
import Vue from 'vue'

export function wordbreak(value) {
  return isString(value) ? value.replace(/_/g, `_\u00AD`) : value
}

Vue.filter('wordbreak', wordbreak)
