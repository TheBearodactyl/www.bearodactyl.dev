<script lang="ts">
    import type { DropdownItem } from "$lib/types";
    import DropdownItemButton from "./DropdownItemButton.svelte";

    interface Props {
        items: DropdownItem[];
        selected_items: string[];
        no_items_message: string;
        on_toggle_item?: (
            item_value: string,
        ) => void;
    }

    let {
        items,
        selected_items,
        no_items_message,
        on_toggle_item,
    }: Props = $props();

    const handleItemClick = (
        event: MouseEvent,
        item_value: string,
    ) => {
        event.stopPropagation();
        on_toggle_item?.(
            item_value,
        );
    };
</script>

<ul class="dropdown-list">
    {#each items as item (item.value)}
        <li
            class:selected={selected_items.includes(
                item.value,
            )}
        >
            <DropdownItemButton
                {item}
                is_selected={selected_items.includes(
                    item.value,
                )}
                on_click={(
                    event,
                ) =>
                    handleItemClick(
                        event,
                        item.value,
                    )}
            />
        </li>
    {/each}

    {#if items.length === 0 && selected_items.length === 0}
        <li class="no-tags">
            {no_items_message}
        </li>
    {/if}
</ul>
