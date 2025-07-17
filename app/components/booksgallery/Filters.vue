<template>
    <transition name="fade-slide" mode="out-in">
        <FilterPill v-if="isFilterCollapsed" v-model="searchFilters.title" @toggle-search-mode="emitToggleSearchMode" />

        <div v-else class="filter-bar">
            <div class="filter-bar-header">
                <h2 class="filter-heading">{{ $t('filters.title') }}</h2>
                <button class="collapse-btn" @click="emitToggleSearchMode">⨯</button>
            </div>

            <input :ref="expandedInputRef" v-model="searchFilters.title" :placeholder="$t('placeholder.search-title')"
                @keydown.left="emitToggleSearchMode" />
            <input v-model="searchFilters.author" :placeholder="$t('placeholder.search-author')" />

            <select v-model="searchFilters.status">
                <option>All Statuses</option>
                <option>Reading</option>
                <option>Finished</option>
                <option>Plan to Read</option>
                <option>Dropped</option>
            </select>
            <select v-model="searchFilters.rating">
                <option value="">{{ $t('filter.rating.any') }}</option>
                <option v-for="r in [1, 2, 3, 4, 5, 10, 20, 30, 40, 50]" :key="r" :value="r">{{ r }}+</option>
            </select>

            <MultiSelectDropdown label="Genres" :items="allGenres.map(g => ({ value: g }))"
                :selected-items="searchFilters.genres" :is-open="dropdowns.genres" placeholder="Select Genres"
                @toggle="emitToggleDropdown('genres')" @close="emitCloseDropdown('genres')"
                @toggle-item="(genre) => emitToggleFilterItem('genres', genre)" />

            <MultiSelectDropdown label="Tags" :items="filteredTagCounts.map(([tag, count]) => ({ value: tag, count }))"
                :selected-items="searchFilters.tags" :is-open="dropdowns.tags" placeholder="Select Tags"
                no-items-message="No tags available" @toggle="emitToggleDropdown('tags')"
                @close="emitCloseDropdown('tags')" @toggle-item="(tag) => emitToggleFilterItem('tags', tag)" />

            <button class="clear-filters-btn" @click="emitClearAllFilters">
                {{ $t('button.clear-filters') }}
            </button>
        </div>
    </transition>
</template>

<script setup>
import FilterPill from '../gallery/FilterPill.vue';
import MultiSelectDropdown from '../gallery/MultiSelectDropdown.vue';

const props = defineProps({
    searchFilters: Object,
    allGenres: Array,
    allTags: Array,
    dropdowns: Object,
    isFilterCollapsed: Boolean,
    filteredTagCounts: Array,
    expandedInputRef: Function
});

const emit = defineEmits([
    'toggle-dropdown',
    'close-dropdown',
    'toggle-filter-item',
    'clear-all-filters',
    'toggle-search-mode'
]);

const emitToggleDropdown = (type) => emit('toggle-dropdown', type);
const emitCloseDropdown = (type) => emit('close-dropdown', type);
const emitToggleFilterItem = (type, item) => emit('toggle-filter-item', type, item);
const emitClearAllFilters = () => emit('clear-all-filters');
const emitToggleSearchMode = () => emit('toggle-search-mode');
</script>