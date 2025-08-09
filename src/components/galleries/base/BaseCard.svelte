<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        index: number;
        expanded: boolean;
        view_mode: "masonry" | "list";
        card_classes: object;
        children: Snippet;
        on_toggle?: () => void;
        explicit: boolean;

        draggable?: boolean;
        on_drag_start?: (event: DragEvent) => void;
        on_drag_enter?: (event: DragEvent) => void;
        on_drag_leave?: (event: DragEvent) => void;
        on_drop?: (event: DragEvent) => void;
        on_drag_end?: (event: DragEvent) => void;
    }

    let {
        index,
        expanded,
        view_mode,
        card_classes,
        children,
        on_toggle,
        explicit,
        draggable = false,
        on_drag_start,
        on_drag_enter,
        on_drag_leave,
        on_drop,
        on_drag_end,
    }: Props = $props();

    const handle_toggle = (event?: MouseEvent) => {
        if (!draggable) {
            on_toggle?.();
        }
    };
</script>

<div
    class="book-card"
    class:expanded
    class:list-view={view_mode === "list"}
    class:card_classes
    style:animation-delay="{index * 0.132}s"
    class:explicit-content={explicit}
    {draggable}
>
    <button
        style="all: unset;"
        onclick={handle_toggle}
        ondragstart={on_drag_start}
        ondragenter={on_drag_enter}
        ondragleave={on_drag_leave}
        ondrop={on_drop}
        ondragend={on_drag_end}
    >
        {@render children()}
    </button>
</div>
