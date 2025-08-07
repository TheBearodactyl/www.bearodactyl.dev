<script lang="ts">
    interface Props {
        url: string;
        text: string;
    }

    let { url, text }: Props = $props();
</script>

<button onclick={() => window.open(url, "_blank")}>{text}</button>

<style>
    button {
        background-color: var(--rp-surface);
        color: var(--rp-text);
        border: 2px solid var(--rp-iris);
        padding: 0.6em 1.2em;
        font-size: 1rem;
        border-radius: 0.5em;
        cursor: pointer;
        transition:
            background-color 0.2s,
            border-color 0.2s;
    }

    button:hover {
        background-color: var(--rp-overlay);
        border-color: var(--rp-pine);
    }

    button:active {
        background-color: var(--rp-highlight-med);
    }
</style>
