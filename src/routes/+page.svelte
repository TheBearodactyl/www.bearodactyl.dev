<script lang="ts">
    import type { NavItem } from "$lib/types";
    import NavigationGallery from "../components/NavigationGallery.svelte";
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import Seo from "../components/SEO.svelte";
    import { show_discouragement } from "$lib/stores/discouragement";
    import Discouragement from "../components/Discouragement.svelte";
    import { chooseRandom } from "$lib/utils/misc";

    let isMobile = false;

    onMount(() => {
        if (typeof window !== "undefined") {
            const mediaQuery = window.matchMedia("(max-width: 768px)"); // Example breakpoint
            isMobile = mediaQuery.matches;

            mediaQuery.addEventListener("change", (e) => {
                isMobile = e.matches;
            });
        }
    });

    const navigationItems: NavItem[] = [
        {
            title: "routes-data.lists.read-watch.title",
            description: "routes-data.lists.read-watch.desc",
            coverImage: "/images/hobo.gif",
            route: "/lists/read-watch"
        },
        {
            title: "routes-data.lists.projects.title",
            description: "routes-data.lists.projects.desc",
            coverImage: "/images/family-guy-css.gif",
            route: "/lists/projects"
        },
        {
            title: "routes-data.misc.website-src.title",
            description: "routes-data.misc.website-src.desc",
            coverImage: "/videos/hackermans.webm",
            route: "https://github.com/thebearodactyl/www.bearodactyl.dev"
        },
        {
            title: "routes-data.lists.games.title",
            description: "routes-data.lists.games.desc",
            coverImage: "/videos/gamer.webm",
            route: "/lists/games"
        },
        {
            title: "routes-data.misc.bearodactyl.title",
            description: "routes-data.misc.bearodactyl.desc",
            coverImage: "/images/bearo.gif",
            route: "/jokes/bearo"
        },
        // {
        //   title: "Emergency frog!",
        //   description: "Emergency Frog Situation!!!!",
        //   coverImage: "https://pbs.twimg.com/media/DIQFluYUwAEm6AH.jpg",
        //   route: "/jokes/aaaaa",
        // },
        {
            title: "routes-data.misc.woah.title",
            description: "routes-data.misc.woah.desc",
            coverImage: "/images/wulzy.gif",
            route: "/jokes/woah"
        },
        {
            title: "routes-data.lists.one-piece.title",
            description: "routes-data.lists.one-piece.desc",
            coverImage: "/images/op.gif",
            route: "/lists/one-piece"
        },
        {
            title: "routes-data.misc.license.title",
            description: "routes-data.misc.license.desc",
            coverImage: "/images/morshu.gif",
            route: "/license"
        },
        {
            title: "routes-data.lists.domains.title",
            description: "routes-data.lists.domains.desc",
            coverImage: "/images/domain-expansion.gif",
            route: "/lists/domains"
        },
        {
            coverImage: "/images/mlg.gif",
            route: ""
        },
    ];
</script>

<Seo title="The Motherfucking Home Page" desc="the main page of `bearodactyl.dev`" image="https://s3.amazonaws.com/theoatmeal-img/comics/ptero/bearodactyl.png" url="https://bearodactyl.dev" />

{#if !$show_discouragement}
    <div>
        <div class="index-header">
            <h1>{$_("index.title")}</h1>
            <p class="index-desc">{$_("index.desc")}</p>
            <img class="buggy" src="/images/buggy.webp" alt="get it? 'buggy'?" />
        </div>
    </div>

    <NavigationGallery navItems={navigationItems} />

    <div class="index-footer">
        <pre>
{$_("index.footer-lines.line-one")}
{$_("index.footer-lines.line-two")}
{$_("index.footer-lines.line-three")}<code><a href="/license" class="license-hyper">/license</a></code>
{$_("index.footer-lines.line-four")}
    </pre>
    </div>
{:else}
    <Discouragement
        path="/images/deathtoamerica.gif"
        vhsPreset={true}
        onLoaded={async () => {
            const discouragement_songs = [
                "/audio/hell.mp3",
                "/audio/eek.mp3"
            ];

            let audio = new Audio(chooseRandom(discouragement_songs));
            show_discouragement.set(true);
            audio.loop = true;
            await audio.play();
        }}
    />
{/if}

<!-- svelte-ignore css_unused_selector -->
<style>
    @import url("/src/assets/css/main.css");
</style>
