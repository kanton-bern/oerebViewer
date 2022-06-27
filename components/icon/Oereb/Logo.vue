<template>
  <div>
    <IconOerebFr v-if="$i18n.locale == 'fr'" />
    <IconOerebIt v-else-if="$i18n.locale == 'it'" />
    <IconOerebDe v-else />
  </div>
</template>
