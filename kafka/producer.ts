import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "sensor-sim",
  brokers: ["localhost:29092"],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  setInterval(async () => {
    const message = {
      deviceId: "sensor-001",
      type: "temperature",
      value: +(20 + Math.random() * 10).toFixed(2),
      timestamp: new Date().toISOString(),
    };

    await producer.send({
      topic: "sensor-readings",
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log("Produced: ", message);
  }, 3000);
};

await run();
