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
