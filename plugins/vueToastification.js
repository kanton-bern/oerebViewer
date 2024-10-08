/**
 * This plugin is used to load the vue3-toastify plugin
 * used for displaying notifications
 */
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    Vue3Toastify,
    {
      closeOnClick: false,
      autoClose: 4000,
      limit: 20,
      theme: 'auto',
      position: toast.POSITION.BOTTOM_RIGHT,
    },
  )

  return {
    provide: { toast },
  }

})
