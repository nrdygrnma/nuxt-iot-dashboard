import { sensorData } from "~/server/utils/sensorStore";

export default defineEventHandler(() => {
  console.log("📡 Returning sensorData:", sensorData);

  return sensorData;
});
