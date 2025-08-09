<script lang="ts">
    interface Props {
        active_view_mode: "masonry" | "list";
        handle_view_mode_change: (mode: "masonry" | "list") => Promise<void>;
    }

    let { active_view_mode, handle_view_mode_change }: Props = $props();
</script>

<div
    class="view-toggle"
    data-active={active_view_mode}
>
    <button
        class="view-btn"
        class:active={active_view_mode === "masonry"}
        onclick={async () => {
            await handle_view_mode_change(
                active_view_mode === "masonry" ? "list" : "masonry",
            );
        }}
    >
        {active_view_mode === "masonry" ? "Grid" : "List"}
        <span class="view-btn-icon"
            >{active_view_mode === "masonry" ? "▦" : "☰"}</span
        >
    </button>
</div>
