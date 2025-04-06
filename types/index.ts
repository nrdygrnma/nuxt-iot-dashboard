export type SensorType = "temperature" | "humidity" | "pressure";

export interface SensorData {
  deviceId: string;
  type: SensorType;
  value: number;
  timestamp: string;
}
