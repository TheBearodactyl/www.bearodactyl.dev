<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { derived } from "svelte/store";
    import LangSwitcher from "../components/LangSwitcher.svelte";
    import HomeIcon from "../components/icons/HomeIcon.svelte";
    import MenuIcon from "../components/icons/MenuIcon.svelte";
    import type { RouteItem } from "$lib/types";

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
        "tokyo-night"
    ];

    const routes: RouteItem[] = [
        { path: "/", name: "Home" },
        {
            path: "/lists",
            name: "Lists",
            children: [
                { path: "/lists/games", name: "Games" },
                { path: "/lists/read-watch", name: "Read/Watch List" },
                { path: "/lists/projects", name: "Projects" },
                { path: "/lists/one-piece", name: "OP Reviews" }
            ]
        },
        {
            path: "/jokes",
            name: "Joke Pages",
            children: [
                { path: "/jokes/bearo", name: "The MF Bearodactyl" },
                { path: "/jokes/woah", name: "Woah" }
            ]
        },
        {
            path: "/license",
            name: "My License"
        }
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
        await goto(path);
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

<div class="quick-buttons">
    <div class="menu-items" class:open={isMenuOpen}>
        <div class="routes-menu-container">
            <button
                class="routes-menu-button"
                aria-label="Navigate to page"
                title="Navigate to page"
                onclick={toggleRoutesMenu}
            >
                routes
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
                                if (route.children?.length === 0) {
                                    navigateToRoute(route.path);
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
        aria-label="Toggle menu"
        onclick={toggleMenu}
    >
        <MenuIcon />
    </button>
</div>

{@render children?.()}

<!-- svelte-ignore css_unused_selector -->
<style>
    @import url("/src/assets/css/layout.css");
</style>
