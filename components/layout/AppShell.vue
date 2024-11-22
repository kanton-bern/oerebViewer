<template>
  <div class="flex flex-col h-screen">
    <div class="h-16 flex-shrink-0 drop-shadow">
      <slot name="header" />
    </div>
    <div class="flex flex-1 relative overflow-hidden">
      <Transition name="slide-fade">
        <aside
          v-show="alwaysShowMenu || appStore.isMenuOpen"
          class="z-10 overflow-hidden drop-shadow flex-none h-full max-w-full w-80 md:w-100 lg:w-112 duration-500 absolute lg:relative"
          :class="{ 'transition-all': !alwaysShowMenu }"
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

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '~/store/app'

const appStore = useAppStore()
const alwaysShowMenu = ref(false)

const updateMenuVisibility = () => {
  alwaysShowMenu.value = window.innerWidth >= 1024
}

onMounted(() => {
  updateMenuVisibility()
  window.addEventListener('resize', updateMenuVisibility)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateMenuVisibility)
})
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
