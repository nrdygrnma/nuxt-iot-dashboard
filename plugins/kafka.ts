export default defineNuxtPlugin(async (nuxtApp) => {
  if (import.meta.server) {
    const { startConsumer } = await import("~/kafka/consumer");
    await startConsumer();
  }
});
