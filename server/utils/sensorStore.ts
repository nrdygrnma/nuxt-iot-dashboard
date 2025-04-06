const globalStore = globalThis as any;

if (!globalStore.sensorData) {
  globalStore.sensorData = [];
}

export const sensorData = globalStore.sensorData as any[];

export const addSensorReading = (data: any) => {
  sensorData.push(data);
  if (sensorData.length > 100) sensorData.shift();
};
