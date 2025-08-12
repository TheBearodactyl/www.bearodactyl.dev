<script lang="ts">
    import { _ } from "svelte-i18n";
    import NavigationGallery from "../../components/galleries/NavigationGallery.svelte";
    import type { NavItem } from "$lib/types";

    const navigationItems: NavItem[] = [
        {
            route: "/lists/one-piece",
            name: "one-piece",
            coverImage: "/images/op.gif",
        },
        {
            route: "/lists/read-watch",
            name: "read-watch",
            coverImage: "/images/hobo.gif",
        },
        {
            route: "/lists/domains",
            name: "domains",
            coverImage: "/images/domain-expansion.gif",
        },
        {
            route: "/lists/games",
            name: "games",
            coverImage: "/images/gamer.gif",
        },
        {
            route: "/lists/projects",
            name: "projects",
            coverImage: "/images/family-guy-css.gif",
        },
        {
            route: "/lists/wplace-findings",
            name: "wplace",
            coverImage: "https://files.catbox.moe/87q1sc.png"
        }
    ];
</script>

<div>
    <div class="index-header">
        <h1>{$_("titles.lists")}</h1>
    </div>
</div>

<NavigationGallery
    navItems={navigationItems}
    num_cols={3}
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