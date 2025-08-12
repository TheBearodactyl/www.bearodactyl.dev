<script lang="ts">
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import { show_discouragement } from "$lib/stores/discouragement";
    import Seo from "../components/misc/Seo.svelte";
    import NavigationGallery from "../components/galleries/NavigationGallery.svelte";
    import Discouragement from "../components/misc/Discouragement.svelte";
    import { choose_rand } from "$lib/utils/rand";
    import { getGalleryRoutes } from "$lib/config/routes";

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

    const navigationItems = getGalleryRoutes();
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
                ><a
                    href="/license"
                    class="license-hyper">/license</a
                ></code
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
