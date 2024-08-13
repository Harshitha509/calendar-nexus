import { CustomCalendar } from '@/components/ui/mockcalendar';
import TimetableForm from '@/components/ui/TimetableForm';
import { useState } from 'react';

export default function Home() {
  const [subjects, setSubjects] = useState([/* ... */]);

  const handleTimetableUpdate = async (updateData:any) => {
    try {
      const response = await fetch('/api/timetable/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (response.ok) {
        // Refresh the timetable data
        // You might want to fetch the updated data from the server here
      }
    } catch (error) {
      console.error('Failed to update timetable:', error);
    }
  };

  return (
    <div>
      <CustomCalendar subjects={subjects} />
      <TimetableForm onSubmit={handleTimetableUpdate} />
    </div>
  );
}