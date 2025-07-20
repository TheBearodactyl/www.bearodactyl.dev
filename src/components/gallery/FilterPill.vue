<template>
  <div class="filter-pill">
    <input class="pill-search-input" :placeholder="$t('gallery.filters.search')" :value="props.modelValue"
      @input="onInput" @keydown.right="emitToggleSearchMode" />
    <button class="pill-filter-btn" @click="emitToggleSearchMode">
      <span class="icon">☰</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'toggle-search-mode'): void;
}>();

const emitToggleSearchMode = () => {
  emit('toggle-search-mode');
};

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (target) {
    emit('update:modelValue', target.value);
  }
};
</script>
