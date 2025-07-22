<template>
  <transition name="fade-slide" mode="out-in">
    <FilterPill v-if="isFilterCollapsed" v-model="searchFilters.title" @toggle-search-mode="emitToggleSearchMode" />

    <div v-else class="filter-bar">
      <div class="filter-bar-header">
        <h2 class="filter-heading">{{ $t('title') }}</h2>
        <button class="collapse-btn" @click="emitToggleSearchMode">⨯</button>
      </div>

      <input :ref="expandedInputRef" v-model="searchFilters.title" :placeholder="$t('search-title')"
        @keydown.left="emitToggleSearchMode" />

      <input v-model="searchFilters.author" :placeholder="$t('search-author')" />

      <select v-model="searchFilters.status">
        <option value="">{{ $t('gallery.filters.any-status') }}</option>
        <option value="Reading">Reading</option>
        <option value="Finished">Finished</option>
        <option value="Plan to Read">Plan to Read</option>
        <option value="Dropped">Dropped</option>
      </select>

      <select v-model.number="searchFilters.rating">
        <option :value="null">{{ $t('gallery.filters.any-rating') }}</option>
        <option v-for="r in [1, 2, 3, 4, 5, 10, 20, 30, 40, 50]" :key="r" :value="r">
          {{ $t('rating', [r]) }}
        </option>
      </select>

      <MultiSelectDropdown :label="$t('genres')"
        :items="filteredGenreCounts.map(([genre, count]) => ({ value: genre, count }))"
        :selected-items="searchFilters.genres" :is-open="dropdowns.genres" :placeholder="$t('select-genres')"
        no-items-message="No genres available" @toggle="emitToggleDropdown('genres')"
        @close="emitCloseDropdown('genres')" @toggle-item="(genre) => emitToggleFilterItem('genres', genre)" />

      <MultiSelectDropdown :label="$t('tags')" :items="filteredTagCounts.map(([tag, count]) => ({ value: tag, count }))"
        :selected-items="searchFilters.tags" :is-open="dropdowns.tags" :placeholder="$t('select-tags')"
        no-items-message="No tags available" @toggle="emitToggleDropdown('tags')" @close="emitCloseDropdown('tags')"
        @toggle-item="(tag) => emitToggleFilterItem('tags', tag)" />

      <button class="clear-filters-btn" @click="emitClearAllFilters">
        {{ $t('clear-filters') }}
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import FilterPill from '../gallery/FilterPill.vue';
import MultiSelectDropdown from '../gallery/MultiSelectDropdown.vue';

interface Filters {
  title: string
  author: string
  status: string
  rating: number | null
  genres: string[]
  tags: string[]
}

interface Props {
  searchFilters: Filters,
  allGenres: string[],
  allTags: string[],
  dropdowns: Record<string, boolean>,
  isFilterCollapsed: boolean,
  filteredTagCounts: [string, number][],
  filteredGenreCounts: [string, number][],
  expandedInputRef: (el: HTMLInputElement | null) => void
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggle-dropdown', type: string): void
  (e: 'close-dropdown', type: string): void
  (e: 'toggle-filter-item', type: "genres" | "tags", item: string): void
  (e: 'clear-all-filters'): void
  (e: 'toggle-search-mode'): void
  (e: 'update:searchFilters', filters: Filters): void
}>();

const emitToggleDropdown = (type: string) => emit('toggle-dropdown', type);
const emitCloseDropdown = (type: string) => emit('close-dropdown', type);
const emitToggleFilterItem = (type: "genres" | "tags", item: string) => emit('toggle-filter-item', type, item);
const emitClearAllFilters = () => emit('clear-all-filters');
const emitToggleSearchMode = () => emit('toggle-search-mode');

const searchFilters = props.searchFilters;
const expandedInputRef = props.expandedInputRef;
</script>
