<template>
  <div class="book-grid-container" :class="{ 'fade-in': isContentVisible }">
    <div v-if="books.length > 0" class="book-grid">
      <BookCard
        v-for="(book, index) in books"
        :key="book.id"
        :book="book"
        :index="index"
        :viewMode="viewMode"
        :is-expanded="expandedCard === book.id"
        @toggle-card="emitToggleCard(book.id)"
      />
    </div>
    <div v-else class="no-results">
      {{ $t("no-results") }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from "@/composables/books/useData"
import BookCard from "./BookCard.vue"

defineProps<{
  books: Book[]
  isContentVisible: boolean
  viewMode: string
  expandedCard: string | number | null
}>()

const emit = defineEmits(["toggle-card"])

const emitToggleCard = (bookId: string | number) => {
  emit("toggle-card", bookId)
}
</script>
