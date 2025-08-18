<script lang="ts">
    import type { DropdownItem } from "libbearo";
    import Dropdown from "./Dropdown.svelte";

    interface Props {
        label: string;
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
        label,
        items,
        selected_items,
        placeholder,
        no_items_message,
        is_open,
        on_toggle: on_toggle,
        on_close: on_close,
        on_toggle_item,
        on_deselect_item,
    }: Props = $props();
</script>

<div class="multi-select">
    <p>{label}</p>
    <Dropdown
        {items}
        {selected_items}
        {placeholder}
        {no_items_message}
        {is_open}
        {on_toggle}
        {on_close}
        {on_toggle_item}
        {on_deselect_item}
    />
</div>
