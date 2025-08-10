<script lang="ts">
    import { choose_rand } from "$lib/utils/rand";
    import LinkedImage from "../../components/misc/LinkedImage.svelte";

    const priscilla_images = [
        "/images/priscilla/PXL_20250805_000809322.jpg",
        "/images/priscilla/PXL_20250806_052249930.jpg",
        "/images/priscilla/PXL_20250806_052304438.jpg",
        "/images/priscilla/PXL_20250809_084852313.jpg",
        "/images/priscilla/PXL_20250809_135841557.jpg",
        "/images/priscilla/PXL_20250810_012524573.PORTRAIT.ORIGINAL.jpg",
        "/images/priscilla/PXL_20250810_012611064.jpg",
    ];

    const prissy_kitty_image = choose_rand(priscilla_images);
</script>

<LinkedImage
    imageSrc={prissy_kitty_image}
    audioSrc=""
></LinkedImage>

<style>
    :global {
        @import url("/src/assets/css/main.css");
    }
</style>
