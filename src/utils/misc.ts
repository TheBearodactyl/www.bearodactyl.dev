import type { Book } from "@/composables/books/useData"
import type { Game } from "@/composables/games/useData"
import type { Review } from "@/composables/reviews/useData"

function isBook(item: Book | Game): item is Book {
  return (
    typeof item === "object" &&
    "author" in item &&
    typeof item.author === "string"
  )
}

function isGame(item: Book | Game): item is Game {
  return (
    typeof item === "object" &&
    "developer" in item &&
    typeof item.developer === "string"
  )
}

export function isPeakFiction(item: Book | Game): boolean {
  if (isBook(item)) {
    return item.title.toLowerCase() === "one piece"
  } else if (isGame(item)) {
    return item.title.toLowerCase() === "p5r"
  } else {
    return false
  }
}

export function shuffleArray<T>(input: readonly T[]): T[] {
  const array = input.slice()

  const getRandomIndex = (max: number): number => {
    let randomValue

    if (typeof window !== "undefined") {
      randomValue = window.crypto.getRandomValues(new Uint32Array(1))[0]
    } else {
      randomValue = Math.random()
    }

    return Math.floor((randomValue * max + Math.random() * max) % (max + 1))
  }

  const passes = 20

  for (let k = 0; k < passes; k++) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = getRandomIndex(i)

      if (j >= 0 && j < array.length) {
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
    }
  }

  return array
}

export function sortReviews(input: readonly Review[]): Review[] {
  return input.slice().sort((a, b) => a.chapter - b.chapter)
}
