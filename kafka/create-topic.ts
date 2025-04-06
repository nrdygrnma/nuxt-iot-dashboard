import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "topic-manager",
  brokers: ["localhost:29092"],
});

const admin = kafka.admin();

const run = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: "sensor-readings",
        numPartitions: 1,
        replicationFactor: 1,
      },
    ],
  });
  console.log("✅ Topic created");
  await admin.disconnect();
};

run().catch(console.error);
