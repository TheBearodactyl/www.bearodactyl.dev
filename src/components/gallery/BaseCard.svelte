<script lang="ts">
    interface Props {
        index: number;
        expanded: boolean;
        viewMode: string;
        cardClasses: object;
        children: import("svelte").Snippet;
        ontoggle?: () => void;
        explicit: boolean;
    }

    let { index, expanded, viewMode, cardClasses, children, ontoggle, explicit }: Props = $props();

    const handleToggle = () => {
        ontoggle?.();
    };
</script>

<div
    class="book-card"
    class:expanded
    class:list-view={viewMode === "list"}
    class:cardClasses
    style:animation-delay="{index * 0.1}s"
    class:explicit-content={explicit}
    onmousedown={handleToggle}
    role="button"
    tabindex="0"
>
    {@render children()}
</div>
