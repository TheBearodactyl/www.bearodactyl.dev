<script lang="ts">
    interface Props {
        index: number;
        expanded: boolean;
        viewMode: string;
        cardClasses: object;
        children: import("svelte").Snippet;
        ontoggle?: () => void;
        explicit: boolean;

        draggable?: boolean;
        onDragStart?: (event: DragEvent) => void;
        onDragEnter?: (event: DragEvent) => void;
        onDragLeave?: (event: DragEvent) => void;
        onDrop?: (event: DragEvent) => void;
        onDragEnd?: (event: DragEvent) => void;
    }

    let {
        index,
        expanded,
        viewMode,
        cardClasses,
        children,
        ontoggle,
        explicit,
        draggable = false,
        onDragStart,
        onDragEnter,
        onDragLeave,
        onDrop,
        onDragEnd,
    }: Props = $props();

    const handleToggle = (event: MouseEvent) => {
        if (!draggable) {
            ontoggle?.();
        }
    };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore event_directive_deprecated -->
<div
    class="book-card"
    class:expanded
    class:list-view={viewMode === "list"}
    class:cardClasses
    style:animation-delay="{index * 0.1}s"
    class:explicit-content={explicit}
    on:click={handleToggle}
    role="button"
    tabindex="0"
    {draggable}
    on:dragstart={onDragStart}
    on:dragenter={onDragEnter}
    on:dragleave={onDragLeave}
    on:drop|preventDefault={onDrop}
    on:dragend={onDragEnd}
    on:dragover|preventDefault
>
    {@render children()}
</div>
