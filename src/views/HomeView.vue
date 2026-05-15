<template>
  <main class="home">
    <CounterRecords />
    <BusRecords />
  </main>
</template>

<script setup>
import CounterRecords from "../components/home/CounterRecords.vue";
import BusRecords from "../components/home/BusRecords.vue";
</script>

<style scoped>
.home {
  background: #0f1115;
}
</style>