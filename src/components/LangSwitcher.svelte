<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { locale, loadLocale, availableLocales } from "$lib/i18n";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    let selectedLocale = $state(get(locale));
    let isLoading = $state(false);

    onMount(() => {
        selectedLocale = $locale || "en";
    });

    const handleLocaleChange = async (newLocale: string) => {
        if (newLocale === $locale || isLoading) return;

        isLoading = true;

        try {
            await loadLocale(newLocale);
            selectedLocale = newLocale;
            localStorage.setItem("selected-locale", newLocale);

            // const currentPath = get(page).url.pathname + get(page).url.search;
            // await goto(currentPath, { invalidateAll: true });
        } catch (error) {
            console.error("Failed to load locale:", error);
            selectedLocale = $locale;
        } finally {
            isLoading = false;
        }
    };

    let sellocale = $derived(locale);
    selectedLocale = $sellocale
</script>

<div class="locale-switcher">
    <select
        bind:value={selectedLocale}
        onchange={(e) => handleLocaleChange(e.currentTarget.value)}
        disabled={isLoading}
        aria-label="Select language"
    >
        {#each availableLocales as loc}
            <option value={loc}>
                {#if loc === "en"}
                    English
                {:else if loc === "jp"}
                    日本語
                {:else}
                    {loc.toUpperCase()}
                {/if}
            </option>
        {/each}
    </select>

    {#if isLoading}
        <span class="loading-indicator" aria-hidden="true">⟳</span>
    {/if}
</div>

<style>
    .locale-switcher {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    select:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .loading-indicator {
        animation: spin 1s linear infinite;
        font-size: 1rem;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
