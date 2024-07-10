import { CustomCalendar } from '@/components/ui/mockcalendar'
import React from 'react'

export default function page() {
  const subjects = [
    {
      id: '1',
      title: 'Maths',
      code: 'MATH101',
      date: '2024-07-10', // yyyy-mm-dd format
      startHour: 2,
      duration: 2,
      total: 'T30',
      present: 'P28',
      absent: 'A2',
      isComplete: true
    },
    {
      id: '2',
      title: 'FOC',
      code: 'FOC102',
      date: '2024-07-11', // yyyy-mm-dd format
      startHour: 1,
      duration: 4,
      total: 'T30',
      present: 'P34',
      absent: 'A4',
      isComplete: false
    },
    // ... more 
  ];
  return (
    <CustomCalendar  subjects={subjects} />
  )
}
