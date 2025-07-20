<template>
  <BaseCard :index="index" :expanded="isExpanded" :view-mode="viewMode"
    :card-classes="{ 'explicit-content': props.book.explicit }" @toggle="emitToggleCard">
    <div class="book-compact" v-show="!isExpanded">
      <div class="book-cover">
        <img :src="props.book.coverImage" :alt="$t('cover-of-props-book-title', [props.book.title])"
          class="cover-image" />
        <div v-if="props.book.explicit" class="explicit-icon">
          <span class="icon-warning">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="red"
              stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z">
              </path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </span>
          <span class="explicit-label">{{ $t("gallery.explicit") }}</span>
        </div>
      </div>
      <div class="book-info">
        <h3 class="book-title">{{ props.book.title }}</h3>
        <p class="book-author">{{ props.book.author }}</p>
        <div class="read-status">{{ props.book.status }}</div>
        <div class="book-genres">
          <span v-for="genre in props.book.genres.slice(0, 5)" :key="genre" class="book-genre">{{ genre }}</span>
        </div>
        <div class="book-tags" v-if="props.book.tags">
          <span v-for="tag in props.book.tags.slice(0, 5)" :key="tag" class="book-tag">{{ tag }}</span>
        </div>
        <div class="book-rating">
          <span class="stars">
            <span v-for="star in (props.book.title === 'One Piece' ? 50 : 5)" :key="star" class="star"
              :class="{ 'filled': star <= props.book.rating }">★</span>
          </span>
          <span class="rating-text">{{ $t('props-book-rating-5', [props.book.rating]) }}</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '../gallery/BaseCard.vue';

const props = defineProps({
  book: Object,
  index: Number,
  isExpanded: Boolean,
  viewMode: String,
});

const emit = defineEmits(['toggle-card']);
const emitToggleCard = () => {
  emit('toggle-card');
};
</script>
