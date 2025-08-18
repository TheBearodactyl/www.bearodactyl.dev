<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import MenuIcon from "../components/icons/MenuIcon.svelte";
    import { _ } from "svelte-i18n";
    import { show_discouragement } from "$lib/stores/discouragement";
    import LangSwitcher from "../components/misc/LangSwitcher.svelte";
    import { show_quick_menu } from "$lib/stores/show_quick_menu";
    import "../assets/css/main.css";
    import { get_menu_routes } from "libbearo";

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

    const routes = get_menu_routes();

    const { children } = $props();

    let selectedTheme = $state("kanagawa");
    let isMenuOpen = $state(false);
    let isRoutesMenuOpen = $state(false);
    let hoveredRoute = $state<string | null>(null);
    let nestedMenuTimeouts = new Map<string, number>();

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
        return page.url.pathname === path || page.url.pathname.startsWith(path + "/");
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

{#if !$show_discouragement && $show_quick_menu}
    <div class="quick-buttons">
        <div
            class="menu-items"
            class:open={isMenuOpen}
        >
            <div class="routes-menu-container">
                <button
                    class="routes-menu-button"
                    aria-label={$_("misc.quick-menu.nav-to-page")}
                    title={$_("descriptions.routes-menu")}
                    onclick={toggleRoutesMenu}
                >
                    {$_("misc.quick-menu.routes")}
                </button>

                <div
                    class="routes-dropdown"
                    class:open={isRoutesMenuOpen}
                >
                    {#each routes as route, index}
                        <div class="route-wrapper">
                            <button
                                class="route-item"
                                class:current={isCurrentRoute(route.path)}
                                class:has-children={route.children}
                                style="animation-delay: {index * 0.05}s"
                                onclick={() => {
                                    window.location.href = route.path;
                                }}
                                onmouseenter={() => route.children && handleRouteHover(route.path)}
                                onmouseleave={() => route.children && handleRouteLeave(route.path)}
                            >
                                {$_(route.nameKey)}
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
                                            {$_(childRoute.nameKey)}
                                        </button>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
            <div class="theme-switcher">
                <select
                    id="theme-select"
                    bind:value={selectedTheme}
                    onchange={changeTheme}
                >
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
            aria-label={$_("misc.quick-menu.toggle-menu")}
            title={$_("misc.quick-menu.toggle-menu")}
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
