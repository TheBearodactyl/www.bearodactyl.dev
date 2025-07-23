<template>
  <div class="book-gallery" :class="{ 'idle-background': isIdle }">
    <h1 class="gallery-title">{{ $t("read-watch-list") }}</h1>

    <Filters
      :search-filters="searchFilters"
      :all-genres="allGenres"
      :all-tags="allTags"
      :dropdowns="dropdowns"
      :filtered-tag-counts="filteredTagCounts"
      :filtered-genre-counts="filteredGenreCounts"
      :expanded-input-ref="expandedInputRef"
      :is-filter-collapsed="isFilterCollapsed"
      @toggle-dropdown="toggleDropdown"
      @close-dropdown="closeDropdown"
      @toggle-filter-item="toggleFilterItem"
      @clear-all-filters="clearAllFilters"
      @toggle-search-mode="toggleSearchMode"
    />

    <div v-if="isLoading" class="progress-wrapper">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: downloadProgress + '%' }"
        ></div>
      </div>
      <p>{{ $t("loading-downloadprogress", [downloadProgress]) }}</p>
    </div>

    <div v-if="fetchError" class="error-message">
      {{ $t("error-loading-list-fetcherror", [fetchError]) }}
    </div>

    <BooksGrid
      v-if="!isLoading && !fetchError"
      :books="filteredBooks"
      :is-content-visible="isContentVisible"
      :view-mode="viewMode"
      :expanded-card="expandedCard"
      @toggle-card="toggleCard"
    />

    <ExpandedCard
      v-if="
        expandedCard !== null &&
        !isLoading &&
        !fetchError &&
        expandedBook !== undefined
      "
      :book="expandedBook"
      @close-card="closeCard"
    />

    <GalleryBackdrop :show="expandedCard !== null" @click="closeCard" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useData, type Book } from "@/composables/books/useData"
import { useFilters } from "@/composables/books/useFilters"
import { useDisplay } from "@/composables/books/useDisplay"

import GalleryBackdrop from "../gallery/GalleryBackdrop.vue"
import Filters from "./BookFilters.vue"
import BooksGrid from "./BooksGrid.vue"
import ExpandedCard from "./BookExpandedCard.vue"

const { books, isLoading, fetchError, downloadProgress, isContentVisible } =
  useData()

const {
  searchFilters,
  allGenres,
  allTags,
  filteredBooks,
  dropdowns,
  filteredTagCounts,
  filteredGenreCounts,
  toggleDropdown,
  closeDropdown,
  toggleFilterItem,
  clearAllFilters,
} = useFilters(books)

const {
  expandedInputRef,
  viewMode,
  expandedCard,
  isIdle,
  toggleCard,
  closeCard,
} = useDisplay()

const isFilterCollapsed = ref(true)

function toggleSearchMode() {
  isFilterCollapsed.value = !isFilterCollapsed.value
}

const expandedBook = ref<Book | undefined>(undefined)

watch(expandedCard, (newCard) => {
  if (newCard !== null) {
    expandedBook.value = filteredBooks.value.find((b) => b.id === newCard)
  } else {
    expandedBook.value = undefined
  }
})
</script>
