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
            title: "Read/Watch List",
            description: "shit i've read/watched",
            coverImage: "/images/hobo.gif",
            route: "/lists/read-watch"
        },
        {
            title: "Projects",
            description: "stuff i've made/am making",
            coverImage: "/images/mlg.gif",
            route: "/lists/projects"
        },
        {
            title: "Website Source Code",
            description: "a lot of code. waow (6,740 lines to be exact)",
            coverImage: "/videos/hackermans.webm",
            route: "https://github.com/thebearodactyl/bearodactyl.dev"
        },
        {
            title: "Game list",
            description: "Games i play",
            coverImage: "/videos/gamer.webm",
            route: "/lists/games"
        },
        {
            title: "Bearodactyl",
            description: "Bearodactyl",
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
            title: "Woah",
            description: "Woah, it's Wulzy",
            coverImage: "/images/wulzy.gif",
            route: "/jokes/woah"
        },
        {
            title: "One Piece",
            description: "my reviews of OP chapters (HIGHLY WIP)",
            coverImage: "/images/op.gif",
            route: "/lists/one-piece"
        },
        {
            title: "My License",
            description: "My custom license that I use for all my code",
            coverImage: "/images/morshu.gif",
            route: "/license"
        },
        {
            title: "",
            description: "",
            coverImage: "",
            route: ""
        }
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
                // "/audio/turnitoff.mp3",
                "/audio/aids.mp3"
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
