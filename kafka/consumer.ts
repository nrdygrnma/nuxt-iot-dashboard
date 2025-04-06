import { Kafka } from "kafkajs";
import { addSensorReading } from "~/server/utils/sensorStore";

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
      console.log("📥 Received from Kafka:", value);
      if (value) {
        const parsedData = JSON.parse(value);
        addSensorReading(parsedData);
      }
    },
  });
  console.log("Kafka consumer started");
};
