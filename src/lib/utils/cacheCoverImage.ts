export async function cacheCoverImage(
    cacheName: string,
    url: string,
    onProgress?: (progress: number) => void,
): Promise<string> {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(url);

        if (cachedResponse) {
            onProgress?.(100);
            const blob = await cachedResponse.blob();
            return URL.createObjectURL(blob);
        }

        onProgress?.(25);
        const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const response = await fetch(proxiedUrl);

        if (response.ok) {
            onProgress?.(75);
            await cache.put(url, response.clone());
            onProgress?.(100);
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } else {
            console.warn(`Failed to fetch cover image: ${url}`);
            onProgress?.(100);
            return url;
        }
    } catch (e) {
        console.error(`Error caching image ${url}`, e);
        onProgress?.(100);
        return url;
    }
}
