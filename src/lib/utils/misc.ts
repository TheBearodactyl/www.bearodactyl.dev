export function is_peak<T extends { title: string }>(
    item: T,
): boolean {
    return (
        item.title === "P5R" || item.title === "One Piece"
    );
}
