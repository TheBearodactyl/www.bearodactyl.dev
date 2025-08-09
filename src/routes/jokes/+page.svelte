<script lang="ts">
    import { _ } from "svelte-i18n";
    import NavigationGallery from "../../components/galleries/NavigationGallery.svelte";
    import type { NavItem } from "$lib/types";

    const navigationItems: NavItem[] = [
        {
            route: "/jokes/woah",
            name: "woah",
            coverImage: "/images/wulzy.gif",
        },
        {
            route: "/jokes/bearo",
            name: "bearodactyl",
            coverImage: "/images/bearo.gif",
        },
    ];
</script>

<div>
    <div class="index-header">
        <h1>{$_("titles.jokes")}</h1>
    </div>
</div>

<NavigationGallery
    navItems={navigationItems}
    num_cols={2}
    shuffleItems={false}
/>

<div class="index-footer">
    <pre>
{$_("paragraphs.home-page-footer.line-one")}
{$_("paragraphs.home-page-footer.line-two")}
{$_("paragraphs.home-page-footer.line-three")}<code
            ><a
                href="/license"
                class="license-hyper">/license</a
            ></code
        >
{$_("paragraphs.home-page-footer.line-four")}
    </pre>
</div>