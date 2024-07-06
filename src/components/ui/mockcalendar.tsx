"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addDays, format, startOfWeek, isToday } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Subject {
  id: string;
  title: string;
  code: string;
  day: number;
  startHour: number;
  duration: number;
  total: string;
  present: string;
  absent: string;
  isComplete: boolean;
  isOngoing: boolean;
}

const subjectColors: { [key: string]: string } = {
  'Maths': 'bg-red-200 border-red-500',
  'Applied Science': 'bg-green-200 border-green-500',
  'FOC': 'bg-blue-200 border-blue-500',
  'FEEE': 'bg-yellow-200 border-yellow-500',
  // Add more subjects and their corresponding colors
};

export type CustomCalendarProps = {
  numberOfDays?: number;
  subjects: Subject[];
}

function CustomCalendar({
  numberOfDays = 7,
  subjects
}: CustomCalendarProps) {
  const [startDate, setStartDate] = React.useState(startOfWeek(new Date()))
  const hours = Array.from({ length: 7 }, (_, i) => i + 1) // Hours 1 to 7

  const handlePrevWeek = () => {
    setStartDate(prev => addDays(prev, -numberOfDays))
  }

  const handleNextWeek = () => {
    setStartDate(prev => addDays(prev, numberOfDays))
  }

  const handleToday = () => {
    setStartDate(startOfWeek(new Date()))
  }

  return (
    <div className="h-screen flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-lg font-medium">
          {format(startDate, "MMMM yyyy")}
        </span>
        <Button onClick={handleToday}>Today</Button>
      </div>
      <div className="flex-grow grid grid-cols-[auto,1fr] gap-4 overflow-auto">
        <div className="space-y-6 pr-4 text-right">
          {hours.map(hour => (
            <div key={hour} className="h-20 flex items-center justify-end">
              <span className="text-sm text-gray-500 -translate-y-1/2">
                Hour {hour}
              </span>
            </div>
          ))}
        </div>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${numberOfDays}, minmax(150px, 1fr))` }}>
          {Array.from({ length: numberOfDays }).map((_, dayIndex) => {
            const currentDate = addDays(startDate, dayIndex)
            return (
              <div key={dayIndex} className="border-l first:border-l-0">
                <div className={cn(
                  "text-center p-2 border-b sticky top-0 bg-white z-10",
                  isToday(currentDate) && "bg-blue-100"
                )}>
                  <div className="text-sm font-medium">
                    {format(currentDate, "EEE")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(currentDate, "d")}
                  </div>
                </div>
                <div className="relative">
                  {subjects
                    .filter(subject => subject.day === dayIndex)
                    .map(subject => {
                      const [bgColor, _] = (subjectColors[subject.title] || 'bg-gray-200 border-gray-500').split(' ');
                      return (
                        <div
                          key={subject.id}
                          className={cn(
                            "absolute left-1 right-1 p-2 rounded-lg text-xs overflow-hidden border-2",
                            bgColor,
                            subject.isOngoing ? 'border-dashed border-gray-500 bg-gray-300' : 'border-solid',
                            !subject.isOngoing && (subjectColors[subject.title]?.split(' ')[1] || 'border-gray-500 ')
                          )}
                          style={{
                            top: `${(subject.startHour - 1) * 80 + 4}px`,
                            height: `${subject.duration * 80 - 8}px`,
                          }}
                        >
                          <div className="flex flex-col gap-3">
                            <div className="flex gap-10">
                              <div className="font-semibold text-lg">{subject.title}</div>
                              <div>{subject.code}</div>
                            </div>
                            <div className="flex gap-8">
                              <div className="font-bold ">{subject.total}</div>
                              <div className="font-bold ">{subject.present}</div>
                              <div className="font-bold ">{subject.absent}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  {hours.map(hour => (
                    <div key={hour} className="h-20 border-b"></div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

CustomCalendar.displayName = "CustomCalendar"

export { CustomCalendar }