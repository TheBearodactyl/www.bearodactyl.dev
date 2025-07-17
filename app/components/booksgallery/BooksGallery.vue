<template>
    <div class="book-gallery" :class="{ 'idle-background': isIdle }">
        <h1 class="gallery-title">{{ $t('readwatch-header') }}</h1>

        <Filters :searchFilters="searchFilters" :allGenres="allGenres" :allTags="allTags" :dropdowns="dropdowns"
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

        <BooksGrid v-if="!isLoading && !fetchError" :filteredBooks="filteredBooks" :isContentVisible="isContentVisible"
            :viewMode="viewMode" :expandedCard="expandedCard" @toggle-card="toggleCard" />

        <ExpandedCard v-if="expandedCard !== null && !isLoading && !fetchError"
            :book="filteredBooks.find((b) => b.id === expandedCard)" @close-card="closeCard" />

        <div v-if="expandedCard !== null" class="backdrop" :class="{ show: expandedCard !== null }" @click="closeCard">
        </div>
    </div>
</template>

<script setup lang="ts">
import { useData } from '~/composables/books/useData';
import { useFilters } from '~/composables/books/useFilters';
import { useDisplay } from '~/composables/books/useDisplay';

import Filters from './Filters.vue';
import BooksGrid from './BooksGrid.vue';
import ExpandedCard from './ExpandedCard.vue';

useHead({
    title: "Read/Watch List",
    meta: [
        { name: "description", content: "A list of books, movies, and shows I've read/watched" },
        { name: "twitter:title", content: "Read/Watch List" },
        { name: "twitter:description", content: "A list of books, movies, and shows I've read/watched" },
        { name: "twitter:image", content: "https://wallpapers.com/images/hd/monkey-d-luffy-one-piece-character-ncbn2w69dzvewvem.jpg" },
    ],
});

const {
    books,
    isLoading,
    fetchError,
    downloadProgress,
    isContentVisible,
} = useData();
const {
    searchFilters,
    allGenres,
    allTags,
    filteredBooks,
    dropdowns,
    toggleDropdown,
    closeDropdown,
    toggleFilterItem,
    filteredTagCounts,
    clearAllFilters
} = useFilters(books);
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