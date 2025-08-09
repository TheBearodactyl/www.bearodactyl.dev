<script lang="ts">
    import { browser } from "$app/environment";
    import { locale, loadLocale, availableLocales } from "$lib/i18n";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    let selected_locale = $state(get(locale));
    let is_loading = $state(false);

    onMount(() => {
        selected_locale = $locale || "en";
    });

    const handle_locale_change = async (newLocale: string) => {
        if (newLocale === $locale || is_loading) return;

        is_loading = true;

        try {
            await loadLocale(newLocale);
            selected_locale = newLocale;
            localStorage.setItem("selected-locale", newLocale);

            if (browser) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to load locale:", error);
            selected_locale = $locale;
        } finally {
            is_loading = false;
        }
    };

    let new_locale = $derived(locale);
    selected_locale = $new_locale;

    if ($new_locale?.startsWith("ar")) {
        if (browser) {
            document.documentElement.dir = "rtl";
        } else {
            document.documentElement.dir = "ltr";
        }
    }
</script>

<div class="locale-switcher">
    <select
        bind:value={selected_locale}
        onchange={(e) => handle_locale_change(e.currentTarget.value)}
        disabled={is_loading}
        aria-label="Select language"
    >
        {#each availableLocales as loc}
            <option value={loc}>
                {#if loc === "en"}
                    English
                {:else if loc === "jp"}
                    日本語
                {:else if loc === "ar"}
                    عربي
                {:else if loc === "ptbr"}
                    Português - Brasil
                {:else}
                    {loc.toUpperCase()}
                {/if}
            </option>
        {/each}
    </select>

    {#if is_loading}
        <span
            class="loading-indicator"
            aria-hidden="true">⟳</span
        >
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
