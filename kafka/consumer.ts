import { Kafka } from "kafkajs";
import { addSensorReading } from "~/server/utils/sensorMemory";
import type { SensorData } from "~/types";

export const startConsumer = async () => {
  const kafka = new Kafka({
    clientId: "nuxt-consumer",
    brokers: ["localhost:29092"],
  });

  const consumer = kafka.consumer({ groupId: "iot-dashboard-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "sensor-readings", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const value = message.value?.toString();
      if (value) {
        try {
          const parsedData: SensorData = JSON.parse(value);
          addSensorReading(parsedData);
        } catch (err) {
          console.error("❌ Failed to parse Kafka message:", err);
        }
      }
    },
  });

  console.log("✅ Kafka consumer started");
};
