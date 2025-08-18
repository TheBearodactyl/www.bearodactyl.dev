<script lang="ts">
    import { _ } from "svelte-i18n";
    import { onDestroy, onMount } from "svelte";
    import { show_discouragement } from "$lib/stores/discouragement";
    import Seo from "../components/misc/Seo.svelte";
    import NavigationGallery from "../components/galleries/NavigationGallery.svelte";
    import Discouragement from "../components/misc/Discouragement.svelte";
    import { choose_rand } from "$lib/utils/rand";
    import { getGalleryRoutes } from "$lib/config/routes";
    import { get_latest_commit } from "$lib/utils/net";
    import { Bearror, get_build_progress, LogLvl } from "libbearo";

    let is_mobile = $state(false);
    let latest_commit: string | null = $state(null);
    let loading_commit_msg = $state(true);

    onMount(async () => {
        if (typeof window !== "undefined") {
            const media_query = window.matchMedia("(max-width: 768px)");
            is_mobile = media_query.matches;

            media_query.addEventListener("change", (e) => {
                is_mobile = e.matches;
            });
        }

        try {
            latest_commit = await get_latest_commit();
        } catch (err) {
            latest_commit = "error fetching commit";
        } finally {
            loading_commit_msg = false;
        }
    });

    const nav_items = getGalleryRoutes();
    let build_progress = $state("");
    let interval_id: number;

    const mk_progress_str = async () => {
        try {
            const curr_progress = (await get_build_progress()).progress;
            if (curr_progress < 100) {
                build_progress = `Building (${curr_progress}%)`;
            } else {
                build_progress = `Built (${curr_progress}%)`;
            }
        } catch (err) {
            const err_msg = new Bearror(
                LogLvl.ERR,
                `Failed to fetch build progress: ${err}`,
            ).to_string();
            throw new Error(err_msg);
        }
    };

    onMount(async () => {
        await mk_progress_str();
        interval_id = setInterval(await mk_progress_str, 5000);
    });

    onDestroy(() => {
        clearInterval(interval_id);
    });
</script>

<Seo
    title="The Motherfucking Home Page"
    desc="the main page of `bearodactyl.dev`"
    image="https://s3.amazonaws.com/theoatmeal-img/comics/ptero/bearodactyl.png"
    url="https://bearodactyl.dev"
/>

{#if !$show_discouragement}
    <div>
        <!-- svelte-ignore a11y_missing_attribute -->
        <div class="index-header">
            <h1>{$_("titles.index")}</h1>
            <p class="index-desc">{$_("descriptions.index")}</p>
            {#if loading_commit_msg}
                <p class="index-desc">{$_("indicators.loading")}</p>
            {:else}
                <p class="index-desc latest-commit-msg">
                    {$_("indicators.latest-commit-msg", {
                        values: {
                            latest_commit: latest_commit,
                        },
                    })}
                </p>
            {/if}
            <p class="index-desc latest-commit-msg">
                {$_("indicators.current-build-status", {
                    values: {
                        progress: build_progress,
                    },
                })}
            </p>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <img
                class="buggy"
                src="/images/buggy.webp"
                aria-label="buggy"
                onclick={() => {
                    const buggy_audio = new Audio("/audio/buggy.mp3");
                    buggy_audio.play();
                    setTimeout(() => {
                        window.location.href =
                            "https://github.com/TheBearodactyl/www.bearodactyl.dev/issues/new/choose";
                    }, 4750);
                }}
                alt="buggy"
            />
        </div>
    </div>

    <NavigationGallery navItems={nav_items} />

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
    .index-desc.latest-commit-msg {
        font-size: medium !important;
    }
</style>
