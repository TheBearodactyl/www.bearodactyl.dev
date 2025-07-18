<template>
    <div class="book-grid-container" :class="{ 'fade-in': isContentVisible }">
        <div class="book-grid">
            <div v-for="(game, index) in filteredGames" :key="game.id" class="book-card"
                :class="{ 'expanded': expandedCard === game.id, 'list-view': viewMode === 'list', 'explicit-content': game.explicit }"
                :style="{ 'animation-delay': `${index * 0.1}s` }" @click="emitToggleCard(game.id)">
                <div class="book-compact" v-show="expandedCard !== game.id">
                    <div class="book-cover">
                        <NuxtImg :src="game.coverImage" :alt="`Cover of ${game.title}`" class="cover-image" />
                        <div v-if="game.explicit" class="explicit-icon">
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
                        <h3 class="book-title">{{ game.title }}</h3>
                        <p class="book-author">{{ game.developer }}</p>
                        <div class="read-status">{{ game.status }}</div>
                        <div class="book-genres">
                            <span v-for="genre in game.genres.slice(0, 5)" :key="genre" class="book-genre">{{ genre
                            }}</span>
                        </div>
                        <div class="book-tags" v-if="game.tags">
                            <span v-for="tag in game.tags.slice(0, 5)" :key="tag" class="book-tag">{{ tag }}</span>
                        </div>
                        <div class="book-rating">
                            <span class="stars">
                                <span v-for="star in (game.title === 'P5R' ? 500 : 5)" :key="star"
                                    class="star" :class="{ 'filled': star <= game.rating }">★</span>
                            </span>
                            <span class="rating-text">{{ game.rating }}/5</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="filteredGames.length === 0" class="no-results">
            {{ $t('results.none') }}
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    filteredGames: Array,
    isContentVisible: Boolean,
    viewMode: String,
    expandedCard: [String, Number, null]
});

const emit = defineEmits(['toggle-card']);

const emitToggleCard = (bookId) => {
    emit('toggle-card', bookId);
};
</script>