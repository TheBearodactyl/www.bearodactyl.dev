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
