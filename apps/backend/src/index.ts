import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { KafkaConsumer } from './kafkaConsumer';
import env from './env';
import WebSocket, { WebSocketServer } from 'ws';
import { z } from 'zod';

const app = express();
const port = env.port;

app.use(cors());
app.use(express.json());

// Create Kafka consumer instance with mockMode enabled to simulate data locally
const kafkaConsumer = new KafkaConsumer(env.kafkaBrokers, env.kafkaTopic, true);

(async () => {
  await kafkaConsumer.start();
})();

// API Docs (basic)
app.get('/api/docs', (req, res) => {
  res.json({
    endpoints: {
      '/api/live': 'GET - live customer traffic data',
      '/api/history': 'GET - historical aggregated customer data per hour',
      'WebSocket': 'ws://<host>:<port>/ws - subscribe to live updates',
    },
  });
});

// Validation schemas
const liveQuerySchema = z.object({
  store_id: z.string().optional(),
});

app.get('/api/live', (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = liveQuerySchema.parse(req.query);

    let data = kafkaConsumer.getLiveData();
    if (query.store_id) {
      const storeIdNum = Number(query.store_id);
      if (isNaN(storeIdNum)) throw new Error('store_id must be a number');
      data = data.filter((d) => d.store_id === storeIdNum);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.get('/api/history', (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = kafkaConsumer.getHistoryData();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(400).json({ error: err.message || 'Unknown error' });
});

// Start HTTP server
const server = app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

// Setup WebSocket server for live updates
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  kafkaConsumer.addClient(ws);

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
    kafkaConsumer.removeClient(ws);
  });
});
