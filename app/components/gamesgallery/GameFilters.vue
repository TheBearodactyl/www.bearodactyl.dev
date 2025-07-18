<template>
    <transition name="fade-slide" mode="out-in">
        <div v-if="isFilterCollapsed" class="filter-pill">
            <input class="pill-search-input" v-model="searchFilters.title" :placeholder="$t('placeholder.search-title')"
                @keydown.right="emitToggleSearchMode" />
            <button class="pill-filter-btn" @click="emitToggleSearchMode">
                <span class="icon">☰</span>
            </button>
        </div>

        <div v-else class="filter-bar">
            <div class="filter-bar-header">
                <h2 class="filter-heading">{{ $t('filters.title') }}</h2>
                <button class="collapse-btn" @click="emitToggleSearchMode">⨯</button>
            </div>

            <input :ref="expandedInputRef" v-model="searchFilters.title" :placeholder="$t('placeholder.search-title')"
                @keydown.left="emitToggleSearchMode" />
            <input v-model="searchFilters.developer" :placeholder="$t('placeholder.search-author')" />
            <select v-model="searchFilters.status">
                <option>All Statuses</option>
                <option>Playing</option>
                <option>Finished</option>
                <option>Plan to Play</option>
                <option>Dropped</option>
            </select>
            <select v-model="searchFilters.rating">
                <option value="">{{ $t('filter.rating.any') }}</option>
                <option v-for="r in [1, 2, 3, 4, 5, 10, 20, 30, 40, 50]" :key="r" :value="r">{{ r }}+</option>
            </select>

            <div class="multi-select" ref="genresDropdown">
                <label>{{ $t('filter.genres') }}:</label>
                <div class="dropdown" @click.stop="emitToggleDropdown('genres')" :class="{ open: dropdowns.genres }"
                    tabindex="0" @blur="emitCloseDropdown('genres')">
                    <div class="dropdown-selected">
                        <span v-if="searchFilters.genres.length === 0" class="placeholder">{{
                            $t('placeholder.select-genres') }}</span>
                        <span v-else class="selected-items">{{ searchFilters.genres.join(", ") }}</span>
                        <span class="dropdown-arrow">▾</span>
                    </div>

                    <ul class="dropdown-list" v-if="dropdowns.genres">
                        <li v-for="genre in allGenres" :key="genre"
                            :class="{ selected: searchFilters.genres.includes(genre) }"
                            @click.stop="emitToggleFilterItem('genres', genre)">
                            <input type="checkbox" :checked="searchFilters.genres.includes(genre)" readonly />
                            {{ genre }}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="multi-select" ref="tagsDropdown">
                <label>{{ $t('filter.tags') }}:</label>
                <div class="dropdown" @click.stop="emitToggleDropdown('tags')" :class="{ open: dropdowns.tags }"
                    tabindex="0" @blur="emitCloseDropdown('tags')">
                    <div class="dropdown-selected">
                        <span v-if="searchFilters.tags.length === 0" class="placeholder">{{
                            $t('placeholder.select-tags') }}</span>
                        <span v-else class="selected-items">{{ searchFilters.tags.join(", ") }}</span>
                        <span class="dropdown-arrow">▾</span>
                    </div>

                    <ul class="dropdown-list" v-if="dropdowns.tags">
                        <li v-for="[tag, count] in filteredTagCounts" :key="tag"
                            :class="{ selected: searchFilters.tags.includes(tag) }"
                            @click.stop="emitToggleFilterItem('tags', tag)">
                            <input type="checkbox" :checked="searchFilters.tags.includes(tag)" readonly />
                            {{ tag }} <span class="tag-count">({{ count }})</span>
                        </li>
                        <li v-if="filteredTagCounts.length === 0 && searchFilters.tags.length === 0" class="no-tags">{{
                            $t('filter.no-tags') }}</li>
                    </ul>
                </div>
            </div>

            <button class="clear-filters-btn" @click="emitClearAllFilters">
                {{ $t('button.clear-filters') }}
            </button>
        </div>
    </transition>
</template>

<script setup>
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

const emitToggleDropdown = (type) => {
    emit('toggle-dropdown', type);
};

const emitCloseDropdown = (type) => {
    emit('close-dropdown', type);
};

const emitToggleFilterItem = (type, item) => {
    emit('toggle-filter-item', type, item);
};

const emitClearAllFilters = () => {
    emit('clear-all-filters');
};

const emitToggleSearchMode = () => {
    emit('toggle-search-mode');
};
</script>