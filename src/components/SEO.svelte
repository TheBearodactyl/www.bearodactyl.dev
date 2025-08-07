<script lang="ts">
    interface Props {
        title: string;
        desc: string;
        image: string;
        url: string;
        ty?: string;
    }

    let { title, desc, image, url, ty = "website" }: Props = $props();
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={desc} />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={desc} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={url} />
    <meta property="og:type" content={ty} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={desc} />
    <meta name="twitter:image" content={image} />
</svelte:head>
