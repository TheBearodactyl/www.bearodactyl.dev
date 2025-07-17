<template>
    <div class="multi-select" ref="dropdownRef">
        <label>{{ label }}:</label>
        <div class="dropdown" @click.stop="emitToggle" :class="{ open: isOpen }" tabindex="0" @blur="emitClose">
            <div class="dropdown-selected">
                <span v-if="selectedItems.length === 0" class="placeholder">{{ placeholder }}</span>
                <span v-else class="selected-items">{{ selectedItems.join(", ") }}</span>
                <span class="dropdown-arrow">▾</span>
            </div>
            <ul class="dropdown-list" v-if="isOpen">
                <li v-for="item in items" :key="item.value" :class="{ selected: selectedItems.includes(item.value) }"
                    @click.stop="emitItemToggle(item.value)">
                    <input type="checkbox" :checked="selectedItems.includes(item.value)" readonly />
                    {{ item.value }} <span v-if="item.count" class="tag-count">({{ item.count }})</span>
                </li>
                <li v-if="items.length === 0 && selectedItems.length === 0" class="no-tags">
                    {{ noItemsMessage }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    items: Array,
    selectedItems: Array,
    placeholder: String,
    noItemsMessage: String,
    isOpen: Boolean
});

const emit = defineEmits(['toggle', 'close', 'toggle-item']);

const emitToggle = () => emit('toggle');
const emitClose = () => emit('close');
const emitItemToggle = (itemValue) => emit('toggle-item', itemValue);
</script>