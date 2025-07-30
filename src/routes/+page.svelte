<script lang="ts">
    import type { NavItem } from "$lib/types";
    import NavigationGallery from "../components/NavigationGallery.svelte";
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import { error } from "@sveltejs/kit";
    import Seo from "../components/SEO.svelte";

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
            coverImage: "/images/hobo.webp",
            route: "/lists/read-watch"
        },
        {
            title: "Projects",
            description: "stuff i've made/am making",
            coverImage: "https://art.pixilart.com/3e584658c53335d.png",
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
            coverImage: "/images/bearodactyl_painting.webp",
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
            coverImage: "/images/wulzy.webp",
            route: "/jokes/woah"
        },
        {
            title: "One Piece",
            description: "my reviews of OP chapters (HIGHLY WIP)",
            coverImage: "/images/op.webp",
            route: "/lists/one-piece"
        },
        {
            title: "My License",
            description: "My custom license that I use for all my code",
            coverImage: "/videos/deathtoamerica.webm",
            route: "/license"
        }
    ];

    const desc = $_("index.desc");
</script>

<Seo
    title="The Motherfucking Home Page"
    desc="the main page of `bearodactyl.dev`"
    image="https://s3.amazonaws.com/theoatmeal-img/comics/ptero/bearodactyl.png"
    url="https://bearodactyl.dev"
/>

<div>
    <div class="index-header">
        <h1>{$_("index.title")}</h1>
        {#if isMobile}
            <p class="index-desc">
                {desc.substring(0, desc.length / 2 + 1)}
            </p>
            <p>
                {desc.substring((desc.length + 2) / 2)}
            </p>
        {:else}
            <p class="index-desc">{desc}</p>
        {/if}
        <img class="buggy" src="/images/buggy.webp" alt="get it? 'buggy'?" />
    </div>
</div>

<NavigationGallery navItems={navigationItems} />

<div class="index-footer">
    <pre>
        All icons made by me in Inkscape
        All code on this website is within the public domain
        See <code><a href="/license" class="license-hyper">/license</a></code>
        Rabies before babies
    </pre>
</div>

<style>
    @import url("/src/assets/css/bookgallery.css");

    .index-header {
        text-align: center;
        margin-bottom: 3.5rem;
        margin-top: 3.5rem;
        font-size: 1.5rem;
        color: var(--rp-iris);
        font-weight: 800;
        letter-spacing: -0.05em;
        word-spacing: -0.1em;
        text-shadow:
            0 0 20px rgba(196, 167, 231, 0.3),
            0 0 40px rgba(196, 167, 231, 0.1);
        line-height: 1.1;
        background: linear-gradient(90deg, var(--rp-iris) 0%, var(--rp-foam) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: fadeInDown 1s var(--transition-ease) forwards;
        opacity: 1;
    }

    .index-footer {
        margin-top: 1rem;
        margin-bottom: 1rem;
        text-align: center;
        color: var(--rp-text);
    }

    .buggy {
        width: 300px;
        height: 168px;
        margin-bottom: -3.9rem;
        filter: contrast(95);
    }

    .license-hyper {
        color: aqua;
    }
</style>
