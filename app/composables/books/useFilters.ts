import { ref, computed, watch, reactive, nextTick, type Ref } from "vue";
import { useStorage } from "@vueuse/core";
import Fuse from "fuse.js";

interface Book {
  id: string | number;
  title: string;
  author: string;
  genres: string[];
  tags: string[];
  rating: number;
  status: string;
  description: string;
  myThoughts: string;
  links?: { title: string; url: string }[];
  coverImage?: string;
}

interface Filters {
  title: string;
  author: string;
  genres: string[];
  tags: string[];
  rating: number | null;
  status: string;
}

export function useFilters(allBooks: Ref<Book[]>) {
  const rawFilters = useStorage<Filters>("book-filters", {
    title: "",
    author: "",
    genres: [],
    tags: [],
    rating: null,
    status: "",
  });

  const searchFilters: Ref<Filters> = ref({ ...rawFilters.value });

  watch(
    searchFilters,
    (newVal) => {
      rawFilters.value = { ...newVal };
    },
    { deep: true }
  );

  const fuse = computed(() => {
    return new Fuse(allBooks.value, {
      keys: ["title", "author", "genres", "tags"],
      threshold: 0.3,
    });
  });

  const allGenres = computed(() => {
    const genreSet = new Set<string>();
    allBooks.value.forEach((book) =>
      book.genres.forEach((genre) => genreSet.add(genre))
    );
    return Array.from(genreSet).sort();
  });

  const allTags = computed(() => {
    const tagSet = new Set<string>();
    allBooks.value.forEach((book) =>
      book.tags?.forEach((tag) => tagSet.add(tag))
    );
    return Array.from(tagSet).sort();
  });

  const filteredBooks = computed(() => {
    let result = allBooks.value;

    const hasSearch =
      searchFilters.value.title.trim() || searchFilters.value.author.trim();

    if (hasSearch) {
      const query =
        `${searchFilters.value.title} ${searchFilters.value.author}`.trim();
      result = fuse.value.search(query).map(({ item }) => item);
    }

    return result.filter((book) => {
      const genreMatch =
        searchFilters.value.genres.length === 0 ||
        searchFilters.value.genres.every((genre) =>
          book.genres.includes(genre)
        );

      const tagMatch =
        searchFilters.value.tags.length === 0 ||
        (book.tags &&
          searchFilters.value.tags.every((tag) => book.tags.includes(tag)));

      const ratingMatch =
        !searchFilters.value.rating ||
        (book.rating ?? 0) >= searchFilters.value.rating;

      const statusMatch =
        !searchFilters.value.status ||
        book.status === searchFilters.value.status;

      return genreMatch && tagMatch && ratingMatch && statusMatch;
    });
  });

  const dropdowns = reactive<{ genres: boolean; tags: boolean }>({
    genres: false,
    tags: false,
  });

  function toggleDropdown(type: "genres" | "tags") {
    dropdowns[type] = !dropdowns[type];
  }

  function closeDropdown(type: "genres" | "tags") {
    dropdowns[type] = false;
  }

  function toggleFilterItem(type: "genres" | "tags", item: string) {
    const arr = searchFilters.value[type];
    const idx = arr.indexOf(item);
    if (idx === -1) {
      arr.push(item);
    } else {
      arr.splice(idx, 1);
    }
  }

  // To show tag counts on tags not currently selected
  const filteredTagCounts = computed(() => {
    const tagCountMap = new Map<string, number>();

    // Filter books based on current filters, but *before* applying the current tag filter
    const booksBeforeCurrentTagFilter = allBooks.value.filter((book) => {
      const genreMatch =
        searchFilters.value.genres.length === 0 ||
        searchFilters.value.genres.every((genre) =>
          book.genres.includes(genre)
        );

      const ratingMatch =
        !searchFilters.value.rating ||
        (book.rating ?? 0) >= searchFilters.value.rating;

      const statusMatch =
        !searchFilters.value.status ||
        book.status === searchFilters.value.status;

      const hasSearch =
        searchFilters.value.title.trim() || searchFilters.value.author.trim();
      let searchMatch = true;
      if (hasSearch) {
        const query =
          `${searchFilters.value.title} ${searchFilters.value.author}`.trim();
        searchMatch = fuse.value
          .search(query)
          .some((result) => result.item.id === book.id);
      }

      return genreMatch && ratingMatch && statusMatch && searchMatch;
    });

    for (const book of booksBeforeCurrentTagFilter) {
      for (const tag of book.tags || []) {
        if (!searchFilters.value.tags.includes(tag)) {
          // Only count tags not currently selected
          tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
        }
      }
    }

    return Array.from(tagCountMap.entries()).sort((a, b) => b[1] - a[1]);
  });

  function clearAllFilters() {
    searchFilters.value = {
      title: "",
      author: "",
      genres: [],
      tags: [],
      rating: null,
      status: "",
    };
  }

  return {
    searchFilters,
    allGenres,
    allTags,
    filteredBooks,
    dropdowns,
    toggleDropdown,
    closeDropdown,
    toggleFilterItem,
    filteredTagCounts,
    clearAllFilters,
  };
}