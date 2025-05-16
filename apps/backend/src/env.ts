import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  KAFKA_BROKERS: z.string().nonempty(),
  KAFKA_TOPIC: z.string().nonempty(),
  PORT: z
  .preprocess((val) => (val === undefined ? undefined : Number(val)), z.number())
  .default(4000),

});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.format());
  process.exit(1);
}

export default {
  kafkaBrokers: env.data.KAFKA_BROKERS.split(','),
  kafkaTopic: env.data.KAFKA_TOPIC,
  port: env.data.PORT,
};
