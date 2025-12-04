import express, { Request, Response } from 'express';
import cors from 'cors';
import { eventsRouter } from './routes/events';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/events', eventsRouter);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
