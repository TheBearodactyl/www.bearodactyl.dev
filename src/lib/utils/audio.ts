export const audio_cache = (() => {
    const map = new Map<string, string>();

    async function get(src: string): Promise<string> {
        if (!src) throw new Error("no-src");
        if (map.has(src)) return map.get(src)!;

        const res = await fetch(src, { cache: "force-cache" });
        if (!res.ok) throw new Error(`Failed to fetch audio: ${res.status}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        map.set(src, url);
        return url;
    }

    function prefetch(src?: string) {
        if (!src || map.has(src)) return;
        fetch(src, { cache: "force-cache" })
            .then((r) => {
                if (!r.ok) throw new Error("prefetch-failed");
                return r.blob();
            })
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                map.set(src, url);
            })
            .catch(() => {});
    }

    function has(src?: string) {
        if (!src) return false;
        return map.has(src);
    }

    function revoke_all() {
        for (const url of map.values()) URL.revokeObjectURL(url);
        map.clear();
    }

    return { get, prefetch, has, revoke_all: revoke_all };
})();
