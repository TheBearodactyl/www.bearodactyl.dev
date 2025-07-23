<template>
  <div v-if="show" class="backdrop" :class="{ show: show }" @click="emitClick"></div>
</template>

<script setup lang="ts">
defineProps({
  show: Boolean,
})

const emit = defineEmits(["click"])
const emitClick = () => {
  emit("click")
}
</script>
