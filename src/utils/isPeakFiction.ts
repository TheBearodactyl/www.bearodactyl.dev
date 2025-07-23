import type { Book } from "@/composables/books/useData"
import type { Game } from "@/composables/games/useData"

function isBook(item: Book | Game): item is Book {
  return (
    typeof item === "object" && item !== null && "author" in item && typeof item.author === "string"
  )
}

function isGame(item: Book | Game): item is Game {
  return (
    typeof item === "object" &&
    item !== null &&
    "developer" in item &&
    typeof item.developer === "string"
  )
}

export function isPeakFiction(item: Book | Game): boolean {
  if (isBook(item)) {
    return item.title.toLowerCase() === "one piece"
  } else if (isGame(item)) {
    return item.title.toLowerCase() === "p5r"
  }
}
