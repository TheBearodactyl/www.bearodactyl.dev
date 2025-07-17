<template>
    <div class="book-grid-container" :class="{ 'fade-in': isContentVisible }">
        <div v-if="books.length > 0" class="book-grid">
            <BookCard v-for="(book, index) in books" :key="book.id" :book="book" :index="index" :viewMode="viewMode"
                :is-expanded="expandedCard === book.id" @toggle-card="emitToggleCard(book.id)" />
        </div>
        <div v-else class="no-results">
            {{ $t('results.none') }}
        </div>
    </div>
</template>

<script setup>
import BookCard from './BookCard.vue';

defineProps({
    books: Array,
    isContentVisible: Boolean,
    viewMode: String,
    expandedCard: [String, Number, null]
});

const emit = defineEmits(['toggle-card']);

const emitToggleCard = (bookId) => {
    emit('toggle-card', bookId);
};
</script>