<script lang="ts">
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
        toggleViewMode
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
            placeholder="Search"
            value={modelValue}
            oninput={handleInput}
            onkeydown={handleKeydown}
        />
        <div class="view-toggle" data-active={viewMode}>
            <button
                class="view-btn"
                class:active={viewMode === "masonry"}
                onclick={() => setViewMode("masonry")}
            >
                <span class="view-btn-icon">▦</span>
                Grid
            </button>
            <button
                class="view-btn"
                class:active={viewMode === "list"}
                onclick={() => setViewMode("list")}
            >
                <span class="view-btn-icon">☰</span>
                List
            </button>
        </div>
        <button class="pill-filter-btn" onclick={handleToggleSearchMode}>
            <span class="icon">☰</span>
        </button>
    </div>
</div>
