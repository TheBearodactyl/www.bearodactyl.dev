import { getGithubRelease } from "@/utils/getGithubRelease"
import { onMounted, ref, type Ref } from "vue"

interface Project {
  name: string
  description: string
  tags?: string[]
  source: string
  coverImage?: string
  installCommand?: string
}

const IMAGE_CACHE_NAME = "project-cover-cache"

async function cacheCoverImage(url: string): Promise<string> {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME)
    const cachedResponse = await cache.match(url)

    if (cachedResponse) {
      const blob = await cachedResponse.blob()
      return URL.createObjectURL(blob)
    }

    const response = await fetch(url, { mode: "cors" })
    if (response.ok) {
      await cache.put(url, response.clone())
      const blob = await response.blob()
      return URL.createObjectURL(blob)
    } else {
      console.warn(`Failed to fetch cover image: ${url}`)
      return url
    }
  } catch (e) {
    console.error(`Error caching image ${url}`, e)
    return url
  }
}

export function useData() {
  const projects: Ref<Project[]> = ref([])
  const isLoading: Ref<boolean> = ref(true)
  const fetchError: Ref<string | null> = ref(null)
  const downloadProgress: Ref<number> = ref(0)

  async function loadWithProgress() {
    try {
      isLoading.value = true
      downloadProgress.value = 10

      const fileContents = await getGithubRelease(
        "TheBearodactyl",
        "bearodactyl.dev",
        "projects.json",
      )

      downloadProgress.value = 50

      const data: Project[] = JSON.parse(await fileContents.text())
      const projectsWithImages: Project[] = data.filter((p) => p.coverImage)
      let loadedImagesCount = 0

      for (const project of data) {
        if (project.coverImage) {
          project.coverImage = await cacheCoverImage(project.coverImage)
          loadedImagesCount++
          downloadProgress.value =
            50 + Math.round((loadedImagesCount / projectsWithImages.length) * 50)
        }
      }

      projects.value = data
      downloadProgress.value = 100
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      fetchError.value = err?.message ?? String(err)
      console.error("Error loading projects: ", err)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(async () => {
    await loadWithProgress()
  })

  return {
    projects,
    isLoading,
    fetchError,
    downloadProgress,
  }
}
