<script lang="ts">
    import { locale, availableLocales } from "$lib/i18n";
    import { onMount } from "svelte";

    let selectedLocale = $state(locale);

    onMount(() => {
        const storedLocale = localStorage.getItem("selected-locale");
        if (storedLocale) {
            $selectedLocale = storedLocale;
            $locale = storedLocale;
        }
    });

    $effect(() => {
        if (selectedLocale) {
            localStorage.setItem("selected-locale", $selectedLocale || "en");
            $locale = $selectedLocale;
        }
    });
</script>

<div class="locale-switcher">
    <select bind:value={$selectedLocale}>
        {#each $availableLocales as loc}
            <option value={loc || "en"}>{loc || "en"}</option>
        {/each}
    </select>
</div>

<!-- svelte-ignore css_unused_selector -->
<style>
    @import url("/src/assets/css/main.css");
</style>
