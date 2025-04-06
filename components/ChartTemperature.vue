<template>
  <VChart :option="option" autoresize style="height: 240px" />
</template>

<script lang="ts" setup>
import { useSensorStore } from "~/stores/sensor";

const sensorStore = useSensorStore();

const option = computed<ECOption>(() => {
  const recentTemps = [...sensorStore.readings]
    .filter((r) => r.type === "temperature")
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 10)
    .reverse();

  return {
    title: {
      text: "Temperature (Last 10)",
      left: "center",
      textStyle: {
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: recentTemps.map((r) =>
        new Date(r.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      ),
    },
    yAxis: {
      type: "value",
      name: "°C",
    },
    series: [
      {
        type: "bar",
        data: recentTemps.map((r) => r.value.toFixed(1)),
        itemStyle: {
          color: "#ec4899",
        },
        barMaxWidth: 24,
      },
    ],
  };
});
</script>
