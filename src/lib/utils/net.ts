export async function get_gh_release(
    owner: string,
    repo: string,
    file: string,
    version_tag: string = "v1.0.0",
): Promise<Blob> {
    const release_url: string = `https://github.com/${owner}/${repo}/releases/download/${version_tag}/${file}`;
    const proxy_url: string = `https://corsproxy.io/?url=${encodeURIComponent(release_url)}`;

    try {
        const res: Response = await fetch(proxy_url);
        console.log(res.json());

        return await (await fetch(proxy_url)).blob();
    } catch (err) {
        console.error("Error fetching GitHub release via proxy:", err);
        throw err instanceof Error ? err : new Error(String(err));
    }
}

export async function fetch_cors(url: string): Promise<Response> {
    const proxy_url = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;

    try {
        return await fetch(proxy_url);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function get_data_release(
    data_type: "books" | "games" | "reviews" | "projects",
): Promise<Blob> {
    return await get_gh_release("TheBearodactyl", "www.bearodactyl.dev", `${data_type}.json`);
}

export async function get_char_count_of_repo(url: string): Promise<number> {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`error status: ${response.status}`);
        }

        const languages: Record<string, number> = await response.json();
        let total_chars = 0;

        for (const [, bytes] of Object.entries(languages)) {
            const estimatedCharacters = Math.round(bytes * 0.7);
            total_chars += estimatedCharacters;
        }

        return total_chars;
    } catch (error) {
        console.error("Error estimating character count of repository:", error);
        throw error;
    }
}
