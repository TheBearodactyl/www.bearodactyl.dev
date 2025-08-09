<script lang="ts">
    import type { NavItem } from "$lib/types";
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import { show_discouragement } from "$lib/stores/discouragement";
    import Seo from "../components/misc/Seo.svelte";
    import NavigationGallery from "../components/galleries/NavigationGallery.svelte";
    import Discouragement from "../components/misc/Discouragement.svelte";
    import { choose_rand } from "$lib/utils/rand";

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
            discouraged: true,
        },
        {
            coverImage:
                "https://media.istockphoto.com/id/1298255522/photo/funny-african-man-posing-pointing-fingers-at-camera-yellow-background.jpg?s=612x612&w=0&k=20&c=1dcyemROSTy_V05a8ELTZA5HLCNSSwO4qwkdP2Dj4sU=",
            route: "",
        },
        {
            coverImage:
                "https://archive.org/download/Chinese_Assassin_-_Dont_Mess_With_My_Dawgs_Mix_CD_-_PHZ/00cover.jpg",
            route: "",
        },
        {
            coverImage: "https://media.tenor.com/yWEFfnbrffIAAAAM/america-cancel-america.gif",
            route: "",
        },
        {
            coverImage:
                "https://media.tenor.com/1q2EtzejgWUAAAAM/sakugastudio-jxrdn-absolute-cinema-luffy.gif",
            route: "",
        },
        {
            coverImage:
                "https://i.ytimg.com/vi/mgM1-V2Yw5Q/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDJ0iNd3eKgCWMZuHCKysyhsIajlQ",
            route: "",
        },
        {
            coverImage: "https://i.ytimg.com/vi/yK1JRtoBY3Y/maxresdefault.jpg",
            route: "",
            audioSrc: "/audio/scottpilgrim.mp3",
        },
        {
            coverImage:
                "https://preview.redd.it/x3p9iu96h4t61.jpg?auto=webp&s=614dc3f1684512c99037bbda2099d058a4ad84f6",
            route: "",
        },
        {
            coverImage:
                "https://external-preview.redd.it/Q3ugnULDJtEfCySEG0treuKldm_Vb__snkvf5-TyhD4.jpg?width=1080&crop=smart&auto=webp&s=7579fe1c67e632d719a4b5ddbbf748e8c7c9e7af",
            route: "",
        },
        {
            coverImage:
                "https://preview.redd.it/k3lrzdqenioe1.png?width=640&crop=smart&auto=webp&s=176371447cd4401c15cd0d0eb70fbd571e054f63",
            route: "",
        },
        {
            coverImage: "https://comiczombie.net/wp-content/uploads/2021/05/getittogether.jpg",
            route: "",
            audioSrc: "/audio/scottpilgrim.mp3",
        },
        {
            coverImage:
                "https://carnivorouslreviews.wordpress.com/wp-content/uploads/2018/05/images231.jpg",
            route: "",
        },
        {
            coverImage: "https://i.ebayimg.com/images/g/Q6cAAOSwrT1gxlFX/s-l1200.jpg",
            route: "",
        },
        {
            coverImage:
                "https://lastfm.freetls.fastly.net/i/u/ar0/9392d450bc1b42b3847fd84f03c92c11.jpg",
            route: "",
        },
        {
            coverImage: "https://st.cdjapan.co.jp/pictures/l/00/29/AVCA-29411.jpg",
            route: "",
        },
        {
            coverImage:
                "data:image/jpeg;base64,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",
            route: "",
        },
        {
            coverImage: "https://st.cdjapan.co.jp/pictures/l/00/44/AVCA-29490.jpg",
            route: "",
        },
        {
            coverImage: "https://bokuben-anime.com/assets/img/story/02/01.jpg",
            route: ""
        },
        {
            coverImage: "https://m.media-amazon.com/images/I/61ofSsK4fHL._UF894,1000_QL80_.jpg",
            route: ""
        },
        {
            coverImage: "https://w0.peakpx.com/wallpaper/924/111/HD-wallpaper-anime-we-never-learn-asumi-kominami-fumino-furuhashi-mafuyu-kirisu-nariyuki-yuiga-rizu-ogata-uruka-takemoto.jpg",
            route: ""
        },
        {
            coverImage: "https://pbs.twimg.com/media/Gh2LcZnbsAAd1PF?format=jpg&name=small",
            route: ""
        },
        {
            coverImage: "https://pbs.twimg.com/media/GNPOIK3acAELa9p?format=jpg&name=360x360",
            route: ""
        },
        {
            coverImage: "https://api.geode-sdk.org/v1/mods/the_bearodactyl.gay-wave-trail/logo?version=4.2.2",
            route: "https://geode-sdk.org/mods/the_bearodactyl.gay-wave-trail"
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
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <img
                class="buggy"
                src="/images/buggy.webp"
                onclick={() => {
                    const buggy_audio = new Audio("/audio/buggy.mp3");
                    buggy_audio.play();
                    setTimeout(() => {
                        window.location.href =
                            "https://github.com/TheBearodactyl/www.bearodactyl.dev/issues/new/choose";
                    }, 1000);
                }}
                alt="get it? 'buggy'?"
            />
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

            let audio = new Audio(choose_rand(discouragement_songs));
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
