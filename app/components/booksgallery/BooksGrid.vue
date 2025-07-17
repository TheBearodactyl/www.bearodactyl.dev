<template>
    <div class="book-grid-container" :class="{ 'fade-in': isContentVisible }">
        <div class="book-grid">
            <div v-for="(book, index) in filteredBooks" :key="book.id" class="book-card"
                :class="{ 'expanded': expandedCard === book.id, 'list-view': viewMode === 'list', 'explicit-content': book.explicit }"
                :style="{ 'animation-delay': `${index * 0.1}s` }" @click="emitToggleCard(book.id)">
                <div class="book-compact" v-show="expandedCard !== book.id">
                    <div class="book-cover">
                        <NuxtImg :src="book.coverImage" :alt="`Cover of ${book.title}`" class="cover-image" />
                        <div v-if="book.explicit" class="explicit-icon">
                            <span class="icon-warning">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"
                                    fill="none" stroke="red" stroke-width="2.5" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-alert-triangle">
                                    <path
                                        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z">
                                    </path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            </span>
                            <span class="explicit-label">{{ $t('info.explicit') }}</span>
                        </div>
                    </div>
                    <div class="book-info">
                        <h3 class="book-title">{{ book.title }}</h3>
                        <p class="book-author">{{ book.author }}</p>
                        <div class="read-status">{{ book.status }}</div>
                        <div class="book-genres">
                            <span v-for="genre in book.genres.slice(0, 5)" :key="genre" class="book-genre">{{ genre
                                }}</span>
                        </div>
                        <div class="book-tags" v-if="book.tags">
                            <span v-for="tag in book.tags.slice(0, 5)" :key="tag" class="book-tag">{{ tag }}</span>
                        </div>
                        <div class="book-rating">
                            <span class="stars">
                                <span v-for="star in (book.title === ('One Piece' || 'The DSM-5') ? 50 : 5)" :key="star"
                                    class="star" :class="{ 'filled': star <= book.rating }">★</span>
                            </span>
                            <span class="rating-text">{{ book.rating }}/5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="filteredBooks.length === 0" class="no-results">
            {{ $t('results.none') }}
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    filteredBooks: Array,
    isContentVisible: Boolean,
    viewMode: String,
    expandedCard: [String, Number, null]
});

const emit = defineEmits(['toggle-card']);

const emitToggleCard = (bookId) => {
    emit('toggle-card', bookId);
};
</script>