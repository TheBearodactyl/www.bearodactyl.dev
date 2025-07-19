<script setup lang="ts">
import GamesGallery from '@/components/gamesgallery/GamesGallery.vue';
import { useHead } from '@unhead/vue';

useHead({
  title: "Games I Play"
})
</script>

<template>
  <GamesGallery />
</template>
