<script lang="ts">
    interface Props {
        show: boolean;
        onClick?: () => void;
    }

    const { show, onClick }: Props = $props();

    const handleClick = () => {
        onClick?.();
    };
</script>

{#if show}
    <div class="backdrop" class:show onmousedown={handleClick} role="button" tabindex="0"></div>
{/if}
