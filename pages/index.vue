<template>
  <div class="space-y-4">
    <h1 class="text-2xl text-pink-700 font-semibold">
      🌡️ IoT Temperature Dashboard
    </h1>

    <div v-if="sensorStore.readings.length" class="grid gap-4">
      <div
        v-for="sensor in [...sensorStore.readings].reverse().slice(0, 10)"
        :key="sensor.timestamp"
        class="p-4 border rounded bg-white shadow"
      >
        <div class="text-sm text-gray-500">{{ sensor.timestamp }}</div>
        <div class="font-medium text-lg">{{ sensor.deviceId }}</div>
        <div class="text-4xl font-bold">{{ sensor.value.toFixed(1) }}</div>
      </div>
    </div>

    <p v-else-if="sensorStore.isLoading">Loading sensor data...</p>
    <p v-else>No sensor data available.</p>
  </div>
</template>

<script lang="ts" setup>
import { useSensorStore } from "~/stores/sensor";

const sensorStore = useSensorStore();

onMounted(() => {
  sensorStore.fetchReadings();
  setInterval(sensorStore.fetchReadings, 2000);
});
</script>
