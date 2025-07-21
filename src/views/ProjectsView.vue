<template>
  <div class="gallery-wrapper">
    <h1 class="title">My Projects</h1>

    <div v-if="isLoading" class="loading">
      Loading projects... {{ downloadProgress }}%
    </div>
    <div v-if="fetchError" class="error">Error: {{ fetchError }}</div>

    <div class="filters">
      <input v-model="searchFilters.name" type="text" placeholder="Search projects..." class="search-input" />

      <div class="multi-select" ref="tagsDropdownRef">
        <div class="dropdown" @click.stop="openDropdown('tags')" :class="{ open: dropdowns.tags }" tabindex="0"
          @blur.capture="delayedCloseDropdown('tags')">

          <div class="dropdown-content">
            <span v-if="searchFilters.tags.length === 0" class="placeholder">
              Select tags...
            </span>
            <div v-else class="selected-tags">
              <transition-group name="fade" tag="div" class="tags-wrapper">
                <span v-for="tag in searchFilters.tags" :key="tag" class="tag-button"
                  @click.stop="toggleFilterTag(tag)">
                  {{ tag }} <span class="remove-icon">×</span>
                </span>
              </transition-group>
            </div>
          </div>

          <span class="dropdown-arrow">☰</span>

          <ul class="dropdown-list" v-if="dropdowns.tags">
            <template v-if="filteredTagCounts.length > 0">
              <li v-for="[tag, count] in filteredTagCounts" :key="tag"
                :class="{ selected: searchFilters.tags.includes(tag) }" @click.stop="toggleFilterTag(tag)">
                <input type="checkbox" :checked="searchFilters.tags.includes(tag)" readonly />
                {{ tag }} <span class="tag-count">({{ count }})</span>
              </li>
            </template>
            <template v-else>
              <li class="no-tags">No tags available</li>
            </template>
          </ul>
        </div>
      </div>
    </div>

    <div class="gallery" v-if="!isLoading && !fetchError">
      <div v-for="project in filteredProjects" :key="project.name" class="card">
        <div class="card-content">
          <h2 class="project-name">{{ project.name }}</h2>
          <p class="project-description">{{ project.description }}</p>

          <div class="book-tags" v-if="project.tags">
            <span v-for="tag in project.tags.slice(0, 5)" :key="tag" class="book-tag">{{ tag }}</span>
          </div>

          <a :href="project.source" class="project-link" target="_blank" rel="noopener noreferrer">
            View Source
          </a>

          <button class="expand-button" @click="toggleInstallCmd(project.name)">
            {{ expandedCards[project.name] ? 'Hide' : 'Show' }} Install Command
          </button>

          <transition name="fade">
            <div v-if="expandedCards[project.name]" class="install-section">
              <code class="install-command">{{ project.installCommand || 'No install command provided.' }}</code>
              <button class="copy-button" @click="copyInstallCommand(project.installCommand)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="feather feather-copy">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </transition>
        </div>
      </div>
      <div v-if="filteredProjects.length === 0" class="no-results">
        No projects match your search.
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { useData } from "@/composables/projects/useData";
import { useFilters } from "@/composables/projects/useFilters";
import { ref, reactive } from "vue";
import { useHead } from '@unhead/vue';

useHead({
  title: "Projects List"
})

const { projects, isLoading, fetchError, downloadProgress } = useData();
const {
  searchFilters,
  filteredProjects,
  dropdowns,
  filteredTagCounts,
  openDropdown,
  toggleFilterTag,
  delayedCloseDropdown,
} = useFilters(projects);

const tagsDropdownRef = ref<HTMLElement | null>(null);
const expandedCards = reactive<Record<string, boolean>>({});

const toggleInstallCmd = (name: string) => {
  expandedCards[name] = !expandedCards[name];
}

const copyInstallCommand = async (text: string | undefined) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  } catch (err) {
    alert("Failed to copy.")
    console.error("Clipboard copy error: ", err)
  }
}
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
