import { ref, onMounted, type Ref } from "vue"
import { getGithubRelease } from "@/utils/getGithubRelease"
import { shuffleArray } from "@/utils/misc"

export interface Book {
  id: string | number
  title: string
  author: string
  genres: string[]
  tags: string[]
  rating: number
  status: string
  description: string
  myThoughts: string
  links?: { title: string; url: string }[]
  coverImage: string
  explicit: boolean
  color?: string
}

const IMAGE_CACHE_NAME = "book-cover-cache"

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
  const books: Ref<Book[]> = ref([])
  const isLoading: Ref<boolean> = ref(true)
  const fetchError: Ref<string | null> = ref(null)
  const downloadProgress: Ref<number> = ref(0)
  const isContentVisible: Ref<boolean> = ref(false)

  async function loadBooksWithProgress() {
    try {
      isLoading.value = true
      downloadProgress.value = 0

      downloadProgress.value = 5

      const fileContents = await getGithubRelease(
        "thebearodactyl",
        "bearodactyl.dev",
        "books.json",
      )
      const data = JSON.parse(await fileContents.text())

      downloadProgress.value = 20

      const booksWithImages = data.filter((book: Book) => book.coverImage)

      const promises = booksWithImages.map(
        async (book: Book, index: number) => {
          book.coverImage = await cacheCoverImage(book.coverImage)
          const progress =
            20 + Math.round(((index + 1) / booksWithImages.length) * 80)
          downloadProgress.value = progress
        },
      )

      await Promise.all(promises)

      books.value = shuffleArray<Book>(data)
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
    await loadBooksWithProgress()
  })

  return {
    books,
    isLoading,
    fetchError,
    downloadProgress,
    isContentVisible,
    loadBooksWithProgress,
  }
}
