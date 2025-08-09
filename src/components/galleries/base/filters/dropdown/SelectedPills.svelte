<script lang="ts">
    interface Props {
        selected_items: string[];
        placeholder: string;
        on_deselect_item?: (itemValue: string) => void;
    }

    let {
        selected_items,
        placeholder,
        on_deselect_item,
    }: Props = $props();

    const handle_deselect_pill = (
        event: MouseEvent,
        item_val: string,
    ) => {
        event.stopPropagation();
        on_deselect_item?.(item_val);
    };
</script>

{#if selected_items.length === 0}
    <span class="placeholder">{placeholder}</span>
{:else}
    <div class="selected-pills">
        {#each selected_items as itemValue}
            <span class="pill">
                {itemValue}
                <button
                    class="pill-deselect-btn"
                    onmousedown={(event) =>
                        handle_deselect_pill(
                            event,
                            itemValue,
                        )}
                >
                    ⨯
                </button>
            </span>
        {/each}
    </div>
{/if}
