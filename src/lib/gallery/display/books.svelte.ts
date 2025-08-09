import { browser } from "$app/environment";
import { PersistedState } from "runed";
import { onDestroy, onMount } from "svelte";

export function display() {
    let is_filter_collapsed = $state(true);
    let expanded_input_ref = $state<HTMLElement | null>(null);
    const view_mode_storage = new PersistedState<"masonry" | "list">(
        "book-gallery-view-mode",
        "masonry",
    );
    let expanded_card = $state<string | number | null>(null);
    let idle_timeout = $state<ReturnType<typeof setTimeout>>();
    let is_idle = $state(false);

    function toggle_card(book_id: string | number) {
        expanded_card = expanded_card === book_id ? null : book_id;
    }

    function close_card() {
        expanded_card = null;
    }

    function set_view_mode(mode: "masonry" | "list") {
        view_mode_storage.current = mode;
    }

    function toggle_view_mode() {
        const current_mode = view_mode_storage.current;
        view_mode_storage.current = current_mode === "masonry" ? "list" : "masonry";
    }

    function handle_escape(event: KeyboardEvent) {
        if (event.key === "Escape") close_card();
    }

    function reset_idle_timer() {
        if (idle_timeout) clearTimeout(idle_timeout);

        is_idle = false;

        idle_timeout = setTimeout(() => {
            is_idle = true;
        }, 180 * 1000);
    }

    function toggle_search_mode() {
        is_filter_collapsed = !is_filter_collapsed;
    }

    function cleanup() {
        if (idle_timeout) {
            clearTimeout(idle_timeout);
        }

        if (browser) {
            document.removeEventListener("keydown", handle_escape);
            window.removeEventListener("mousemove", reset_idle_timer);
            window.removeEventListener("keydown", reset_idle_timer);
            window.removeEventListener("scroll", reset_idle_timer);
            window.removeEventListener("click", reset_idle_timer);
        }
    }

    return {
        get is_filter_collapsed() {
            return is_filter_collapsed;
        },
        set is_filter_collapsed(value: boolean) {
            is_filter_collapsed = value;
        },
        get expanded_input_ref() {
            return expanded_input_ref;
        },
        set expanded_input_ref(value: HTMLElement | null) {
            expanded_input_ref = value;
        },
        get view_mode() {
            return view_mode_storage.current;
        },
        set view_mode(value: "masonry" | "list") {
            view_mode_storage.current = value;
        },
        get expanded_card() {
            return expanded_card;
        },
        get is_idle() {
            return is_idle;
        },
        toggle_card,
        close_card,
        toggle_search_mode,
        reset_idle_timer,
        cleanup,
        set_view_mode,
        toggle_view_mode,
    };
}

export const books_display = display();
export function use_books_display() {
    onMount(() => {
        books_display.reset_idle_timer();

        if (browser) {
            document.addEventListener("keydown", books_display.reset_idle_timer);
            window.addEventListener("mousemove", books_display.reset_idle_timer);
            window.addEventListener("keydown", books_display.reset_idle_timer);
            window.addEventListener("scroll", books_display.reset_idle_timer);
            window.addEventListener("click", books_display.reset_idle_timer);

            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    books_display.close_card();
                }
            });
        }
    });

    onDestroy(() => {
        books_display.cleanup();
    });

    return books_display;
}
