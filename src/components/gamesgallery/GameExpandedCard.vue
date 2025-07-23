<template>
  <div class="expanded-card-overlay">
    <div
      class="book-expanded"
      :class="{
        show: props.game !== null,
        'explicit-content': props.game.explicit,
      }"
    >
      <div class="expanded-header">
        <button class="close-btn" @click.stop="emitCloseCard">×</button>
        <div class="expanded-cover">
          <img
            :src="props.game.coverImage"
            :alt="$t('cover-of-props-game-title', [props.game.title])"
            class="expanded-cover-image"
          />
          <div v-if="props.game.explicit" class="explicit-icon">
            <span class="icon-warning">⚠️</span>
            <span class="explicit-label">{{ $t("gallery.explicit") }}</span>
          </div>
        </div>
        <div class="expanded-basic-info">
          <h3 class="expanded-title">{{ props.game.title }}</h3>
          <p class="expanded-author">{{ props.game.developer }}</p>
          <div class="book-genres">
            <span
              v-for="genre in props.game.genres"
              :key="genre"
              class="book-genre"
              >{{ genre }}</span
            >
          </div>
          <div v-if="props.game.tags" class="book-tags">
            <span v-for="tag in props.game.tags" :key="tag" class="book-tag">{{
              tag
            }}</span>
          </div>
          <div class="expanded-rating">
            <span class="stars">
              <span
                v-for="star in props.game.title === 'P5R' ? 500 : 5"
                :key="star"
                class="star"
                :class="{ filled: star <= props.game.rating }"
                >★</span
              >
            </span>
            <span class="rating-text">{{
              $t("props-game-rating-5", [props.game.rating])
            }}</span>
          </div>
        </div>
      </div>

      <div class="expanded-content">
        <div class="description-section">
          <h4>{{ $t("gallery.expanded.description") }}</h4>
          <p>{{ props.game.description }}</p>
        </div>

        <div class="thoughts-section">
          <h4>{{ $t("gallery.expanded.my-thoughts") }}</h4>
          <p>{{ props.game.myThoughts }}</p>
        </div>

        <div
          v-if="props.game.links && props.game.links.length > 0"
          class="links-section"
        >
          <h4>{{ $t("gallery.expanded.links") }}</h4>
          <div class="links-grid">
            <a
              v-for="link in props.game.links"
              :key="link.title"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="book-link"
            >
              <span class="link-title">{{ link.title }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Game } from "@/composables/games/useData"

const props = defineProps<{
  game: Game
}>()

const emit = defineEmits(["close-card"])

const emitCloseCard = () => {
  emit("close-card")
}
</script>

<style>
@import url("/src/assets/css/bookgallery.css");
</style>
