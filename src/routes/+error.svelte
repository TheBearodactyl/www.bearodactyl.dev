<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import ChromaKeyed from "../components/ChromaKeyed.svelte";

    const gifUrl = "https://media.tenor.com/nQjGzxSGnjUAAAAM/buggy-dance.gif";

    onMount(() => {
        if (page.status === 404) {
            setInterval(() => {
                goto("/", { replaceState: true });
            }, 2000);
        }
    });
</script>

<div class="error-container">
    <h1 class="error-title">{page.error?.message}</h1>
    <ChromaKeyed scale={4} greenThreshold={0.35} src={gifUrl} />
    {#if page.status === 404}
        <p class="redirect-message">Redirecting to home page in a few seconds...</p>
    {/if}
</div>

<style>
    .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        background: var(--rp-base);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        text-align: center;
    }

    .error-title {
        font-size: clamp(1.5rem, 4vw, 3rem);
        color: white;
        margin-bottom: 2rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        font-weight: 700;
        letter-spacing: -0.02em;
    }

    .redirect-message {
        color: var(--rp-text);
        font-size: 1.1rem;
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 25px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 768px) {
        .error-container {
            padding: 1rem;
        }

        .redirect-message {
            font-size: 1rem;
            padding: 0.5rem 1rem;
        }
    }
</style>
