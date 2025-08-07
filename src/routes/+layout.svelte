<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { derived } from "svelte/store";
    import LangSwitcher from "../components/LangSwitcher.svelte";
    import MenuIcon from "../components/icons/MenuIcon.svelte";
    import type { RouteItem } from "$lib/types";
    import { _ } from "svelte-i18n";
    import { show_discouragement } from "$lib/stores/discouragement";

    const themes = [
        "kanagawa",
        "rose-pine",
        "rose-pine-moon",
        "rose-pine-dawn",
        "catppuccin-mocha",
        "catppuccin-macchiato",
        "catppuccin-frappe",
        "catppuccin-latte",
        "gruvbox-dark",
        "gruvbox-light",
        "nord",
        "alduin",
        "angr",
        "ayu",
        "carbonized",
        "gotham",
        "iceberg",
        "papercolor",
        "jellybeans",
        "materialbox",
        "onedark",
        "pink-moon",
        "tokyo-night",
    ];

    const routes: RouteItem[] = [
        { path: "/", name: $_("routes-data.home-title") },
        {
            path: "/lists",
            name: $_("routes-data.lists-title"),
            children: [
                { path: "/lists/games", name: $_("routes-data.lists.games.title") },
                { path: "/lists/read-watch", name: $_("routes-data.lists.read-watch.title") },
                { path: "/lists/projects", name: $_("routes-data.lists.projects.title") },
                { path: "/lists/one-piece", name: $_("routes-data.lists.one-piece.title-short") },
                { path: "/lists/domains", name: $_("routes-data.lists.domains.title") },
            ],
        },
        {
            path: "/jokes",
            name: $_("routes-data.joke-pages-title"),
            children: [
                { path: "/jokes/bearo", name: $_("routes-data.misc.bearodactyl.title") },
                { path: "/jokes/woah", name: $_("routes-data.misc.woah.title") },
            ],
        },
        {
            path: "/license",
            name: $_("routes-data.misc.license.title"),
        },
        {
            path: "https://github.com/thebearodactyl/www.bearodactyl.dev",
            name: $_("routes-data.misc.website-src.title-short"),
        },
    ];

    const { children } = $props();

    let selectedTheme = $state("kanagawa");
    let isMenuOpen = $state(false);
    let isRoutesMenuOpen = $state(false);
    let hoveredRoute = $state<string | null>(null);
    let nestedMenuTimeouts = new Map<string, number>();

    const currentRoutePath = derived(page, ($page) => $page.url.pathname);

    function changeTheme() {
        document.documentElement.setAttribute("data-theme", selectedTheme);
        localStorage.setItem("theme", selectedTheme);
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function toggleRoutesMenu() {
        isRoutesMenuOpen = !isRoutesMenuOpen;
        if (!isRoutesMenuOpen) {
            hoveredRoute = null;
        }
    }

    async function navigateToRoute(path: string) {
        isRoutesMenuOpen = false;
        isMenuOpen = false;
        hoveredRoute = null;

        if (path.includes("http")) {
            window.open(path, "_blank");
        } else {
            await goto(path);
        }
    }

    function handleRouteHover(routePath: string) {
        const existingTimeout = nestedMenuTimeouts.get(routePath);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        hoveredRoute = routePath;
    }

    function handleRouteLeave(routePath: string) {
        const timeout = setTimeout(() => {
            if (hoveredRoute === routePath) {
                hoveredRoute = null;
            }
        }, 200);

        nestedMenuTimeouts.set(routePath, timeout);
    }

    function handleNestedMenuHover(routePath: string) {
        const existingTimeout = nestedMenuTimeouts.get(routePath);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }
        hoveredRoute = routePath;
    }

    function isCurrentRoute(path: string): boolean {
        return $currentRoutePath === path || $currentRoutePath.startsWith(path + "/");
    }

    onMount(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            selectedTheme = storedTheme;
            document.documentElement.setAttribute("data-theme", storedTheme);
        }

        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Element;
            if (!target.closest(".quick-buttons")) {
                isRoutesMenuOpen = false;
                hoveredRoute = null;
            }
        }

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
            nestedMenuTimeouts.forEach((timeout) => clearTimeout(timeout));
        };
    });
</script>

{#if !$show_discouragement}
    <div class="quick-buttons">
        <div class="menu-items" class:open={isMenuOpen}>
            <div class="routes-menu-container">
                <button
                    class="routes-menu-button"
                    aria-label={$_("quick-menu.nav-to-page")}
                    title={$_("quick-menu.nav-to-page")}
                    onclick={toggleRoutesMenu}
                >
                    {$_("quick-menu.routes")}
                </button>

                <div class="routes-dropdown" class:open={isRoutesMenuOpen}>
                    {#each routes as route, index}
                        <div class="route-wrapper">
                            <button
                                class="route-item"
                                class:current={isCurrentRoute(route.path)}
                                class:has-children={route.children}
                                style="animation-delay: {index * 0.05}s"
                                onclick={() => {
                                    if (route.children?.length === 0 || route.path === "/") {
                                        navigateToRoute(route.path);
                                    } else if (route.path.includes("github")) {
                                        window.open(route.path, "_blank");
                                    }
                                }}
                                onmouseenter={() => route.children && handleRouteHover(route.path)}
                                onmouseleave={() => route.children && handleRouteLeave(route.path)}
                            >
                                {route.name}
                                {#if route.children}
                                    <span class="arrow">›</span>
                                {/if}
                            </button>

                            {#if route.children && hoveredRoute === route.path}
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div
                                    class="nested-menu"
                                    onmouseenter={() => handleNestedMenuHover(route.path)}
                                    onmouseleave={() => handleRouteLeave(route.path)}
                                >
                                    {#each route.children as childRoute, childIndex}
                                        <button
                                            class="nested-route-item"
                                            class:current={isCurrentRoute(childRoute.path)}
                                            style="animation-delay: {childIndex * 0.03}s"
                                            onclick={() => {
                                                navigateToRoute(childRoute.path);
                                            }}
                                        >
                                            {childRoute.name}
                                        </button>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
            <div class="theme-switcher">
                <select id="theme-select" bind:value={selectedTheme} onchange={changeTheme}>
                    {#each themes as theme}
                        <option value={theme}>{theme.replace(/-/g, " ")}</option>
                    {/each}
                </select>
            </div>

            <div class="lang-switcher-aligned">
                <LangSwitcher />
            </div>
        </div>

        <button
            class="menu-toggle"
            class:active={isMenuOpen}
            aria-label={$_("quick-menu.toggle-menu")}
            onclick={toggleMenu}
        >
            <MenuIcon />
        </button>
    </div>
{/if}

{@render children?.()}

<!-- svelte-ignore css_unused_selector -->
<style>
    @import url("/src/assets/css/main.css");
</style>
