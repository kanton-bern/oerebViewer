<template>
  <div class="flex flex-col h-screen">
    <div class="h-16 flex-shrink-0 drop-shadow">
      <slot name="header" />
    </div>
    <div class="flex flex-1 relative overflow-hidden">
      <Transition name="slide-fade">
        <aside
          v-show="allwaysShowMenu || $store.state.app.isMenuOpen"
          class="z-10 overflow-hidden drop-shadow flex-none h-full max-w-full w-80 md:w-100 lg:w-112 duration-500 absolute lg:relative"
          :class="{ 'transition-all': !allwaysShowMenu }"
        >
          <slot name="sidebar" />
        </aside>
      </Transition>
      <div class="overflow-hidden flex-auto">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    allwaysShowMenu: false,
  }),

  created() {
    this.myEventHandler()
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener('resize', this.myEventHandler)
  },

  destroyed() {
    window.removeEventListener('resize', this.myEventHandler)
  },

  methods: {
    myEventHandler(e) {
      this.allwaysShowMenu = window.innerWidth >= 1024
    },
  },
}
</script>

<style scoped>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  @apply absolute;
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  @apply absolute;
  transform: translateX(-200px);
  opacity: 0;
}
</style>
