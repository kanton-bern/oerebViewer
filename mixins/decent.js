export default {
  inject: {
    parentIsDecent: {
      default: false,
    },
  },

  provide() {
    return {
      parentIsDecent: this.isDecent,
    }
  },

  props: {
    decent: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isDecent() {
      return this.decent || this.parentIsDecent
    },
  },
}
