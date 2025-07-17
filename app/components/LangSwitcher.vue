<template>
  <div class="locale-switcher">
    <select v-model="selectedLocale" @change="switchLocale" class="custom-dropdown">
      <option v-for="locale in locales" :key="locale.code" :value="locale.code">
        {{ locale.name }}
      </option>
    </select>
  </div>

</template>

<script lang="ts" setup>
import { useI18n } from "#imports";
import { ref } from "vue";

const { locales, locale, setLocale } = useI18n();
const selectedLocale = ref(locale.value);

function switchLocale() {
  setLocale(selectedLocale.value);
}
</script>