<template>
  <LinkedImage image-src="https://static.wikia.nocookie.net/youtube/images/9/94/Wulzy_Face_Meme.jpg"
    audio-src="https://www.myinstants.com/media/sounds/woah-its-wulzy_7tCVMiV.mp3"
    goto-link="https://www.youtube.com/@Wulzy" />
</template>

<script lang="ts" setup>
import LinkedImage from '@/components/LinkedImage.vue';
import { useHead } from '@unhead/vue';

useHead({
  title: "Woah."
})
</script>
