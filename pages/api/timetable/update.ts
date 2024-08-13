import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/app/db';
import { timetableSession, timetableHistory } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { uuid } from 'drizzle-orm/pg-core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { sessionId, changes, applyFrom, changedBy } = req.body;

  try {
    // Fetch the current timetable session
    const [currentSession] = await db.select().from(timetableSession).where(eq(timetableSession.id, sessionId));

    if (!currentSession) {
      return res.status(404).json({ message: 'Timetable session not found' });
    }

    // Create a history record
    await db.insert(timetableHistory).values({
      
      timetableSessionId: sessionId,
      changedBy,
      changeType: 'update',
      oldData: JSON.stringify(currentSession),
      newData: JSON.stringify(changes),
      effectiveFrom: new Date(applyFrom).toISOString(),
    });

    // Update the timetable session
    if (new Date(applyFrom) <= new Date()) {
      await db.update(timetableSession)
        .set(changes)
        .where(eq(timetableSession.id, sessionId));
    }

    res.status(200).json({ message: 'Timetable updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}