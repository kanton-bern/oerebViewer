<template>
  <div
    :class="{ hidden: !$store.state.property.loading }"
    class="absolute top-0 left-0 w-full h-full bg-white bg-opacity-30 flex justify-center items-center"
  >
    <IconSpinner class="text-theme-accent" />
  </div>
</template>
