import { defineStore } from "pinia";
import type { SensorData } from "~/types";

export const useSensorStore = defineStore("sensor", () => {
  const readings = ref<SensorData[]>([]);
  const isLoading = ref(false);

  const fetchReadings = async () => {
    try {
      isLoading.value = true;
      const { data } = await useFetch<SensorData[]>("/api/sensors", {
        server: false,
      });
      if (data.value) {
        setReadings(data.value);
      }
    } catch (e) {
      console.error("Failed to fetch sensor data:", e);
    } finally {
      isLoading.value = false;
    }
  };

  const addReading = (reading: SensorData) => {
    readings.value.push(reading);
    if (readings.value.length > 100) {
      readings.value.shift();
    }
  };

  const setReadings = (data: SensorData[]) => {
    readings.value = data;
  };

  return {
    readings,
    isLoading,
    fetchReadings,
    addReading,
    setReadings,
  };
});
