<script setup lang="ts">
import LinkedImage from "@/components/LinkedImage.vue"
import { useHead } from "@unhead/vue"

useHead({
  title: "The Bearodactyl",
})
</script>

<template>
  <LinkedImage image-src="/images/bearodactyl_painting.jpg" audio-src="/audio/bearo.mp3" />
</template>
