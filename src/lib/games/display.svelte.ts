import { onMount, onDestroy } from "svelte";
import { browser } from "$app/environment";

function createPersistentState<T>(key: string, defaultValue: T) {
    let value = $state(defaultValue);

    if (browser) {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
            try {
                value = JSON.parse(stored);
            } catch {
                value = defaultValue;
            }
        }

        localStorage.setItem(
            key,
            JSON.stringify(() => value)
        );
    }

    return {
        get value() {
            return value;
        },
        set value(newValue: T) {
            value = newValue;
        }
    };
}

export function createDisplayStore() {
    let isFilterCollapsed = $state(true);
    let expandedInputRef = $state<HTMLElement | null>(null);
    const viewModeStorage: { value: "masonry" | "list" } = createPersistentState(
        "games-gallery-view-mode",
        "masonry"
    );
    let expandedCard = $state<string | number | null>(null);
    let idleTimeout = $state<ReturnType<typeof setTimeout>>();
    let isIdle = $state(false);

    const IDLE_SECONDS = 60 * 3;

    function toggleCard(gameId: string | number) {
        expandedCard = expandedCard === gameId ? null : gameId;
    }

    function setViewMode(mode: "masonry" | "list") {
        viewModeStorage.value = mode;
    }

    function toggleViewMode() {
        const currentMode = viewModeStorage.value;
        viewModeStorage.value = currentMode === "masonry" ? "list" : "masonry";
    }

    function closeCard() {
        expandedCard = null;
    }

    function handleEscape(event: KeyboardEvent) {
        if (event.key === "Escape") {
            closeCard();
        }
    }

    function resetIdleTimer() {
        if (idleTimeout) {
            clearTimeout(idleTimeout);
        }
        isIdle = false;
        idleTimeout = setTimeout(() => {
            isIdle = true;
        }, IDLE_SECONDS * 1000);
    }

    function toggleSearchMode() {
        isFilterCollapsed = !isFilterCollapsed;
    }

    function cleanup() {
        if (idleTimeout) {
            clearTimeout(idleTimeout);
        }

        if (browser) {
            document.removeEventListener("keydown", handleEscape);
            window.removeEventListener("mousemove", resetIdleTimer);
            window.removeEventListener("keydown", resetIdleTimer);
            window.removeEventListener("scroll", resetIdleTimer);
            window.removeEventListener("click", resetIdleTimer);
        }
    }

    return {
        get isFilterCollapsed() {
            return isFilterCollapsed;
        },
        set isFilterCollapsed(value: boolean) {
            isFilterCollapsed = value;
        },
        get expandedInputRef() {
            return expandedInputRef;
        },
        set expandedInputRef(value: HTMLElement | null) {
            expandedInputRef = value;
        },
        get viewMode() {
            return viewModeStorage.value;
        },
        set viewMode(value: "masonry" | "list") {
            viewModeStorage.value = value;
        },
        get expandedCard() {
            return expandedCard;
        },
        get isIdle() {
            return isIdle;
        },
        toggleCard,
        closeCard,
        toggleSearchMode,
        resetIdleTimer,
        cleanup,
		setViewMode,
		toggleViewMode
    };
}

export const displayStore = createDisplayStore();

export function useDisplay() {
    onMount(() => {
        displayStore.resetIdleTimer();

        if (browser) {
            document.addEventListener("keydown", displayStore.resetIdleTimer);
            window.addEventListener("mousemove", displayStore.resetIdleTimer);
            window.addEventListener("keydown", displayStore.resetIdleTimer);
            window.addEventListener("scroll", displayStore.resetIdleTimer);
            window.addEventListener("click", displayStore.resetIdleTimer);

            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    displayStore.closeCard();
                }
            });
        }
    });

    onDestroy(() => {
        displayStore.cleanup();
    });

    return displayStore;
}
