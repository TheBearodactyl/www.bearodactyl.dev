<template>
  <BaseCard
    :index="index"
    :expanded="isExpanded"
    :view-mode="viewMode"
    :card-classes="{ 'explicit-content': props.game.explicit }"
    @toggle="emitToggleCard"
  >
    <div v-show="!isExpanded" class="book-compact">
      <div class="book-cover">
        <img
          :src="props.game.coverImage"
          :alt="$t('cover-of-props-game-title', [props.game.title])"
          class="cover-image"
        />
        <div v-if="props.game.explicit" class="explicit-icon">
          <span class="icon-warning">
            <WarningIcon />
          </span>
          <span class="explicit-label">{{ $t("gallery.explicit") }}</span>
        </div>
      </div>
      <div class="book-info">
        <h3 class="book-title">{{ props.game.title }}</h3>
        <p class="book-author">{{ props.game.developer }}</p>
        <div class="read-status">{{ props.game.status }}</div>
        <div class="book-genres">
          <span
            v-for="genre in props.game.genres.slice(0, 5)"
            :key="genre"
            class="book-genre"
            >{{ genre }}</span
          >
        </div>
        <div v-if="props.game.tags" class="book-tags">
          <span
            v-for="tag in props.game.tags.slice(0, 5)"
            :key="tag"
            class="book-tag"
            >{{ tag }}</span
          >
        </div>
        <div class="book-rating">
          <span class="stars">
            <span
              v-for="star in isPeakFiction(props.game) ? 50 : 5"
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
  </BaseCard>
</template>

<script setup lang="ts">
import { isPeakFiction } from "@/utils/misc"
import BaseCard from "../gallery/BaseCard.vue"
import WarningIcon from "../icons/WarningIcon.vue"
import type { Game } from "@/composables/games/useData"

const props = defineProps<{
  game: Game
  index: number
  isExpanded: boolean
  viewMode: string
}>()

const emit = defineEmits(["toggle-card"])
const emitToggleCard = () => {
  emit("toggle-card")
}
</script>
