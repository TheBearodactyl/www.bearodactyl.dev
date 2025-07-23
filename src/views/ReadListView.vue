<script setup lang="ts">
import BooksGallery from "@/components/booksgallery/BooksGallery.vue"
import { useHead } from "@unhead/vue"

useHead({
  title: "Read/Watch List",
})
</script>

<template>
  <div>
    <BooksGallery />
  </div>
</template>
