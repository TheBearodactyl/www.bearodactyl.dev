<script lang="ts">
    import { show_explicit } from "$lib/stores/show_explicit.svelte";
    import ExplicitContentToggle from "./ExplicitContentToggle.svelte";
    import ViewModeToggle from "./ViewModeToggle.svelte";

    interface Props {
        modelvalue: string;
        view_mode: "masonry" | "list";
        onupdate_modelvalue?: (value: string) => void;
        ontoggle_search_mode?: () => void;
        set_view_mode: (mode: "masonry" | "list") => void;
    }

    let {
        modelvalue,
        onupdate_modelvalue,
        ontoggle_search_mode,
        view_mode,
        set_view_mode,
    }: Props = $props();

    let transitioning = $state(false);

    async function handle_view_mode_change(
        mode: "masonry" | "list",
    ): Promise<void> {
        if (transitioning) return;

        transitioning = true;

        const bookGrid = document.querySelector(".book-grid");
        if (bookGrid) {
            bookGrid.classList.add("transitioning");
            bookGrid.classList.add(
                mode === "list" ? "entering-list" : "entering-grid",
            );
        }

        setTimeout(() => {
            set_view_mode(mode);
        }, 150);

        setTimeout(() => {
            if (bookGrid) {
                bookGrid.classList.remove(
                    "transitioning",
                    "entering-list",
                    "entering-grid",
                );
            }
            transitioning = false;
        }, 600);
    }

    const handle_toggle_search_mode = () => {
        ontoggle_search_mode?.();
    };

    const handle_toggle_explicit = () => {
        show_explicit.set(!$show_explicit);
    };

    const handle_input = (event: Event) => {
        const target = event.target as HTMLInputElement | null;
        if (target) {
            onupdate_modelvalue?.(target.value);
        }
    };

    const handle_keydown = (event: KeyboardEvent) => {
        if (event.key === "ArrowRight") {
            handle_toggle_search_mode();
        }
    };
</script>

<div class="filter-pill-container">
    <div class="filter-pill">
        <input
            class="pill-search-input"
            placeholder="Search..."
            value={modelvalue}
            oninput={handle_input}
            onkeydown={handle_keydown}
        />
        <ViewModeToggle
            active_view_mode={view_mode}
            {handle_view_mode_change}
        />
        <button
            class="pill-filter-btn"
            onclick={handle_toggle_search_mode}
        >
            <span class="icon">☰</span>
        </button>
        <ExplicitContentToggle {handle_toggle_explicit} />
    </div>
</div>
