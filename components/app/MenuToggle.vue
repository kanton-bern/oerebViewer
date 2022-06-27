<template>
  <button
    class="flex items-center gap-2 md:gap-4"
    @click="$store.commit('app/toggleMenuOpen')"
  >
    <IconMenu class="w-6 h-6" />
    {{ $t('menu') }}
  </button>
</template>
