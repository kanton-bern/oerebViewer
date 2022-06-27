<template>
  <div
    class="logo w-full"
    :style="{ backgroundImage: `url(${src})` }"
    :class="{
      canton: type === 'canton',
      federal: type === 'federal',
      municipal: type === 'municipal',
    }"
  />
</template>

<script>
export default {
  props: {
    src: {
      required: true,
      type: String,
    },

    type: {
      required: true,
      type: String,
    },
  },
}
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

.municipal {
  width: 40px;
  height: 50px;
  margin-right: 15px;
}
</style>
