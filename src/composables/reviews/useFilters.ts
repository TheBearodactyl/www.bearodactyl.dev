import { ref, computed, watch, type Ref } from "vue"
import { useStorage } from "@vueuse/core"
import Fuse from "fuse.js"

interface Review {
  chapter: number
  description: string
  rating: number
  thoughts?: string
}

interface ReviewFilters {
  search: string
  minRating: number
}

export function useFilters(allReviews: Ref<Review[]>) {
  const rawFilters = useStorage<ReviewFilters>("review-filters", {
    search: "",
    minRating: 1,
  })

  const searchFilters: Ref<ReviewFilters> = ref({ ...rawFilters.value })

  watch(
    searchFilters,
    (val) => {
      rawFilters.value = { ...val }
    },
    { deep: true },
  )

  const fuse = computed(() => {
    return new Fuse(allReviews.value, {
      keys: ["description", "thoughts"],
      threshold: 0.3,
    })
  })

  const filteredReviews = computed(() => {
    let result = allReviews.value

    const hasSearch = searchFilters.value.search.trim()
    if (hasSearch) {
      const query = searchFilters.value.search.trim()
      result = fuse.value.search(query).map(({ item }) => item)
    }

    if (typeof searchFilters.value.minRating === "number") {
      result = result.filter((review) => review.rating >= searchFilters.value.minRating)
    }

    return result
  })

  return {
    searchFilters,
    filteredReviews,
  }
}
