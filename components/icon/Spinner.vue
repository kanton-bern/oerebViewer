<template>
  <svg class="spinner">
    <circle cx="30" cy="30" r="28" />
  </svg>
</template>

<style scoped>
.spinner {
  --spinner-size: 60px;
  --spinner-color: currentColor;
  --spinner-width: 4px;

  width: var(--spinner-size);
  height: var(--spinner-size);

  circle {
    fill: transparent;
    stroke: var(--spinner-color);
    stroke-width: var(--spinner-width);
    stroke-linecap: round;
    stroke-dasharray: calc(3.14 * var(--spinner-size));
    transform-origin: center;
    animation: spinner 4s linear infinite;
  }
}

@keyframes spinner {
  0%, 100% {
    transform: rotate(0deg);
    stroke-dashoffset: calc(0.66 * var(--spinner-size));
  }
  50% {
    transform: rotate(720deg);
    stroke-dashoffset: calc(3.14 * var(--spinner-size));
  }
}
</style>
