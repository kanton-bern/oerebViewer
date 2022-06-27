<template>
  <div>
    <div :class="listClass">
      <IconGlobe :class="iconClass" />
      <button
        v-for="locale in availableLocales"
        :key="locale.code"
        class="block cursor-pointer hover:underline"
        @click="use(locale.code)"
      >
        {{ locale.title || locale.code }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    iconClass: {
      type: String,
      default: 'h-4 w-4',
    },

    listClass: {
      type: String,
      default: 'flex gap-2',
    },
  },

  computed: {
    availableLocales() {
      return this.$store.state.app.locales.filter(
        (locale) => this.$i18n.locale !== locale.code
      )
    },
  },

  methods: {
    ...mapActions('property', ['reloadExtract']),

    use(language) {
      this.$i18n.setLocale(language)
      this.reloadExtract(language)
    },
  },
}
</script>
