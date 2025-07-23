<template>
  <img
    :src="props.imageSrc"
    :alt="$t('click-to-play-audio')"
    class="clickable"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue"

const props = defineProps<{
  imageSrc: string
  audioSrc: string
  gotoLink?: string
  delay?: number
}>()

const audio = ref<HTMLAudioElement | null>(null)

const handleClick = async () => {
  try {
    if (!audio.value) {
      let audioPath = props.audioSrc
      if (!audioPath.startsWith("http") && !audioPath.startsWith("/")) {
        audioPath = `/${audioPath}`
      }

      audio.value = new Audio(audioPath)
      audio.value.addEventListener("error", (e) => {
        console.error("Audio failed to load:", audioPath, e)
      })
    }

    await audio.value.play()

    if (props.gotoLink) {
      setTimeout(() => {
        if ((props.gotoLink ?? window.location.href).startsWith("http")) {
          window.open(props.gotoLink, "_blank")
        } else {
          window.location.href = props.gotoLink ?? window.location.href
        }
      }, props.delay ?? 100)
    }
  } catch (error) {
    console.error("Failed to play audio:", error)
  }
}

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
})
</script>

<style>
.clickable {
  cursor: pointer;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: fill;
  overflow: hidden;
  display: block;
}
</style>
