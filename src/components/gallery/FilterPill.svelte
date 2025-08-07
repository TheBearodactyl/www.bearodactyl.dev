<script lang="ts">
    import { show_explicit } from "$lib/stores/show_explicit";
    import { _ } from "svelte-i18n";

    interface Props {
        modelValue: string;
        "onupdate-modelValue"?: (value: string) => void;
        "ontoggle-search-mode"?: () => void;
        viewMode: "masonry" | "list";
        setViewMode: (mode: "masonry" | "list") => void;
        toggleViewMode: () => void;
    }

    let {
        modelValue,
        "onupdate-modelValue": onUpdateModelValue,
        "ontoggle-search-mode": onToggleSearchMode,
        viewMode,
        setViewMode,
        toggleViewMode,
    }: Props = $props();

    let isTransitioning = $state(false);

    const handleViewModeChange = async (mode: "masonry" | "list") => {
        if (isTransitioning) return;

        isTransitioning = true;

        const bookGrid = document.querySelector(".book-grid");
        if (bookGrid) {
            bookGrid.classList.add("transitioning");
            bookGrid.classList.add(mode === "list" ? "entering-list" : "entering-grid");
        }

        setTimeout(() => {
            setViewMode(mode);
        }, 150);

        setTimeout(() => {
            if (bookGrid) {
                bookGrid.classList.remove("transitioning", "entering-list", "entering-grid");
            }
            isTransitioning = false;
        }, 600);
    };

    const handleToggleSearchMode = () => {
        onToggleSearchMode?.();
    };

    const handleToggleExplicit = () => {
        show_explicit.set(!$show_explicit);
    };

    const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement | null;
        if (target) {
            onUpdateModelValue?.(target.value);
        }
    };

    const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "ArrowRight") {
            handleToggleSearchMode();
        }
    };
</script>

<div class="filter-pill-container">
    <div class="filter-pill">
        <input
            class="pill-search-input"
            placeholder={$_("gallery.filters.search")}
            value={modelValue}
            oninput={handleInput}
            onkeydown={handleKeydown}
        />
        <div class="view-toggle" data-active={viewMode}>
            <button
                class="view-btn"
                class:active={viewMode === "masonry"}
                onclick={async () => {
                    await handleViewModeChange(viewMode === "masonry" ? "list" : "masonry");
                }}
            >
                {viewMode === "masonry" ? "Grid" : "List"}
                <span class="view-btn-icon">{viewMode === "masonry" ? "▦" : "☰"}</span>
            </button>
        </div>
        <button class="pill-filter-btn" onclick={handleToggleSearchMode}>
            <span class="icon">☰</span>
        </button>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
            title="Toggle Explicit Content Blur"
            class="pill-filter-btn"
            onclick={handleToggleExplicit}
        >
            <span class="icon" style="padding-top: 8px;">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-alert-triangle"
                    ><path
                        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                    ></path><line x1="12" y1="9" x2="12" y2="13"></line><line
                        x1="12"
                        y1="17"
                        x2="12.01"
                        y2="17"
                    ></line></svg
                >
            </span>
        </button>
    </div>
</div>
