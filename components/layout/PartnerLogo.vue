<template>
  <div
    class="logo"
    :style="{ backgroundImage: `url(${src})` }"
    :class="{
      canton: type === 'canton',
      federal: type === 'federal',
      municipal: type === 'municipal',
    }"
  />
</template>

<script setup>
defineProps({
  src: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
})
</script>

<style lang="scss" scoped>
.logo {
  display: block;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  @apply bg-theme-thirdly;
  background-blend-mode: multiply;
}

.canton {
  width: 200px;
  height: 70px;
  margin-left: -24px;
  margin-right: 24px;
}

.federal {
  width: 300px;
  height: 100px;
}

.logo.municipal {
  width: 40px;
  height: calc(40px * var(--ratio-municipality-banner));
  margin-right: 15px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
}
</style>
