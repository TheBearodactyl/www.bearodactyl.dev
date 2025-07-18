<template>
    <div class="book-gallery" :class="{ 'idle-background': isIdle }">
        <h1 class="gallery-title">{{ $t('games-header') }}</h1>

        <GameFilters :searchFilters="searchFilters" :allGenres="allGenres" :allTags="allTags" :dropdowns="dropdowns"
            :isFilterCollapsed="isFilterCollapsed" :filteredTagCounts="filteredTagCounts"
            @toggle-dropdown="toggleDropdown" @close-dropdown="closeDropdown" @toggle-filter-item="toggleFilterItem"
            @clear-all-filters="clearAllFilters" @toggle-search-mode="toggleSearchMode"
            :expandedInputRef="expandedInputRef" />

        <div v-if="isLoading" class="progress-wrapper">
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: downloadProgress + '%' }"></div>
            </div>
            <p>{{ $t('loading.books') }} {{ downloadProgress }}%</p>
        </div>

        <div v-if="fetchError" class="error-message">
            {{ $t('error.loading') }}: {{ fetchError }}
        </div>

        <GamesGrid v-if="!isLoading && !fetchError" :filtered-games="filteredGames" :isContentVisible="isContentVisible"
            :viewMode="viewMode" :expandedCard="expandedCard" @toggle-card="toggleCard" />

        <GameExpandedCard v-if="expandedCard !== null && !isLoading && !fetchError"
            :game="filteredGames.find((b) => b.id === expandedCard)" @close-card="closeCard" />

        <div v-if="expandedCard !== null" class="backdrop" :class="{ show: expandedCard !== null }" @click="closeCard">
        </div>
    </div>
</template>

<script setup>
import { useData } from "~/composables/games/useData";
import { useDisplay } from "~/composables/games/useDisplay";
import { useFilters } from "~/composables/games/useFilters";

import GameExpandedCard from "./GameExpandedCard.vue";
import GameFilters from "./GameFilters.vue";
import GamesGrid from "./GamesGrid.vue";

useHead({
    title: "Games I play",
    meta: [
        { name: "description", content: "A list of games that I've played/am playing" },
        { name: "twitter:title", content: "Games I play" },
        { name: "twitter:image", content: "/images/sweat.png" },
    ],
});

const {
    games,
    isLoading,
    fetchError,
    downloadProgress,
    isContentVisible,
} = useData();
const {
    searchFilters,
    allGenres,
    allTags,
    filteredGames,
    dropdowns,
    toggleDropdown,
    closeDropdown,
    toggleFilterItem,
    filteredTagCounts,
    clearAllFilters
} = useFilters(games);
const {
    isFilterCollapsed,
    expandedInputRef,
    viewMode,
    expandedCard,
    isIdle,
    toggleCard,
    closeCard,
    toggleSearchMode,
} = useDisplay();

</script>

<style>
@import url("/assets/css/bookgallery.css");
</style>