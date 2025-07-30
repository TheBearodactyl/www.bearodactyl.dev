export function lazyLoad(el: HTMLElement) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;
                img.src = img.dataset.src || "";
                observer.unobserve(img);
            }
        });
    });

    observer.observe(el);
    return {
        destroy() {
            observer.unobserve(el);
        }
    }
}