<template>
  <div ref="dropdownRef" class="multi-select">
    <label>{{ $t("label", [label]) }}</label>
    <div
      class="dropdown"
      :class="{ open: isOpen }"
      tabindex="0"
      @click.stop="emitToggle"
      @blur="emitClose"
    >
      <div class="dropdown-selected">
        <span v-if="selectedItems.length === 0" class="placeholder">{{
          placeholder
        }}</span>
        <span v-else class="selected-items">{{
          selectedItems.join(", ")
        }}</span>
        <span class="dropdown-arrow">▾</span>
      </div>
      <ul v-if="isOpen" class="dropdown-list">
        <li
          v-for="item in items"
          :key="item.value"
          :class="{ selected: selectedItems.includes(item.value) }"
          @click.stop="emitItemToggle(item.value)"
        >
          <input
            type="checkbox"
            :checked="selectedItems.includes(item.value)"
            readonly
          />
          {{ item.value }}
          <span v-if="item.count" class="tag-count">{{
            $t("item-count", [item.count])
          }}</span>
        </li>
        <li
          v-if="items.length === 0 && selectedItems.length === 0"
          class="no-tags"
        >
          {{ noItemsMessage }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DropdownItem {
  value: string
  count?: number
}

defineProps<{
  label: string
  items: DropdownItem[]
  selectedItems: string[]
  placeholder: string
  noItemsMessage: string
  isOpen: boolean
}>()

const emit = defineEmits(["toggle", "close", "toggle-item"])

const emitToggle = () => {
  emit("toggle")
}
const emitClose = () => {
  emit("close")
}
const emitItemToggle = (itemValue: string) => {
  emit("toggle-item", itemValue)
}
</script>
