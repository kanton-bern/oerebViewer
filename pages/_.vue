<template>
  <div class="hidden" />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',

  beforeMount() {
    if (this.$route.path.includes('!')) {
      this.$router.push(this.$route.path.replace('!/', '').replace('//', ''))
      return
    }

    this.showActiveExtract(this.$route.path)
  },

  methods: {
    ...mapActions('property', ['showActiveExtract']),
  },
}
</script>
