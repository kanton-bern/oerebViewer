<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

</script>

<template>
  <div>
    <IconOerebFr v-if="locale == 'fr'" />
    <IconOerebIt v-else-if="locale == 'it'" />
    <IconOerebDe v-else />
  </div>
</template>
