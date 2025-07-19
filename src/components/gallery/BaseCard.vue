<template>
  <div class="book-card" :class="{ 'expanded': expanded, 'list-view': viewMode === 'list', ...cardClasses }"
    :style="{ 'animation-delay': `${index * 0.1}s` }" @click="emitToggle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  index: {
    type: Number,
    required: true
  },
  expanded: Boolean,
  viewMode: String,
  cardClasses: Object
});

const emit = defineEmits(['toggle']);

const emitToggle = () => {
  emit('toggle');
};
</script>
