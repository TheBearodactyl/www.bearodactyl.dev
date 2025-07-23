import { ref, computed, watch, reactive, type Ref } from "vue"
import { useStorage } from "@vueuse/core"
import Fuse from "fuse.js"
import type { Book } from "./useData"

interface Filters {
  title: string
  author: string
  genres: string[]
  tags: string[]
  rating: number | null
  status: string
}

export function useFilters(allBooks: Ref<Book[]>) {
  const rawFilters = useStorage<Filters>("book-filters", {
    title: "",
    author: "",
    genres: [],
    tags: [],
    rating: null,
    status: "",
  })

  const searchFilters: Ref<Filters> = ref({ ...rawFilters.value })

  watch(
    searchFilters,
    (newVal, oldVal) => {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        rawFilters.value = { ...newVal }
      }
    },
    { deep: true },
  )

  const hasSearch = computed(
    () => searchFilters.value.title.trim() || searchFilters.value.author.trim(),
  )

  const fuse = computed(() => {
    if (!hasSearch.value) return null
    return new Fuse(allBooks.value, {
      keys: ["title", "author", "genres", "tags"],
      threshold: 0.3,
    })
  })

  const allGenres = computed(() => {
    const genres = new Set<string>()
    for (const book of allBooks.value) {
      for (const g of book.genres) genres.add(g)
    }
    return [...genres].sort()
  })

  const allTags = computed(() => {
    const tags = new Set<string>()
    for (const book of allBooks.value) {
      for (const t of book.tags ?? []) tags.add(t)
    }
    return [...tags].sort()
  })

  function applyFilter(book: Book): boolean {
    const { genres, tags, rating, status } = searchFilters.value

    if (genres.length && !genres.every((g) => book.genres.includes(g))) return false
    if (tags.length && !(book.tags && tags.every((t) => book.tags.includes(t)))) return false
    if (rating && (book.rating ?? 0) < rating) return false
    if (status && book.status !== status) return false

    return true
  }

  const filteredBooks = computed(() => {
    let books = allBooks.value

    if (hasSearch.value && fuse.value) {
      const query = `${searchFilters.value.title} ${searchFilters.value.author}`.trim()
      books = fuse.value.search(query).map((r) => r.item)
    }

    return books.filter(applyFilter)
  })

  const dropdowns = reactive({ genres: false, tags: false })

  function toggleDropdown(type: keyof typeof dropdowns) {
    dropdowns[type] = !dropdowns[type]
  }

  function closeDropdown(type: keyof typeof dropdowns) {
    dropdowns[type] = false
  }

  function toggleFilterItem(type: "genres" | "tags", item: string) {
    const arr = searchFilters.value[type]
    const idx = arr.indexOf(item)
    if (idx === -1) {
      arr.push(item)
    } else {
      arr.splice(idx, 1)
    }
  }

  const filteredTagCounts = computed(() => {
    const tagMap = new Map<string, number>()
    const selectedTags = new Set(searchFilters.value.tags)

    const filteredBooks = allBooks.value.filter((book) => {
      const { genres, rating, status } = searchFilters.value

      if (
        (genres.length && !genres.every((g) => book.genres.includes(g))) ||
        (rating && (book.rating ?? 0) < rating) ||
        (status && book.status !== status)
      ) {
        return false
      }

      if (hasSearch.value && fuse.value) {
        const query = `${searchFilters.value.title} ${searchFilters.value.author}`.trim()
        const matched = fuse.value.search(query).some((r) => r.item.id === book.id)
        if (!matched) return false
      }

      return true
    })

    for (const book of filteredBooks) {
      for (const tag of book.tags || []) {
        if (!selectedTags.has(tag)) {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
        }
      }
    }

    return [...tagMap.entries()].sort((a, b) => b[1] - a[1])
  })

  const filteredGenreCounts = computed(() => {
    const genreMap = new Map<string, number>()
    const selectedGenres = new Set(searchFilters.value.genres)

    const filteredBooks = allBooks.value.filter((book: Book) => {
      const { genres, rating, status } = searchFilters.value

      if (
        (genres.length && !genres.every((g) => book.genres.includes(g))) ||
        (rating && (book.rating ?? 0) < rating) ||
        (status && book.status !== status)
      ) {
        return false
      }

      if (hasSearch.value && fuse.value) {
        const query = `${searchFilters.value.title} ${searchFilters.value.author}`.trim()
        const matched = fuse.value.search(query).some((r) => r.item.id === book.id)
        if (!matched) return false
      }

      return true
    })

    for (const book of filteredBooks) {
      for (const genre of book.genres || []) {
        if (!selectedGenres.has(genre)) {
          genreMap.set(genre, (genreMap.get(genre) || 0) + 1)
        }
      }
    }

    return [...genreMap.entries()].sort((a, b) => b[1] - a[1])
  })

  function clearAllFilters() {
    searchFilters.value = {
      title: "",
      author: "",
      genres: [],
      tags: [],
      rating: null,
      status: "",
    }
  }

  return {
    searchFilters,
    allGenres,
    allTags,
    filteredBooks,
    dropdowns,
    filteredTagCounts,
    filteredGenreCounts,
    toggleDropdown,
    closeDropdown,
    toggleFilterItem,
    clearAllFilters,
  }
}
