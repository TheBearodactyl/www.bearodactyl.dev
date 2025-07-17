<template>
    <img :src="props.imageSrc" alt="Click to play audio" @click="handleClick" class="clickable" />
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    imageSrc: {
        type: String,
        required: true
    },
    audioSrc: {
        type: String,
        required: true,
    },
    gotoLink: {
        type: String,
        required: false
    },
    delay: {
        type: Number,
        required: false
    }
})

const audio = ref(null);
const handleClick = () => {
    if (!audio.value) {
        audio.value = new Audio(props.audioSrc);
    }

    audio.value.play();

    if (props.gotoLink) {
        setTimeout(() => {
            if (props.gotoLink.startsWith("http")) {
                window.open(props.gotoLink, "_blank");
            } else {
                window.location.href = props.gotoLink;
            }
        }, props.delay == null ? 100 : props.delay);
    }
}

onUnmounted(() => {
    audio.value.pause();
});
</script>

<style>
.clickable {
    cursor: pointer;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: fill;
    overflow: hidden;
    display: block;
}
</style>