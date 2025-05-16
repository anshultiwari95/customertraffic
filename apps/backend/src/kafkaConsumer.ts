import WebSocket from 'ws';

type CustomerMessage = {
  store_id: number;
  customers_in: number;
  customers_out: number;
  time_stamp: string;
};

export class KafkaConsumer {
  private clients = new Set<WebSocket>();
  private liveData: CustomerMessage[] = [];
  private historyData: Map<string, { customers_in: number; customers_out: number }> = new Map();
  private simulationInterval?: NodeJS.Timeout;
  private mockMode: boolean;

  private kafka?: any;
  private consumer?: any;
  private topic: string;

  constructor(brokers: string[], topic: string, mockMode = false) {
    this.topic = topic;
    this.mockMode = mockMode;

    if (!mockMode) {
      const { Kafka } = require('kafkajs');
      this.kafka = new Kafka({ brokers });
      this.consumer = this.kafka.consumer({ groupId: 'customer-traffic-group' });
    }
  }

  async start() {
    if (this.mockMode) {
      console.log('🚀 Running KafkaConsumer in MOCK mode — simulating Kafka data');
      this.startSimulation();
      return;
    }

    if (!this.consumer) {
      throw new Error('Kafka consumer is not initialized.');
    }

    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ message }: { message: { value: Buffer } }) => {

        if (!message.value) return;
        try {
          const parsed: CustomerMessage = JSON.parse(message.value.toString());

          this.liveData.push(parsed);
          if (this.liveData.length > 100) this.liveData.shift();

          this.aggregateHistory(parsed);
          this.broadcast(parsed);
        } catch (error) {
          console.error('Error parsing Kafka message:', error);
        }
      },
    });

    console.log('Kafka consumer started');
  }

  private startSimulation() {
    this.simulationInterval = setInterval(() => {
      const simulatedMessage: CustomerMessage = {
        store_id: Math.floor(Math.random() * 5) + 1,
        customers_in: Math.floor(Math.random() * 10),
        customers_out: Math.floor(Math.random() * 10),
        time_stamp: new Date().toISOString(),
      };

      this.liveData.push(simulatedMessage);
      if (this.liveData.length > 100) this.liveData.shift();

      this.aggregateHistory(simulatedMessage);
      this.broadcast(simulatedMessage);
    }, 2000);
  }

  private aggregateHistory(msg: CustomerMessage) {
    const hour = new Date().getHours();
    const key = `store_${msg.store_id}_${hour}`;

    const agg = this.historyData.get(key) || { customers_in: 0, customers_out: 0 };
    agg.customers_in += msg.customers_in;
    agg.customers_out += msg.customers_out;

    this.historyData.set(key, agg);
  }

  addClient(ws: WebSocket) {
    this.clients.add(ws);
  }

  removeClient(ws: WebSocket) {
    this.clients.delete(ws);
  }

  broadcast(msg: CustomerMessage) {
    const messageString = JSON.stringify(msg);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  }

  getLiveData() {
    return this.liveData;
  }

  getHistoryData() {
    const result: {
      store_id: number;
      hour: number;
      customers_in: number;
      customers_out: number;
    }[] = [];

    const now = new Date();

    this.historyData.forEach((value, key) => {
      const [, storeIdStr, hourStr] = key.split('_');
      const store_id = Number(storeIdStr);
      const hour = Number(hourStr);

      if (hour <= now.getHours() && hour > now.getHours() - 24) {
        result.push({ store_id, hour, customers_in: value.customers_in, customers_out: value.customers_out });
      }
    });

    return result;
  }

  stopSimulation() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);
  }
}