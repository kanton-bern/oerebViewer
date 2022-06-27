<template>
  <svg class="spinner">
    <circle cx="30" cy="30" r="28" />
  </svg>
</template>

<style lang="scss" scoped>
$spinnerSize: 60;

svg.spinner {
  width: $spinnerSize + px;
  height: $spinnerSize + px;
  x: 0px;
  y: 0px;
  viewbox: 0 0 $spinnerSize $spinnerSize;

  circle {
    fill: transparent;
    stroke: currentColor;
    stroke-width: 4;
    stroke-linecap: round;
    stroke-dasharray: (3.14 * $spinnerSize);
    transform-origin: (0.5px * $spinnerSize) (0.5px * $spinnerSize) 0;
    animation: spinner 4s linear infinite;
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
    stroke-dashoffset: (0.66 * $spinnerSize);
  }
  50% {
    transform: rotate(720deg);
    stroke-dashoffset: (3.14 * $spinnerSize);
  }
  100% {
    transform: rotate(1080deg);
    stroke-dashoffset: (0.66 * $spinnerSize);
  }
}
</style>
