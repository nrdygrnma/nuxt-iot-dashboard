// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt-echarts", "@pinia/nuxt", "@nuxt/icon"],
  css: ["~/assets/css/main.css"],
  echarts: {
    renderer: "svg",
    charts: ["BarChart", "LineChart", "PieChart"],
    components: [
      "DatasetComponent",
      "GridComponent",
      "TooltipComponent",
      "TitleComponent",
    ],
    features: ["LabelLayout", "UniversalTransition"],
  },
});
