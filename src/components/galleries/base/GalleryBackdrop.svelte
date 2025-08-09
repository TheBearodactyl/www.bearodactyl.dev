<script lang="ts">
    interface Props {
        show: boolean;
        on_click?: () => void;
    }

    const { show, on_click }: Props = $props();

    const handle_click = () => {
        on_click?.();
    };
</script>

{#if show}
    <div
        class="backdrop"
        class:show
        onmousedown={handle_click}
        role="button"
        tabindex="0"
    ></div>
{/if}
