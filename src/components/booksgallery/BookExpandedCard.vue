<template>
  <div class="expanded-card-overlay">
    <div class="book-expanded" :class="{ show: book !== null, 'explicit-content': book.explicit }">
      <div class="expanded-header">
        <button class="close-btn" @click.stop="emitCloseCard">×</button>
        <div class="expanded-cover">
          <img :src="book.coverImage" :alt="`Cover of ${book.title}`" class="expanded-cover-image" />
          <div v-if="book.explicit" class="explicit-icon">
            <span class="icon-warning">⚠️</span>
            <span class="explicit-label">Contains Explicit Content</span>
          </div>
        </div>
        <div class="expanded-basic-info">
          <h3 class="expanded-title">{{ book.title }}</h3>
          <p class="expanded-author">{{ book.author }}</p>
          <div class="book-genres">
            <span v-for="genre in book.genres" :key="genre" class="book-genre">{{ genre }}</span>
          </div>
          <div class="book-tags" v-if="book.tags">
            <span v-for="tag in book.tags" :key="tag" class="book-tag">{{ tag }}</span>
          </div>
          <div class="expanded-rating">
            <span class="stars">
              <span v-for="star in (book.title === 'One Piece' ? 50 : 5)" :key="star" class="star"
                :class="{ 'filled': star <= book.rating }">★</span>
            </span>
            <span class="rating-text">{{ book.rating }}/5</span>
          </div>
        </div>
      </div>

      <div class="expanded-content">
        <div class="description-section">
          <h4>Description</h4>
          <p>{{ book.description }}</p>
        </div>

        <div class="thoughts-section">
          <h4>My Thoughts</h4>
          <p>{{ book.myThoughts }}</p>
        </div>

        <div class="links-section" v-if="book.links && book.links.length > 0">
          <h4>Links</h4>
          <div class="links-grid">
            <a v-for="link in book.links" :key="link.title" :href="link.url" target="_blank" rel="noopener noreferrer"
              class="book-link">
              <span class="link-title">{{ link.title }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  book: Object
});

const emit = defineEmits(['close-card']);

const emitCloseCard = () => {
  emit('close-card');
};
</script>
