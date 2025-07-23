<template>
  <div class="book-gallery" :class="{ 'idle-background': isIdle }">
    <h1 class="gallery-title">{{ $t("games-list") }}</h1>

    <GameFilters
      :search-filters="searchFilters"
      :all-genres="allGenres"
      :all-tags="allTags"
      :dropdowns="dropdowns"
      :is-filter-collapsed="isFilterCollapsed"
      :filtered-tag-counts="filteredTagCounts"
      :expanded-input-ref="expandedInputRef"
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
      <p>{{ $t("loading-games-downloadprogress", [downloadProgress]) }}</p>
    </div>

    <div v-if="fetchError" class="error-message">
      {{ $t("error-loading-games-fetcherror", [fetchError]) }}
    </div>

    <GamesGrid
      v-if="!isLoading && !fetchError"
      :filtered-games="filteredGames"
      :is-content-visible="isContentVisible"
      :view-mode="viewMode"
      :expanded-card="expandedCard"
      @toggle-card="toggleCard"
    />

    <GameExpandedCard
      v-if="
        expandedCard !== null &&
        !isLoading &&
        !fetchError &&
        expandedGame !== undefined
      "
      :game="expandedGame"
      @close-card="closeCard"
    />

    <div
      v-if="expandedCard !== null"
      class="backdrop"
      :class="{ show: expandedCard !== null }"
      @click="closeCard"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { useData, type Game } from "@/composables/games/useData"
import { useFilters } from "@/composables/games/useFilters"
import { useDisplay } from "@/composables/games/useDisplay"

import GameFilters from "./GameFilters.vue"
import GameExpandedCard from "./GameExpandedCard.vue"
import GamesGrid from "./GamesGrid.vue"
import { ref, watch } from "vue"

const { games, isLoading, fetchError, downloadProgress, isContentVisible } =
  useData()
const {
  searchFilters,
  allGenres,
  allTags,
  filteredGames,
  dropdowns,
  filteredTagCounts,
  toggleDropdown,
  closeDropdown,
  toggleFilterItem,
  clearAllFilters,
} = useFilters(games)
const {
  isFilterCollapsed,
  expandedInputRef,
  viewMode,
  expandedCard,
  isIdle,
  toggleCard,
  closeCard,
  toggleSearchMode,
} = useDisplay()

const expandedGame = ref<Game | undefined>(undefined)

watch(expandedCard, (newCard) => {
  expandedGame.value = filteredGames.value.find((b) => b.id === newCard)
})
</script>

<style>
@import url("/src/assets/css/bookgallery.css");
</style>
