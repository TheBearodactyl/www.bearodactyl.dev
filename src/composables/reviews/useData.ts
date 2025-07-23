import { getGithubRelease } from "@/utils/getGithubRelease"
import { onMounted, ref, type Ref } from "vue"

interface Review {
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

      const data: Review[] = JSON.parse(await fileContents.text())
      reviews.value = data

      downloadProgress.value = 100
    } catch (err) {
      fetchError.value = err?.message ?? String(err)
      console.error("Error loading reviews: ", err)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    loadWithProgress()
  })

  return {
    reviews,
    isLoading,
    fetchError,
    downloadProgress,
  }
}
