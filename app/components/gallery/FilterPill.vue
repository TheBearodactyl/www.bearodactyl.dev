<template>
    <div class="filter-pill">
        <input class="pill-search-input" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="$t('placeholder.search-title')" @keydown.right="emitToggleSearchMode" />
        <button class="pill-filter-btn" @click="emitToggleSearchMode">
            <span class="icon">☰</span>
        </button>
    </div>
</template>

<script setup>
defineProps(['modelValue']);
defineEmits(['update:modelValue', 'toggle-search-mode']);

const emitToggleSearchMode = () => {
    emit('toggle-search-mode');
};
</script>