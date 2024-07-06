import { CustomCalendar } from '@/components/ui/mockcalendar'
import React from 'react'

export default function page() {
  const subjects = [
    { id: '1', title: 'Maths',code:'15CS10T', day: 3, startHour: 4, duration: 3, total: 'T23', present: 'P15',absent:'A8', isComplete: false,isOngoing: true },
     { id: '2', title: 'Applied Science',code:'15CS10T', day: 2, startHour: 4, duration: 2, total: 'T23', present: 'P15',absent:'A8', isComplete: true,isOngoing: false },
    // ... more subjects
  ];
  return (
    <CustomCalendar numberOfDays={7} subjects={subjects}/>
  )
}
