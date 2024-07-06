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
      total: '30',
      present: '28',
      absent: '2',
      isComplete: false,
      isOngoing: false
    },
    // ... more subjects
  ];
  return (
    <CustomCalendar numberOfDays={7} subjects={subjects}/>
  )
}
