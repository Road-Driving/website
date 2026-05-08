<template>
  <main class="home">
    <HeroSection />
    <RecentStories />
    <BusRecords />
    <AboutSection />
  </main>
</template>

<script setup>
import HeroSection from "../components/home/HeroSection.vue";
import RecentStories from "../components/home/RecentStories.vue";
import BusRecords from "../components/home/BusRecords.vue";
import AboutSection from "../components/home/AboutSection.vue";
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #0f1115;
}
</style>