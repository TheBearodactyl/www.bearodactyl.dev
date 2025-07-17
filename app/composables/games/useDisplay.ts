import { ref, watch, nextTick, onMounted, onUnmounted, type Ref } from "vue";
import { useStorage } from "@vueuse/core";

export function useDisplay() {
  const isFilterCollapsed: Ref<boolean> = ref(true);
  const expandedInputRef: Ref<HTMLInputElement | null> = ref(null);
  const viewMode: Ref<string> = useStorage("game-gallery-view-mode", "grid");
  const expandedCard: Ref<string | number | null> = ref(null);
  const idleTimeout: Ref<ReturnType<typeof setTimeout>> = ref(
    setTimeout(() => {}, 0)
  );
  const isIdle: Ref<boolean> = ref(false);
  const IDLE_SECONDS = 60 * 3;

  watch(isFilterCollapsed, (collapsed) => {
    if (!collapsed) {
      nextTick(() => expandedInputRef.value?.focus());
    }
  });

  const toggleCard = (gameId: string | number) => {
    expandedCard.value = expandedCard.value === gameId ? null : gameId;
  };

  const closeCard = () => {
    expandedCard.value = null;
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeCard();
    }
  };

  const resetIdleTimer = () => {
    clearTimeout(idleTimeout.value);
    isIdle.value = false;
    idleTimeout.value = setTimeout(() => {
      isIdle.value = true;
    }, IDLE_SECONDS * 1000);
  };

  onMounted(() => {
    resetIdleTimer();

    document.addEventListener("keydown", handleEscape);
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("scroll", resetIdleTimer);
    window.addEventListener("click", resetIdleTimer);
  });

  onUnmounted(() => {
    clearTimeout(idleTimeout.value);

    document.removeEventListener("keydown", handleEscape);
    window.removeEventListener("mousemove", resetIdleTimer);
    window.removeEventListener("keydown", resetIdleTimer);
    window.removeEventListener("scroll", resetIdleTimer);
    window.removeEventListener("click", resetIdleTimer);
  });

  const toggleSearchMode = () => {
    isFilterCollapsed.value = !isFilterCollapsed.value;
  };

  return {
    isFilterCollapsed,
    expandedInputRef,
    viewMode,
    expandedCard,
    isIdle,
    idleTimeout,
    resetIdleTimer,
    toggleCard,
    closeCard,
    toggleSearchMode,
  };
}