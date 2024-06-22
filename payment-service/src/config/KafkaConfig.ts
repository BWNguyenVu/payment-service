import { Kafka, Producer, Consumer, EachMessagePayload } from "kafkajs";

class KafkaConfig {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: "nodejs-kafka",
      brokers: ["localhost:9092"],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "create-payment" });
  }

  async connectProducer(): Promise<void> {
    try {
      await this.producer.connect();
      console.log("Kafka producer connected");
    } catch (error) {
      console.error("Failed to connect Kafka producer:", error);
    }
  }

  async disconnectProducer(): Promise<void> {
    try {
      await this.producer.disconnect();
      console.log("Kafka producer disconnected");
    } catch (error) {
      console.error("Failed to disconnect Kafka producer:", error);
    }
  }

  async connectConsumer(): Promise<void>{
    try {
      await this.consumer.connect();
      console.log("Kafka consumer connected");
    } catch (error) {
      console.error("Failed to connect Kafka producer:", error);
    }
  }
  async produce(topic: string, messages: { value: string }[]): Promise<void> {
    try {
      await this.producer.send({
        topic: topic,
        messages: messages,
      });
    } catch (error) {
      console.error("Error producing message to Kafka:", error);
    }
  }

  async consume(topic: string, callback: (message: string) => void): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: topic, fromBeginning: true });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
          if (message.value) {
            const value = message.value.toString();
            callback(value);
          }
        },
      });
    } catch (error) {
      console.error("Error consuming message from Kafka:", error);
    }
  }
}

export default KafkaConfig;
