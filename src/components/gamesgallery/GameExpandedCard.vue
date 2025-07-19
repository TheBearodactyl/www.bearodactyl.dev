<template>
  <div class="expanded-card-overlay">
    <div class="book-expanded" :class="{ show: props.game !== null, 'explicit-content': props.game.explicit }">
      <div class="expanded-header">
        <button class="close-btn" @click.stop="emitCloseCard">×</button>
        <div class="expanded-cover">
          <img :src="props.game.coverImage" :alt="`Cover of ${props.game.title}`" class="expanded-cover-image" />
          <div v-if="props.game.explicit" class="explicit-icon">
            <span class="icon-warning">⚠️</span>
            <span class="explicit-label">Contains Explicit Content</span>
          </div>
        </div>
        <div class="expanded-basic-info">
          <h3 class="expanded-title">{{ props.game.title }}</h3>
          <p class="expanded-author">{{ props.game.developer }}</p>
          <div class="book-genres">
            <span v-for="genre in props.game.genres" :key="genre" class="book-genre">{{ genre }}</span>
          </div>
          <div class="book-tags" v-if="props.game.tags">
            <span v-for="tag in props.game.tags" :key="tag" class="book-tag">{{ tag }}</span>
          </div>
          <div class="expanded-rating">
            <span class="stars">
              <span v-for="star in (props.game.title === 'P5R' ? 500 : 5)" :key="star" class="star"
                :class="{ 'filled': star <= props.game.rating }">★</span>
            </span>
            <span class="rating-text">{{ props.game.rating }}/5</span>
          </div>
        </div>
      </div>

      <div class="expanded-content">
        <div class="description-section">
          <h4>Description</h4>
          <p>{{ props.game.description }}</p>
        </div>

        <div class="thoughts-section">
          <h4>My Thoughts</h4>
          <p>{{ props.game.myThoughts }}</p>
        </div>

        <div class="links-section" v-if="props.game.links && props.game.links.length > 0">
          <h4>Links</h4>
          <div class="links-grid">
            <a v-for="link in props.game.links" :key="link.title" :href="link.url" target="_blank"
              rel="noopener noreferrer" class="book-link">
              <span class="link-title">{{ link.title }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  game: Object
});

const emit = defineEmits(['close-card']);

const emitCloseCard = () => {
  emit('close-card');
};
</script>

<style>
@import url("/src/assets/css/bookgallery.css");
</style>
