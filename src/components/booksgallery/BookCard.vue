<template>
  <BaseCard
    :index="index"
    :expanded="isExpanded"
    :view-mode="viewMode"
    :card-classes="{ 'explicit-content': props.book.explicit }"
    :style="cardStyle"
    @toggle="emitToggleCard"
  >
    <div v-show="!isExpanded" class="book-compact">
      <div class="book-cover">
        <img
          :src="props.book.coverImage"
          :alt="$t('cover-of-props-book-title', [props.book.title])"
          class="cover-image"
        />
        <div v-if="props.book.explicit" class="explicit-icon">
          <span class="icon-warning">
            <WarningIcon />
          </span>
          <span class="explicit-label">{{ $t("gallery.explicit") }}</span>
        </div>
      </div>
      <div class="book-info">
        <h3 class="book-title">{{ props.book.title }}</h3>
        <p class="book-author">{{ props.book.author }}</p>
        <div class="read-status">{{ props.book.status }}</div>
        <div class="book-genres">
          <span
            v-for="genre in props.book.genres.slice(0, 5)"
            :key="genre"
            class="book-genre"
          >
            {{ genre }}
          </span>
        </div>
        <div v-if="props.book.tags" class="book-tags">
          <span
            v-for="tag in props.book.tags.slice(0, 5)"
            :key="tag"
            class="book-tag"
            >{{ tag }}</span
          >
        </div>
        <div class="book-rating">
          <span class="stars">
            <span
              v-for="star in isPeakFiction(props.book) ? 50 : 5"
              :key="star"
              class="star"
              :class="{ filled: star <= props.book.rating }"
              >★</span
            >
          </span>
          <span class="rating-text">{{
            $t("props-book-rating-5", [props.book.rating])
          }}</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from "vue"
import BaseCard from "../gallery/BaseCard.vue"
import type { Book } from "@/composables/books/useData"
import { isPeakFiction } from "@/utils/isPeakFiction"
import WarningIcon from "../icons/WarningIcon.vue"

const props = defineProps<{
  book: Book
  index: number
  isExpanded: boolean
  viewMode: string
}>()

const emit = defineEmits(["toggle-card"])
const emitToggleCard = () => {
  emit("toggle-card")
}

const cardStyle = computed(() => {
  return {
    "--hover-border-color":
      !props.isExpanded && props.book.color
        ? props.book.color
        : "var(--rp-love)",
  }
})
</script>
