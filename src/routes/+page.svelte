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
            name: "read-watch",
            coverImage: "/images/hobo.gif",
            route: "/lists/read-watch",
        },
        {
            name: "projects",
            coverImage: "/images/family-guy-css.gif",
            route: "/lists/projects",
        },
        {
            name: "website-src",
            coverImage: "/videos/hackermans.webm",
            route: "https://github.com/thebearodactyl/www.bearodactyl.dev",
        },
        {
            name: "games",
            coverImage: "/videos/gamer.webm",
            route: "/lists/games",
        },
        {
            name: "bearodactyl",
            coverImage: "/images/bearo.gif",
            route: "/jokes/bearo",
        },
        // {
        //   title: "Emergency frog!",
        //   description: "Emergency Frog Situation!!!!",
        //   coverImage: "https://pbs.twimg.com/media/DIQFluYUwAEm6AH.jpg",
        //   route: "/jokes/aaaaa",
        // },
        {
            name: "woah",
            coverImage: "/images/wulzy.gif",
            route: "/jokes/woah",
        },
        {
            name: "one-piece",
            coverImage: "/images/op.gif",
            route: "/lists/one-piece",
        },
        {
            name: "license",
            coverImage: "/images/morshu.gif",
            route: "/license",
        },
        {
            name: "domains",
            coverImage: "/images/domain-expansion.gif",
            route: "/lists/domains",
        },
        {
            coverImage: "/images/mlg.gif",
            route: "",
            discouraged: true
        },
        {
            coverImage: "https://media.istockphoto.com/id/1298255522/photo/funny-african-man-posing-pointing-fingers-at-camera-yellow-background.jpg?s=612x612&w=0&k=20&c=1dcyemROSTy_V05a8ELTZA5HLCNSSwO4qwkdP2Dj4sU=",
            route: "",
        },
        {
            coverImage: "https://archive.org/download/Chinese_Assassin_-_Dont_Mess_With_My_Dawgs_Mix_CD_-_PHZ/00cover.jpg",
            route: ""
        },
        {
            coverImage: "https://media.tenor.com/yWEFfnbrffIAAAAM/america-cancel-america.gif",
            route: ""
        },
        {
            coverImage: "https://media.tenor.com/1q2EtzejgWUAAAAM/sakugastudio-jxrdn-absolute-cinema-luffy.gif",
            route: "",
        },
        {
            coverImage: "https://i.ytimg.com/vi/mgM1-V2Yw5Q/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDJ0iNd3eKgCWMZuHCKysyhsIajlQ",
            route: "",
        },
        {
            coverImage: "https://i.ytimg.com/vi/yK1JRtoBY3Y/maxresdefault.jpg",
            route: ""
        }
    ];
</script>

<Seo
    title="The Motherfucking Home Page"
    desc="the main page of `bearodactyl.dev`"
    image="https://s3.amazonaws.com/theoatmeal-img/comics/ptero/bearodactyl.png"
    url="https://bearodactyl.dev"
/>

{#if !$show_discouragement}
    <div>
        <div class="index-header">
            <h1>{$_("titles.index")}</h1>
            <p class="index-desc">{$_("descriptions.index")}</p>
            <img class="buggy" src="/images/buggy.webp" alt="get it? 'buggy'?" />
        </div>
    </div>

    <NavigationGallery navItems={navigationItems} />

    <div class="index-footer">
        <pre>
{$_("paragraphs.home-page-footer.line-one")}
{$_("paragraphs.home-page-footer.line-two")}
{$_("paragraphs.home-page-footer.line-three")}<code
                ><a href="/license" class="license-hyper">/license</a></code
            >
{$_("paragraphs.home-page-footer.line-four")}
    </pre>
    </div>
{:else}
    <Discouragement
        path="/images/deathtoamerica.gif"
        vhsPreset={true}
        onLoaded={async () => {
            const discouragement_songs = ["/audio/hell.mp3", "/audio/eek.mp3"];

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
