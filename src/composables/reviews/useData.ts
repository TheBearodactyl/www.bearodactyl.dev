import { getGithubRelease } from "@/utils/getGithubRelease"
import { sortReviews } from "@/utils/misc"
import { onMounted, ref, type Ref } from "vue"

export interface Review {
  chapter: number
  description: string
  rating: number
  thoughts?: string
}

export function useData() {
  const reviews: Ref<Review[]> = ref([])
  const isLoading: Ref<boolean> = ref(true)
  const fetchError: Ref<string | null> = ref(null)
  const downloadProgress: Ref<number> = ref(0)

  async function loadWithProgress() {
    try {
      isLoading.value = true
      downloadProgress.value = 20

      const fileContents = await getGithubRelease(
        "TheBearodactyl",
        "bearodactyl.dev",
        "reviews.json",
      )

      downloadProgress.value = 60

      let data: Review[] = JSON.parse(await fileContents.text())
      data = sortReviews(data)
      reviews.value = data

      downloadProgress.value = 100
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      fetchError.value = err?.message ?? String(err)
      console.error("Error loading reviews: ", err)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(async () => {
    await loadWithProgress()
  })

  return {
    reviews,
    isLoading,
    fetchError,
    downloadProgress,
  }
}
