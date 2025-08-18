<script lang="ts">
    import type { DropdownItem } from "libbearo";

    interface Props {
        item: DropdownItem;
        is_selected: boolean;
        on_click: (event: MouseEvent) => void;
    }

    let { item, is_selected, on_click }: Props = $props();
</script>

<button
    type="button"
    class="dropdown-item-button"
    onclick={on_click}
>
    <input
        type="checkbox"
        checked={is_selected}
        readonly
        tabindex="-1"
    />
    {item.value}
    {#if item.count}
        <span class="tag-count">{item.count}</span>
    {/if}
</button>
