import { ref, onMounted, type Ref } from "vue"
import { getGithubRelease } from "@/utils/getGithubRelease"
import { shuffleArray } from "@/utils/misc"

export interface Game {
  id: string | number
  title: string
  developer: string
  genres: string[]
  tags: string[]
  rating: number
  status: string
  description: string
  myThoughts: string
  links?: { title: string; url: string }[]
  coverImage?: string
  explicit: boolean
}

const IMAGE_CACHE_NAME = "game-cover-cache"

async function cacheCoverImage(
  url: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  try {
    const cache = await caches.open(IMAGE_CACHE_NAME)
    const cachedResponse = await cache.match(url)

    if (cachedResponse) {
      onProgress?.(100)
      const blob = await cachedResponse.blob()
      return URL.createObjectURL(blob)
    }

    onProgress?.(25)
    const response = await fetch(url, { mode: "cors" })

    if (response.ok) {
      onProgress?.(75)
      await cache.put(url, response.clone())
      onProgress?.(100)
      const blob = await response.blob()
      return URL.createObjectURL(blob)
    } else {
      console.warn(`Failed to fetch cover image: ${url}`)
      onProgress?.(100)
      return url
    }
  } catch (e) {
    console.error(`Error caching image ${url}`, e)
    onProgress?.(100)
    return url
  }
}

export function useData() {
  const games: Ref<Game[]> = ref([])
  const isLoading: Ref<boolean> = ref(true)
  const fetchError: Ref<string | null> = ref(null)
  const downloadProgress: Ref<number> = ref(0)
  const isContentVisible: Ref<boolean> = ref(false)

  async function loadWithProgress() {
    try {
      isLoading.value = true
      downloadProgress.value = 0

      downloadProgress.value = 5

      const file_contents = await getGithubRelease(
        "thebearodactyl",
        "bearodactyl.dev",
        "games.json",
      )
      const data = JSON.parse(await file_contents.text())

      console.log(data)
      downloadProgress.value = 20

      const gamesWithImages = data.filter((game: Game) => game.coverImage)
      const totalImages = gamesWithImages.length

      if (totalImages > 0) {
        let processedImages = 0
        for (const game of data) {
          if (game.coverImage) {
            const imageStartProgress =
              20 + Math.round((processedImages / totalImages) * 80)
            const imageEndProgress =
              20 + Math.round(((processedImages + 1) / totalImages) * 80)

            game.coverImage = await cacheCoverImage(
              game.coverImage,
              (imageProgress) => {
                const currentProgress =
                  imageStartProgress +
                  Math.round(
                    (imageProgress / 100) *
                      (imageEndProgress - imageStartProgress),
                  )
                downloadProgress.value = currentProgress
              },
            )
            processedImages++
          }
        }
      } else {
        downloadProgress.value = 100
      }

      games.value = shuffleArray<Game>(data)
      downloadProgress.value = 100
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      fetchError.value = err?.message ?? String(err)
      console.error("Error loading books:", err)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(async () => {
    await loadWithProgress()
  })

  return {
    games,
    isLoading,
    fetchError,
    downloadProgress,
    isContentVisible,
    loadGamesWithProgress: loadWithProgress,
  }
}
