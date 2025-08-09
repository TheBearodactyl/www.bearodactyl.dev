import { LogLvl, type ProgressCallback } from "$lib/types";
import { Bearror } from "./errs";
import { fetch_cors } from "./net";

export async function cache_cover(
    cache_name: string,
    url: string,
    on_progress?: ProgressCallback,
): Promise<string> {
    const report_progress = (p: number) => on_progress?.(p);

    try {
        report_progress(0);
        const cache = await caches.open(cache_name);
        report_progress(10);
        const cached_response = await cache.match(url);

        if (cached_response) {
            report_progress(75);
            const blob = await cached_response.blob();
            const obj_url = URL.createObjectURL(blob);
            report_progress(100);
            return obj_url;
        }

        report_progress(25);

        const response = await fetch_cors(url);

        if (!response.ok) {
            const err_msg = new Bearror(
                LogLvl.WARN,
                `Failed to fetch cover image. Status: ${response.status} ${response.statusText}`,
            ).to_string();

            console.warn(err_msg);
            report_progress(100);
            return url;
        }

        report_progress(50);

        await cache.put(url, response.clone());

        report_progress(75);

        const blob = await response.blob();
        const object_url = URL.createObjectURL(blob);

        report_progress(100);

        return object_url;
    } catch (error) {
        const error_msg = new Bearror(
            LogLvl.ERR,
            "cache_cover process error",
        )
            .set_full_msg(error)
            .to_string();

        console.error(error_msg);
        report_progress(100);
        return url;
    }
}

export function lazy_load(
    node: HTMLImageElement,
    options: IntersectionObserverInit = {
        rootMargin: "200px",
        threshold: 0.01,
    },
): { destroy(): void } {
    if (!node.dataset.src) return { destroy: () => {} };

    let observer: IntersectionObserver;

    const loadImage = () => {
        if (node.dataset.src) {
            node.src = node.dataset.src;
            node.removeAttribute("data-src");
        }
        if (node.dataset.srcset) {
            node.srcset = node.dataset.srcset;
            node.removeAttribute("data-srcset");
        }
        observer?.disconnect();
    };

    if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) loadImage();
            }
        }, options);

        observer.observe(node);
    } else {
        loadImage();
    }

    return {
        destroy() {
            observer?.disconnect();
        },
    };
}
