<template>
  <div class="navigation-gallery-wrapper">
    <div class="navigation-gallery">
      <component v-for="item in navItems" :key="item.title" :is="item.title === 'Emergency frog!' ? 'div' : NuxtLink"
        :to="item.title === 'Emergency frog!' ? undefined : item.route" class="nav-card" @click="handleCardClick(item)">
        <div class="card-image-container">
          <NuxtImg v-if="item.coverImage" :src="item.coverImage" :alt="`Cover for ${item.title}`" class="card-image" />
          <div v-else class="placeholder-image">?</div>
        </div>
        <div class="card-content">
          <h2 class="card-title">{{ item.title }}</h2>
          <p class="card-description">{{ item.description }}</p>
        </div>
      </component>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { NuxtLink } from '#components';

interface NavItem {
  title: string;
  description: string;
  coverImage?: string;
  route: string;
}

defineProps<{
  navItems: NavItem[];
}>();

const showEmergency = ref(false);

function handleCardClick(item: NavItem) {
  if (item.title === 'Emergency frog!') {
    playEmergency();
  }
}

function playEmergency() {
  const audio = new Audio('https://www.myinstants.com/media/sounds/emergency-frog-situation.mp3');
  audio.play();
  showEmergency.value = true;

  setTimeout(() => {
    showEmergency.value = false;
  }, 3500);
}
</script>

<style scoped>
@import url("/assets/css/bookgallery/_base.css");

.navigation-gallery-wrapper {
  padding: 2rem;
  background-color: var(--rp-base);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.navigation-gallery {
  column-count: 3;
  column-gap: 1.5rem;
  max-width: 1200px;
  width: 100%;
}

.nav-card {
  width: 100%;
  background-color: var(--rp-overlay);
  border: 1px solid var(--rp-highlight-low);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--text);
  transition: transform 0.2s ease, border-color 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-bottom: 1.5rem;
  break-inside: avoid-column;
}

@media (max-width: 900px) {
  .navigation-gallery {
    column-count: 2;
  }
}

@media (max-width: 600px) {
  .navigation-gallery {
    column-count: 1;
  }
}

.nav-card:hover {
  transform: translateY(-5px);
  border-color: var(--rp-iris);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.nav-card.clickable {
  cursor: pointer;
}

.card-image-container {
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: var(--rp-surface);
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-image {
  position: relative;
  top: unset;
  left: unset;
  width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.nav-card:hover .card-image {
  transform: scale(1.05);
}

.placeholder-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--rp-surface);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--muted);
  font-size: 1.5rem;
}

.card-content {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  font-size: 1.5rem;
  color: var(--rp-gold);
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.card-description {
  font-size: 1rem;
  color: var(--rp-subtle);
  flex-grow: 1;
  margin-bottom: 1rem;
}

.emergency-overlay {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 0, 0, 0.9);
  color: white;
  font-size: 2rem;
  font-weight: bold;
  padding: 1.5rem 3rem;
  border-radius: 1rem;
  z-index: 1000;
  animation: shake 0.05s infinite, pulse 1s infinite alternate;
  box-shadow: 0 0 30px red;
}

.emergency-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 0, 0, 0.3);
  z-index: 999;
  pointer-events: none;
}

@keyframes shake {
  0% {
    transform: translateX(-50%) translateY(0) rotate(0deg);
  }

  10% {
    transform: translateX(-48%) translateY(-10px) rotate(-5deg);
  }

  20% {
    transform: translateX(-52%) translateY(6px) rotate(3deg);
  }

  30% {
    transform: translateX(-49%) translateY(-12px) rotate(-3deg);
  }

  40% {
    transform: translateX(-51%) translateY(8px) rotate(4deg);
  }

  50% {
    transform: translateX(-50%) translateY(-15px) rotate(-2deg);
  }

  60% {
    transform: translateX(-53%) translateY(10px) rotate(6deg);
  }

  70% {
    transform: translateX(-47%) translateY(-9px) rotate(-4deg);
  }

  80% {
    transform: translateX(-50%) translateY(12px) rotate(2deg);
  }

  90% {
    transform: translateX(-52%) translateY(-7px) rotate(3deg);
  }

  100% {
    transform: translateX(-50%) translateY(0) rotate(0deg);
  }
}

@keyframes pulse {
  0% {
    background-color: rgba(255, 0, 0, 0.9);
  }

  100% {
    background-color: rgba(255, 50, 50, 0.95);
  }
}
</style>