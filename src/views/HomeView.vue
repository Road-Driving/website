<template>
  <main class="home">
    <RecentStories />
    <BusRecords />
  </main>
</template>

<script setup>
import RecentStories from "../components/home/RecentStories.vue";
import BusRecords from "../components/home/BusRecords.vue";
</script>

<style scoped>
.home {
  background: #0f1115;
}
</style>