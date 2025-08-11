export function is_peak<T extends { title: string }>(
    item: T,
): boolean {
    return (
        item.title === "P5R" || item.title === "One Piece"
    );
}

export function scroll_to_top() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}