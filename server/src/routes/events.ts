import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { eventSchema } from '../schemas/event.schema';
import { z } from 'zod';

export const eventsRouter = Router();

eventsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = eventSchema.parse(req.body);
    
    const event = await prisma.event.create({
      data: {
        type: validatedData.type,
        name: validatedData.name,
        email: validatedData.email,
        value: validatedData.value,
        timestamp: validatedData.timestamp ? new Date(validatedData.timestamp) : new Date(),
      },
    });

    res.status(201).json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

eventsRouter.get('/add', async (req: Request, res: Response) => {
  try {
    const { type, name, email, value, timestamp } = req.query;
    
    const validatedData = eventSchema.parse({
      type,
      name,
      email,
      value: value ? parseFloat(value as string) : undefined,
      timestamp,
    });

    const event = await prisma.event.create({
      data: {
        type: validatedData.type,
        name: validatedData.name,
        email: validatedData.email,
        value: validatedData.value,
        timestamp: validatedData.timestamp ? new Date(validatedData.timestamp) : new Date(),
      },
    });

    res.status(201).json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

eventsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { date_from, date_to } = req.query;

    let startDate: Date;
    let endDate: Date;

    if (date_from && date_to) {
      startDate = new Date(date_from as string);
      endDate = new Date(date_to as string);
      endDate.setHours(23, 59, 59, 999);
    } else {
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    }

    const events = await prisma.event.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

eventsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
