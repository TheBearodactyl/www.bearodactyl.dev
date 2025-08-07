<script lang="ts">
    import LinkButton from "../../../components/LinkButton.svelte";

    const domains = [
        {
            title: "this site",
            desc: "the one you're on right now!",
            lnk: "https://bearodactyl.dev",
        },
        {
            title: "Petah",
            desc: "Peter, meet Peta",
            lnk: "https://petah.bearodactyl.dev",
        },
    ];
</script>

<div class="domains">
    {#each domains as domain (domain.lnk)}
        <div class="domain">
            <div class="domain-title">
                <LinkButton url={domain.lnk} text={domain.title}></LinkButton>
            </div>
            <div class="domain-desc">{domain.desc}</div>
        </div>
    {/each}
</div>

<style>
    :global {
        @import url("/src/assets/css/main.css");
    }

    .domains {
        display: block;
        margin: 2rem auto;
        padding: 0;
        max-width: 90vw;
    }

    .domain {
        background-color: var(--rp-surface);
        padding: 2rem;
        display: flex;
        flex-direction: row;
        gap: 2rem;
        border-radius: 20px;
        margin-bottom: 1.5rem;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        transform: translateY(10px);
        opacity: 0;
        width: 90vw;
        animation: fadeInUp 0.6s ease forwards;
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
    }

    .domain:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
    }

    .domain-title {
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .domain-desc {
        font-size: 1.1rem;
        color: var(--rp-text-secondary, #666);
        margin-top: 0.9rem;
    }

    @keyframes fadeInUp {
        0% {
            transform: translateY(20px);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>