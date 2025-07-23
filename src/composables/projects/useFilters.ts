import { ref, computed, watch, reactive, type Ref } from "vue"
import { useStorage } from "@vueuse/core"
import Fuse from "fuse.js"

interface Project {
  name: string
  description: string
  tags?: string[]
  source: string
  coverImage?: string
  installCommand?: string
}

interface ProjectFilters {
  name: string
  tags: string[]
}

export function useFilters(allProjects: Ref<Project[]>) {
  const rawFilters = useStorage<ProjectFilters>("project-filters", {
    name: "",
    tags: [],
  })

  const searchFilters: Ref<ProjectFilters> = ref({ ...rawFilters.value })

  watch(
    searchFilters,
    (val) => {
      rawFilters.value = { ...val }
    },
    { deep: true },
  )

  const fuse = computed(() => {
    return new Fuse(allProjects.value, {
      keys: ["name", "description", "tags"],
      threshold: 0.3,
    })
  })

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    allProjects.value.forEach((project) => project.tags?.forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  })

  const filteredProjects = computed(() => {
    let result = allProjects.value

    const hasSearch = searchFilters.value.name.trim()

    if (hasSearch) {
      const query = searchFilters.value.name.trim()
      result = fuse.value.search(query).map(({ item }) => item)
    }

    return result.filter((project) => {
      const tagMatch =
        searchFilters.value.tags.length === 0 ||
        (project.tags && searchFilters.value.tags.every((tag) => project.tags?.includes(tag)))
      return tagMatch
    })
  })

  const dropdowns = reactive<{ tags: boolean }>({ tags: false })

  function toggleDropdown(type: "tags") {
    dropdowns[type] = !dropdowns[type]
  }

  function closeDropdown(type: "tags") {
    dropdowns[type] = false
  }

  function openDropdown(type: "tags") {
    dropdowns[type] = true
  }

  function toggleFilterTag(tag: string) {
    const arr = searchFilters.value["tags"]
    const idx = arr.indexOf(tag)
    if (idx === -1) {
      arr.push(tag)
    } else {
      arr.splice(idx, 1)
    }
  }

  function delayedCloseDropdown(type: "tags") {
    setTimeout(() => {
      closeDropdown(type)
    }, 150)
  }

  const filteredTagCounts = computed(() => {
    const tagCountMap = new Map<string, number>()

    const projectsBeforeCurrentTagFilter = allProjects.value.filter((project) => {
      const hasSearch = searchFilters.value.name.trim()
      let searchMatch = true
      if (hasSearch) {
        const query = searchFilters.value.name.trim()
        searchMatch = fuse.value.search(query).some((result) => result.item.name === project.name)
      }
      return searchMatch
    })

    for (const project of projectsBeforeCurrentTagFilter) {
      for (const tag of project.tags || []) {
        if (!searchFilters.value.tags.includes(tag)) {
          tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1)
        }
      }
    }

    return Array.from(tagCountMap.entries()).sort((a, b) => b[1] - a[1])
  })

  return {
    searchFilters,
    allTags,
    filteredProjects,
    dropdowns,
    filteredTagCounts,
    toggleDropdown,
    closeDropdown,
    openDropdown,
    toggleFilterTag,
    delayedCloseDropdown,
  }
}
