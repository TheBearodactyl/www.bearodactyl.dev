export function lazyLoad(
    node: HTMLImageElement,
    options: IntersectionObserverInit = { rootMargin: "200px", threshold: 0.01 },
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
