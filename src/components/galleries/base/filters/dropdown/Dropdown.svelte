<script lang="ts">
    import SelectedPills from "./SelectedPills.svelte";
    import DropdownList from "./DropdownList.svelte";
    import type { DropdownItem } from "$lib/types";

    interface Props {
        items: DropdownItem[];
        selected_items: string[];
        placeholder: string;
        no_items_message: string;
        is_open: boolean;
        on_toggle?: () => void;
        on_close?: () => void;
        on_toggle_item?: (itemValue: string) => void;
        on_deselect_item?: (itemValue: string) => void;
    }

    let {
        items,
        selected_items,
        placeholder,
        no_items_message,
        is_open: isOpen,
        on_toggle: ontoggle,
        on_close: onclose,
        on_toggle_item,
        on_deselect_item,
    }: Props = $props();

    let dropdown_ref: HTMLDivElement;

    const handle_click = (event: MouseEvent) => {
        event.stopPropagation();
        ontoggle?.();
    };

    const handle_close = () => {
        onclose?.();
    };
</script>

<div
    bind:this={dropdown_ref}
    class="dropdown"
    class:open={isOpen}
    tabindex="0"
    onmousedown={handle_click}
    onblur={handle_close}
    role="button"
>
    <div class="dropdown-selected">
        <SelectedPills
            {selected_items}
            {placeholder}
            {on_deselect_item}
        />
        <span class="dropdown-arrow">▾</span>
    </div>

    {#if isOpen}
        <DropdownList
            {items}
            {selected_items}
            {no_items_message}
            {on_toggle_item}
        />
    {/if}
</div>
