<template>
  <div class="gallery-wrapper">
    <h1 class="title">My Reviews</h1>

    <div v-if="isLoading" class="loading">
      Loading reviews... {{ downloadProgress }}%
    </div>
    <div v-if="fetchError" class="error">Error: {{ fetchError }}</div>

    <div class="filters">
      <input v-model="searchFilters.search" type="text" placeholder="Search reviews..." class="search-input" />
    </div>

    <div class="gallery" v-if="!isLoading && !fetchError">
      <div v-for="review in filteredReviews" :key="review.chapter" class="card">
        <div class="card-content">
          <h2 class="project-name">Chapter {{ review.chapter }}</h2>
          <p class="project-description">{{ review.description }}</p>
          <p><strong>Rating:</strong> {{ review.rating }}/5</p>
          <p v-if="review.thoughts"><strong>Thoughts:</strong> {{ review.thoughts }}</p>
        </div>
      </div>

      <div v-if="filteredReviews.length === 0" class="no-results">
        No reviews match your search.
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useHead } from '@unhead/vue'
import { useData } from '@/composables/reviews/useData'
import { useFilters } from '@/composables/reviews/useFilters'

useHead({ title: 'Reviews List' })

const { reviews, isLoading, fetchError, downloadProgress } = useData()
const { searchFilters, filteredReviews } = useFilters(reviews)
</script>

<style>
@import url("/src/assets/css/bookgallery.css");

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.dropdown-fade-enter-to,
.dropdown-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text);
  padding: 0.3rem 1rem;
}

.gallery-wrapper {
  background-color: var(--rp-base);
  color: var(--rp-text);
  padding: 2rem;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}

.title {
  font-size: 2.5rem;
  color: var(--rp-rose);
  text-align: center;
  margin-bottom: 1.5rem;
}

.selected-tags {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  margin-left: -0.025rem;
  margin-top: 0.05rem;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: calc(100% - 2rem);
  /* padding-top: 10px; */
  /* Account for dropdown arrow space */
  height: 38px;
  align-items: center;
  padding-bottom: 2px;
  scrollbar-width: none;
  scrollbar-color: transparent;
  flex: 1;
  min-width: 0;
}

.install-section {
  margin-top: 0.5rem;
  background-color: var(--rp-base);
  border: 1px dashed var(--rp-highlight-low);
  padding: 0.75rem;
  border-radius: 6px;
  font-family: monospace;
  color: var(--rp-foam);
  white-space: pre-wrap;
  position: relative;
}

.install-command {
  font-size: 0.95rem;
  word-break: break-word;
  display: flex;
  margin-bottom: 0.5rem;
}

.copy-button {
  background-color: var(--rp-surface);
  color: var(--rp-foam);
  border: 1px solid var(--rp-highlight-low);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.copy-button:hover {
  background-color: var(--rp-highlight-med);
}

.expand-button {
  margin-top: 0.5rem;
  background-color: var(--rp-surface);
  border: 1px solid var(--rp-highlight-low);
  color: var(--rp-foam);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
}

.expand-button:hover {
  background-color: var(--rp-highlight-med);
}


.selected-tags::-webkit-scrollbar {
  height: 4px;
}

.selected-tags::-webkit-scrollbar-track {
  background: var(--rp-surface);
  border-radius: 2px;
}

.selected-tags::-webkit-scrollbar-thumb {
  background: var(--rp-highlight-med);
  border-radius: 2px;
}

.selected-tags::-webkit-scrollbar-thumb:hover {
  background: var(--rp-highlight-high);
}

.tag-button {
  background-color: var(--rp-highlight-med);
  color: var(--rp-foam);
  padding: 0.2rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: background-color 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  height: 24px;
}

.tag-button:hover {
  background-color: var(--rp-highlight-high);
}

.remove-icon {
  font-weight: bold;
  font-size: 1rem;
  line-height: 1;
}

.loading,
.error,
.no-results {
  text-align: center;
  margin: 1rem 0;
  color: var(--rp-gold);
}

.filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: nowrap;
  align-items: center;
  flex-grow: unset;
}

/* Unified styles for search input and dropdown */
.search-input {
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--rp-highlight-low);
  background-color: var(--rp-surface);
  color: var(--rp-text);
  width: 50%;
  font-size: 1rem;
  outline-offset: 2px;
  transition: border-color 0.2s ease;
  flex-grow: 0;
  flex-shrink: 0;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: var(--rp-foam);
}

.multi-select {
  flex-grow: 0;
  flex-shrink: 0;
  width: 50%;
  box-sizing: border-box;
}

.dropdown {
  position: relative;
  border-radius: 9999px;
  user-select: none;
  background-color: var(--rp-surface);
  border: 1px solid var(--rp-highlight-low);
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 1rem;
  min-height: 38px;
  max-height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: border-color 0.2s ease;
  gap: 0.5rem;
}

.dropdown:hover {
  background-color: var(--rp-surface);
}

.dropdown:focus {
  border-color: var(--rp-foam);
  outline: none;
}

.dropdown-content {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  max-width: calc(100% - 2rem);
}

.placeholder {
  color: var(--rp-text);
  font-size: 1rem;
  font-weight: 400;
  font-style: normal;
  padding: 0;
  margin: 0;
  flex-shrink: 0;
}

.dropdown-btn {
  background-color: var(--rp-surface);
  border: 1px solid var(--rp-highlight-low);
  border-radius: 9999px;
  color: var(--text);
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  min-width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dropdown-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--rp-highlight-low);
  border-radius: 9999px;
  background-color: var(--rp-surface);
  color: var(--text);
  cursor: pointer;
  min-height: 38px;
  width: 100%;
}

.dropdown-arrow {
  color: var(--rp-text);
  font-size: 1rem;
  flex-shrink: 0;
  pointer-events: auto;
  z-index: 5000;
  position: relative;
}

.dropdown-list {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  background-color: var(--rp-overlay);
  border: 1px solid var(--rp-highlight-low);
  border-radius: 6px;
  max-height: 180px;
  overflow-y: auto;
  width: 100%;
  z-index: 10;
  padding: 0.5rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.dropdown-list li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: var(--rp-subtle);
}

.dropdown-list li:hover {
  background-color: var(--rp-highlight-med);
  color: var(--rp-foam);
}

.dropdown-list li.selected {
  font-weight: 700;
  color: var(--rp-foam);
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.card {
  position: relative;
  background-color: var(--rp-overlay);
  border: 1px solid var(--rp-highlight-low);
  border-radius: 12px;
  padding: 1.2rem;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: scale(1.02);
  border-color: var(--rp-iris);
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.project-name {
  font-size: 1.3rem;
  color: var(--rp-gold);
  margin-bottom: 0.5rem;
}

.project-description {
  flex-grow: 1;
  font-size: 1rem;
  color: var(--rp-subtle);
  margin-bottom: 1rem;
}

.project-link {
  align-self: flex-start;
  color: var(--rp-foam);
  text-decoration: none;
  font-weight: bold;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.project-link:hover {
  border-color: var(--rp-foam);
}

.tags-wrapper {
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 0.4rem;
}

.tag-count {
  color: var(--rp-muted);
  font-size: 0.85em;
  margin-left: 0.5em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
