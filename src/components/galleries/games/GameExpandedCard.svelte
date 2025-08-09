<script lang="ts">
    import type { Game } from "$lib/types";
    import { _ } from "svelte-i18n";

    interface Props {
        game: Game;
        onCloseCard: () => void;
    }

    let { game, onCloseCard }: Props = $props();
</script>

<div class="expanded-card-overlay">
    <div class="book-expanded" class:show={game !== null} class:explicit-content={game.explicit}>
        <div class="expanded-header">
            <button class="close-btn" onclick={onCloseCard}>×</button>
            <div class="expanded-cover">
                <img
                    src={game.coverImage}
                    alt={$_("gallery.generic.cover-alt", { values: { title: game.title } })}
                    class="expanded-cover-image"
                />
                {#if game.explicit}
                    <div class="explicit-icon">
                        <span class="icon-warning">⚠️</span>
                        <span class="explicit-label">{$_("indicators.explicit")}</span>
                    </div>
                {/if}
            </div>
            <div class="expanded-basic-info">
                <h3 class="expanded-title">{game.title}</h3>
                <p class="expanded-author">{game.developer}</p>
                <div class="book-genres">
                    {#each game.genres as genre (genre)}
                        <span class="book-genre">{genre}</span>
                    {/each}
                </div>
                {#if game.tags}
                    <div class="book-tags">
                        {#each game.tags as tag (tag)}
                            <span class="book-tag">{tag}</span>
                        {/each}
                    </div>
                {/if}
                <div class="expanded-rating">
                    <span class="stars">
                        {#each Array(game.title === "P5R" ? 50 : 5) as _, star}
                            <span class="star" class:filled={star + 1 <= game.rating}>★</span>
                        {/each}
                    </span>
                    <span class="rating-text">
                        {$_("gallery.generic.rating-of-five", { values: { rating: game.rating } })}
                    </span>
                </div>
            </div>
        </div>

        <div class="expanded-content">
            <div class="description-section">
                <h4>{$_("gallery.generic.headers.description")}</h4>
                <p>{game.description}</p>
            </div>

            <div class="thoughts-section">
                <h4>{$_("gallery.generic.headers.my-thoughts")}</h4>
                <p>{game.myThoughts}</p>
            </div>

            {#if game.links && game.links.length > 0}
                <div class="links-section">
                    <h4>{$_("gallery.generic.headers.links")}</h4>
                    <div class="links-grid">
                        {#each game.links as link (link.title)}
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="book-link"
                            >
                                <span class="link-title">{link.title}</span>
                            </a>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
