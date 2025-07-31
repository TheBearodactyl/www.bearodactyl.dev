<script lang="ts">
    interface DropdownItem {
        value: string;
        count?: number;
    }

    interface Props {
        label: string;
        items: DropdownItem[];
        selectedItems: string[];
        placeholder: string;
        noItemsMessage: string;
        isOpen: boolean;
        ontoggle?: () => void;
        onclose?: () => void;
        "ontoggle-item"?: (itemValue: string) => void;
        "on-deselect-item"?: (itemValue: string) => void;
    }

    let {
        label,
        items,
        selectedItems,
        placeholder,
        noItemsMessage,
        isOpen,
        ontoggle,
        onclose,
        "ontoggle-item": onToggleItem,
        "on-deselect-item": onDeselectItem
    }: Props = $props();

    let dropdownRef: HTMLDivElement;

    const handleToggle = () => {
        ontoggle?.();
    };

    const handleClose = () => {
        onclose?.();
    };

    const handleItemToggle = (itemValue: string) => {
        onToggleItem?.(itemValue);
    };

    const handleClick = (event: MouseEvent) => {
        event.stopPropagation();
        handleToggle();
    };

    const handleItemClick = (event: MouseEvent, itemValue: string) => {
        event.stopPropagation();
        handleItemToggle(itemValue);
    };

    const handleDeselectPill = (event: MouseEvent, itemValue: string) => {
        event.stopPropagation();
        onDeselectItem?.(itemValue);
    };
</script>

<div bind:this={dropdownRef} class="multi-select">
    <p>{label}</p>
    <div
        class="dropdown"
        class:open={isOpen}
        tabindex="0"
        onmousedown={handleClick}
        onblur={handleClose}
        role="button"
    >
        <div class="dropdown-selected">
            {#if selectedItems.length === 0}
                <span class="placeholder">{placeholder}</span>
            {:else}
                <div class="selected-pills">
                    {#each selectedItems as itemValue}
                        <span class="pill">
                            {itemValue}
                            <button
                                class="pill-deselect-btn"
                                onmousedown={(event) => handleDeselectPill(event, itemValue)}
                            >
                                ⨯
                            </button>
                        </span>
                    {/each}
                </div>
            {/if}
            <span class="dropdown-arrow">▾</span>
        </div>
        {#if isOpen}
            <ul class="dropdown-list">
                {#each items as item (item.value)}
                    <li class:selected={selectedItems.includes(item.value)}>
                        <button
                            type="button"
                            class="dropdown-item-button"
                            onclick={(event) => handleItemClick(event, item.value)}
                        >
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.value)}
                                readonly
                                tabindex="-1"
                            />
                            {item.value}
                            {#if item.count}
                                <span class="tag-count">{item.count}</span>
                            {/if}
                        </button>
                    </li>
                {/each}
                {#if items.length === 0 && selectedItems.length === 0}
                    <li class="no-tags">
                        {noItemsMessage}
                    </li>
                {/if}
            </ul>
        {/if}
    </div>
</div>