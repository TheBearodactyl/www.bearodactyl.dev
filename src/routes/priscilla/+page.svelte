<script lang="ts">
    import { choose_rand } from "libbearo";
    import LinkedImage from "../../components/misc/LinkedImage.svelte";

    const images = [
        "/images/priscilla/PXL_20250805_000809322.jpg",
        "/images/priscilla/PXL_20250806_052249930.jpg",
        "/images/priscilla/PXL_20250806_052304438.jpg",
        "/images/priscilla/PXL_20250809_084852313.jpg",
        "/images/priscilla/PXL_20250809_135841557.jpg",
        "/images/priscilla/PXL_20250810_012524573.PORTRAIT.ORIGINAL.jpg",
        "/images/priscilla/PXL_20250810_012611064.jpg",
    ];

    let selectedImage = $state(choose_rand(images));
</script>

<button onclick={() => {
    selectedImage = choose_rand(images);
}}>
    <LinkedImage
        imageSrc={selectedImage}
        audioSrc=""
    />
</button>
