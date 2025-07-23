<template>
  <div class="locale-switcher">
    <select v-model="currentLocale" @change="setLocale">
      <option
        v-for="localeVal in availableLocales"
        :key="`locale-${localeVal}`"
        :value="localeVal"
      >
        {{ localeVal }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"

const { locale, availableLocales } = useI18n()

const currentLocale = ref(locale.value)

const setLocale = () => {
  locale.value = currentLocale.value
}

watch(locale, (newLocale) => {
  currentLocale.value = newLocale
})
</script>

<style scoped>
.locale-switcher select {
  appearance: none;
  background-color: var(--rp-surface);
  color: var(--rp-text);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.locale-switcher select:hover {
  background-color: var(--rp-highlight-low);
}

.locale-switcher select:focus {
  outline: none;
  border-color: var(--rp-pine);
  box-shadow: 0 0 0 2px rgba(126, 156, 216, 0.2);
}

.locale-switcher select:active {
  background-color: var(--rp-highlight-med);
}

.locale-switcher::after {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: var(--rp-subtle);
  pointer-events: none;
  font-size: 12px;
}

.locale-switcher select option {
  background-color: var(--rp-surface);
  color: var(--rp-text);
}

.locale-switcher select option:hover,
.locale-switcher select option:checked {
  background-color: var(--rp-highlight-med);
  color: var(--rp-foam);
}

.locale-switcher select option {
  background-color: var(--rp-surface);
  color: var(--rp-text);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  border: none;
  cursor: pointer;
}

.locale-switcher select option:hover {
  background-color: var(--rp-highlight-med);
  color: var(--rp-foam);
}

.locale-switcher select option:checked,
.locale-switcher select option:selected {
  background-color: var(--rp-pine);
  color: var(--rp-base);
  font-weight: 500;
}

.locale-switcher select option:focus {
  background-color: var(--rp-highlight-high);
  color: var(--rp-text);
  outline: none;
}

/* Alternative styling for better browser support */
.locale-switcher select option:disabled {
  background-color: var(--rp-highlight-low);
  color: var(--rp-muted);
  cursor: not-allowed;
}

/* Webkit specific styling for dropdown */
.locale-switcher select::-webkit-scrollbar {
  width: 8px;
}

.locale-switcher select::-webkit-scrollbar-track {
  background: var(--rp-surface);
}

.locale-switcher select::-webkit-scrollbar-thumb {
  background: var(--rp-muted);
  border-radius: 4px;
}

.locale-switcher select::-webkit-scrollbar-thumb:hover {
  background: var(--rp-subtle);
}
</style>
