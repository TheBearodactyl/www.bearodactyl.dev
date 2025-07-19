<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const openSource = () => {
  window.open("https://github.com/TheBearodactyl/bearodactyl.dev", "_blank")

  setTimeout(() => {
    router.push("/");
  }, 3000)
}

onMounted(openSource)
</script>
