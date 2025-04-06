<template>
  <div class="space-y-4">
    <h1 class="text-2xl text-pink-700 font-semibold">
      IoT Temperature Dashboard
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div class="md:col-span-2 space-y-4">
        <UTable
          ref="table"
          v-model:pagination="pagination"
          :columns="columns"
          :data="rows"
          :loading="sensorStore.isLoading"
          :pagination-options="{
            getPaginationRowModel: getPaginationRowModel(),
          }"
          :sorting="sorting"
          class="flex-1"
          loading-animation="carousel"
          loading-color="primary"
        />

        <div class="flex justify-center border-t border-(--ui-border) pt-4">
          <UPagination
            :default-page="
              (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
            "
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>

      <div class="p-4">
        <ClientOnly>
          <ChartTemperature />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSensorStore } from "~/stores/sensor";
import type { TableColumn } from "@nuxt/ui";
import type { SensorData, SensorType } from "~/types";
import { getPaginationRowModel } from "@tanstack/table-core";
import ChartTemperature from "~/components/ChartTemperature.vue";

const UBadge = resolveComponent("UBadge");
const UIcon = resolveComponent("UIcon");
const UButton = resolveComponent("UButton");

const sensorStore = useSensorStore();
const table = useTemplateRef("table");

const sorting = ref([
  {
    id: "timestamp",
    desc: true,
  },
]);

const option = computed<ECOption>(() => {
  const recentTemps = [...sensorStore.readings]
    .filter((r) => r.type === "temperature")
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 10)
    .reverse(); // show in chronological order

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
          color: "#ec4899", // Tailwind pink-500
        },
        barMaxWidth: 24,
      },
    ],
  };
});

const colorMap: Record<SensorType, "info" | "primary" | "error"> = {
  temperature: "info",
  humidity: "primary",
  pressure: "error",
};

const iconMap: Record<SensorType, string> = {
  temperature: "bi:thermometer-sun",
  humidity: "bi:droplet",
  pressure: "i-lucide-bar-chart-3",
};

const pagination = ref({
  pageIndex: 0,
  pageSize: 6,
});

const getTypeBadge = (type: SensorType) => {
  const label = type.charAt(0).toUpperCase() + type.slice(1);

  return h(
    UBadge,
    {
      color: colorMap[type] ?? "neutral",
      variant: "subtle",
      class: "capitalize flex items-center gap-1",
    },
    {
      default: () => [
        h(UIcon, { name: iconMap[type] ?? "", class: "w-4 h-4" }),
        label,
      ],
    },
  );
};

const getDeviceBadge = (deviceId: string) =>
  h(
    UBadge,
    {
      variant: "subtle",
      color: "neutral",
      class: "font-mono text-xs truncate max-w-[180px] flex items-center gap-1",
      title: deviceId,
    },
    {
      default: () => [
        h(UIcon, { name: "eos-icons:iot", class: "w-4 h-4" }),
        deviceId,
      ],
    },
  );

const columns: TableColumn<SensorData>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Timestamp",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5 cursor-pointer",
        onClick: () => column.toggleSorting(isSorted === "asc"),
      });
    },
    cell: ({ row }) =>
      h("div", new Date(row.getValue("timestamp")).toLocaleString()),
  },
  {
    accessorKey: "deviceId",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Device ID",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5 cursor-pointer",
        onClick: () => column.toggleSorting(isSorted === "asc"),
      });
    },
    cell: ({ row }) =>
      h("div", { class: "flex items-center justify-start" }, [
        getDeviceBadge(row.getValue("deviceId")),
      ]),
  },
  {
    accessorKey: "type",
    header: () => h("div", { class: "text-center" }, "Type"),
    cell: ({ row }) =>
      h("div", { class: "flex justify-center" }, [
        getTypeBadge(row.getValue("type")),
      ]),
  },
  {
    accessorKey: "value",
    header: ({ column }) =>
      h("div", { class: "text-right" }, [
        h(UButton, {
          color: "neutral",
          variant: "ghost",
          label: "Value (°C)",
          icon: column.getIsSorted()
            ? column.getIsSorted() === "asc"
              ? "i-lucide-arrow-up-narrow-wide"
              : "i-lucide-arrow-down-wide-narrow"
            : "i-lucide-arrow-up-down",
          class: "-mx-2.5 cursor-pointer",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        }),
      ]),
    cell: ({ row }) =>
      h(
        "div",
        { class: "text-right font-medium text-pink-600" },
        `${Number(row.getValue("value")).toFixed(1)}`,
      ),
  },
];

const rows = computed(() =>
  [...sensorStore.readings].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  ),
);

onMounted(() => {
  sensorStore.fetchReadings();
  setInterval(sensorStore.fetchReadings, 2000);
});
</script>
