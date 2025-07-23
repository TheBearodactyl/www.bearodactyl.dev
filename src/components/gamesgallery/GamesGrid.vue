<template>
  <div class="book-grid-container" :class="{ 'fade-in': isContentVisible }">
    <div class="book-grid">
      <div
        v-for="(game, index) in filteredGames"
        :key="game.id"
        class="book-card"
        :class="{
          expanded: expandedCard === game.id,
          'list-view': viewMode === 'list',
          'explicit-content': game.explicit,
        }"
        :style="{ 'animation-delay': `${index * 0.1}s` }"
        @click="emitToggleCard(game.id)"
      >
        <div v-show="expandedCard !== game.id" class="book-compact">
          <div class="book-cover">
            <img
              :src="game.coverImage"
              :alt="$t('cover-of-props-game-title', [game.title])"
              class="cover-image"
            />
            <div v-if="game.explicit" class="explicit-icon">
              <span class="icon-warning">
                <WarningIcon />
              </span>
              <span class="explicit-label">{{ $t("gallery.explicit") }}</span>
            </div>
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ game.title }}</h3>
            <p class="book-author">{{ game.developer }}</p>
            <div class="read-status">{{ game.status }}</div>
            <div class="book-genres">
              <span
                v-for="genre in game.genres.slice(0, 5)"
                :key="genre"
                class="book-genre"
                >{{ genre }}</span
              >
            </div>
            <div v-if="game.tags" class="book-tags">
              <span
                v-for="tag in game.tags.slice(0, 5)"
                :key="tag"
                class="book-tag"
                >{{ tag }}</span
              >
            </div>
            <div class="book-rating">
              <span class="stars">
                <span
                  v-for="star in game.title === 'P5R' ? 500 : 5"
                  :key="star"
                  class="star"
                  :class="{ filled: star <= game.rating }"
                  >★</span
                >
              </span>
              <span class="rating-text">{{
                $t("props-game-rating-5", [game.rating])
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="filteredGames.length === 0" class="no-results">
      {{ $t("no-results-0") }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Game } from "@/composables/games/useData"
import WarningIcon from "../icons/WarningIcon.vue"

defineProps<{
  filteredGames: Game[]
  isContentVisible: boolean
  viewMode: string
  expandedCard: string | number
}>()

const emit = defineEmits(["toggle-card"])

const emitToggleCard = (bookId: number | string) => {
  emit("toggle-card", bookId)
}
</script>
