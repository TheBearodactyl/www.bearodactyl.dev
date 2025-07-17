<template>
    <div class="expanded-card-overlay">
        <div class="book-expanded" :class="{ show: game !== null, 'explicit-content': game.explicit }">
            <div class="expanded-header">
                <button class="close-btn" @click.stop="emitCloseCard">×</button>
                <div class="expanded-cover">
                    <NuxtImg :src="game.coverImage" :alt="`Cover of ${game.title}`" class="expanded-cover-image" />
                    <div v-if="game.explicit" class="explicit-icon">
                        <span class="icon-warning">⚠️</span>
                        <span class="explicit-label">Contains Explicit Content</span>
                    </div>
                </div>
                <div class="expanded-basic-info">
                    <h3 class="expanded-title">{{ game.title }}</h3>
                    <p class="expanded-author">{{ game.developer }}</p>
                    <div class="book-genres">
                        <span v-for="genre in game.genres" :key="genre" class="book-genre">{{ genre }}</span>
                    </div>
                    <div class="book-tags" v-if="game.tags">
                        <span v-for="tag in game.tags" :key="tag" class="book-tag">{{ tag }}</span>
                    </div>
                    <div class="expanded-rating">
                        <span class="stars">
                            <span v-for="star in (game.title === ('One Piece' || 'The DSM-5') ? 50 : 5)" :key="star"
                                class="star" :class="{ 'filled': star <= game.rating }">★</span>
                        </span>
                        <span class="rating-text">{{ game.rating }}/5</span>
                    </div>
                </div>
            </div>

            <div class="expanded-content">
                <div class="description-section">
                    <h4>{{ $t('section.description') }}</h4>
                    <p>{{ game.description }}</p>
                </div>

                <div class="thoughts-section">
                    <h4>{{ $t('section.thoughts') }}</h4>
                    <p>{{ game.myThoughts }}</p>
                </div>

                <div class="links-section" v-if="game.links && game.links.length > 0">
                    <h4>{{ $t('section.links') }}</h4>
                    <div class="links-grid">
                        <a v-for="link in game.links" :key="link.title" :href="link.url" target="_blank"
                            rel="noopener noreferrer" class="book-link">
                            <span class="link-title">{{ link.title }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    game: Object
});

const emit = defineEmits(['close-card']);

const emitCloseCard = () => {
    emit('close-card');
};
</script>

<style>
@import url("/assets/css/bookgallery.css");
</style>