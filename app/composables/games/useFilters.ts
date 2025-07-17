import { ref, computed, watch, reactive, nextTick, type Ref } from "vue";
import { useStorage } from "@vueuse/core";
import Fuse from "fuse.js";

interface Game {
  id: string | number;
  title: string;
  developer: string;
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
  developer: string;
  genres: string[];
  tags: string[];
  rating: number | null;
  status: string;
}

export function useFilters(allGames: Ref<Game[]>) {
  const rawFilters = useStorage<Filters>("game-filters", {
    title: "",
    developer: "",
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
    return new Fuse(allGames.value, {
      keys: ["title", "developer", "genres", "tags"],
      threshold: 0.3,
    });
  });

  const allGenres = computed(() => {
    const genreSet = new Set<string>();
    allGames.value.forEach((game) =>
      game.genres.forEach((genre) => genreSet.add(genre))
    );
    return Array.from(genreSet).sort();
  });

  const allTags = computed(() => {
    const tagSet = new Set<string>();
    allGames.value.forEach((game) =>
      game.tags?.forEach((tag) => tagSet.add(tag))
    );
    return Array.from(tagSet).sort();
  });

  const filteredGames = computed(() => {
    let result = allGames.value;

    const hasSearch =
      searchFilters.value.title.trim() || searchFilters.value.developer.trim();

    if (hasSearch) {
      const query =
        `${searchFilters.value.title} ${searchFilters.value.developer}`.trim();
      result = fuse.value.search(query).map(({ item }) => item);
    }

    return result.filter((game) => {
      const genreMatch =
        searchFilters.value.genres.length === 0 ||
        searchFilters.value.genres.every((genre) =>
          game.genres.includes(genre)
        );

      const tagMatch =
        searchFilters.value.tags.length === 0 ||
        (game.tags &&
          searchFilters.value.tags.every((tag) => game.tags.includes(tag)));

      const ratingMatch =
        !searchFilters.value.rating ||
        (game.rating ?? 0) >= searchFilters.value.rating;

      const statusMatch =
        !searchFilters.value.status ||
        game.status === searchFilters.value.status;

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

  const filteredTagCounts = computed(() => {
    const tagCountMap = new Map<string, number>();

    const gamesBeforeCurrentTagFilter = allGames.value.filter((game) => {
      const genreMatch =
        searchFilters.value.genres.length === 0 ||
        searchFilters.value.genres.every((genre) =>
          game.genres.includes(genre)
        );

      const ratingMatch =
        !searchFilters.value.rating ||
        (game.rating ?? 0) >= searchFilters.value.rating;

      const statusMatch =
        !searchFilters.value.status ||
        game.status === searchFilters.value.status;

      const hasSearch =
        searchFilters.value.title.trim() ||
        searchFilters.value.developer.trim();
      let searchMatch = true;
      if (hasSearch) {
        const query =
          `${searchFilters.value.title} ${searchFilters.value.developer}`.trim();
        searchMatch = fuse.value
          .search(query)
          .some((result) => result.item.id === game.id);
      }

      return genreMatch && ratingMatch && statusMatch && searchMatch;
    });

    for (const game of gamesBeforeCurrentTagFilter) {
      for (const tag of game.tags || []) {
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
      developer: "",
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
    filteredGames,
    dropdowns,
    toggleDropdown,
    closeDropdown,
    toggleFilterItem,
    filteredTagCounts,
    clearAllFilters,
  };
}