<template>
    <div class="index-header">
        <h1>The Motherfucking Bearodactyl</h1>
        <p>this is my website, check out some stuff i made (it's a bit buggy)</p>
    </div>

    <NavigationGallery :nav-items="navigationItems" />
</template>

<script setup lang="ts">
import { NavigationGallery } from '#components';

const navigationItems = [
    {
        title: "Read/Watch List",
        description: "shit i've read/watched",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Hobo-with-a-shotgun-movie-poster.jpg/250px-Hobo-with-a-shotgun-movie-poster.jpg",
        route: "/lists/read-watch",
    },
    {
        title: "Projects",
        description: "stuff i've made/am making",
        coverImage: "https://art.pixilart.com/3e584658c53335d.png",
        route: "/lists/projects",
    },
    {
        title: "Website Source Code",
        description: "a lot of code. waow",
        coverImage: "/images/hackermans.gif",
        route: "https://github.com/TheBearodactyl/bearodactyl.dev",
    },
    {
        title: "Game list",
        description: "Games i play",
        coverImage: "/images/gamer.gif",
        route: "/lists/games"
    },
    {
        title: "Bearodactyl",
        description: "Bearodactyl",
        coverImage: "https://s3.amazonaws.com/theoatmeal-img/blog/bearodactyl_painting.jpg",
        route: "/jokes/bearo"
    },
    {
        title: "Emergency frog!",
        description: "Emergency Frog Situation!!!!",
        coverImage: "https://pbs.twimg.com/media/DIQFluYUwAEm6AH.jpg",
        route: "/jokes/aaaaa"
    },
    {
        title: "Woah",
        description: "Woah, it's Wulzy",
        coverImage: "https://static.wikia.nocookie.net/youtube/images/9/94/Wulzy_Face_Meme.jpg",
        route: "/jokes/woah"
    }
];
</script>

<style>
@import url("/assets/css/bookgallery/_base.css");

@font-face {
    font-family: "Cascadia Code Nerd Font";
    font-style: normal;
    font-weight: 200;
    src: url("/fonts/CaskaydiaCove/CaskaydiaCoveNerdFont-Light.ttf") format("truetype");
    font-variant-ligatures: normal;
}

* {
    font-family: "Cascadia Code Nerd Font" !important;
}

.index-header {
    text-align: center;
    margin-bottom: 3.5rem;
    margin-top: 3.5rem;
    font-size: 1.5rem;
    color: var(--rp-iris);
    font-weight: 800;
    letter-spacing: -0.04em;
    text-shadow: 0 0 20px rgba(196, 167, 231, 0.3),
        0 0 40px rgba(196, 167, 231, 0.1);
    line-height: 1.1;
    background: linear-gradient(90deg,
            var(--rp-iris) 0%,
            var(--rp-foam) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fadeInDown 1s var(--transition-ease) forwards;
    opacity: 1;
}
</style>
