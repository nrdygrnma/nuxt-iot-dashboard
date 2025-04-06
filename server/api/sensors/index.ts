import { sensorMemory } from "~/server/utils/sensorMemory";

export default defineEventHandler(() => {
  console.log("📡 Returning sensorMemory:", sensorMemory);
  return sensorMemory;
});
