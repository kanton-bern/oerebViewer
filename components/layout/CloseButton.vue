<template>
  <div>
    <div class="flex flex-row">
      <div class="cursor-pointer mt-2 pl-2 mr-2" @click="$emit('clicked')">
        {{ $t('close') }}
      </div>
      <div><MapActionCloseButton @clicked="$emit('clicked')" /></div>

    </div>
  </div>
</template>
