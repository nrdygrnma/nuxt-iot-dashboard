import type { SensorData } from "~/types";

const globalStore = globalThis as any;

if (!globalStore.__sensorMemory) {
  globalStore.__sensorMemory = [] as SensorData[];
}

export const sensorMemory = globalStore.__sensorMemory as SensorData[];

export function addSensorReading(reading: SensorData) {
  sensorMemory.push(reading);
  if (sensorMemory.length > 100) sensorMemory.shift();
}
