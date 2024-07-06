"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { addDays, format, startOfWeek, isToday, isSameDay, parse, getUnixTime } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface Subject {
  id: string;
  title: string;
  code: string;
  date: string; // in yyyy-mm-dd format
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

function parseDate(dateString: string): Date {
  return parse(dateString, 'yyyy-MM-dd', new Date());
}

function checkOverlap(subjects: Subject[]): [Subject[], string[]] {
  const validSubjects: Subject[] = [];
  const overlaps: string[] = [];
  
  for (const subject of subjects) {
    const subjectDate = parseDate(subject.date);
    const isOverlapping = validSubjects.some(validSubject => {
      const validSubjectDate = parseDate(validSubject.date);
      return isSameDay(validSubjectDate, subjectDate) &&
        ((validSubject.startHour < subject.startHour + subject.duration &&
          subject.startHour < validSubject.startHour + validSubject.duration) ||
         (subject.startHour < validSubject.startHour + validSubject.duration &&
          validSubject.startHour < subject.startHour + subject.duration))
    });

    if (isOverlapping) {
      overlaps.push(`${subject.title} on ${subject.date} overlaps with another subject`);
    } else {
      validSubjects.push(subject);
    }
  }

  return [validSubjects, overlaps];
}

function CustomCalendar({
  numberOfDays = 7,
  subjects
}: CustomCalendarProps) {
  const [startDate, setStartDate] = React.useState(startOfWeek(new Date()))
  const hours = Array.from({ length: 7 }, (_, i) => i + 1) // Hours 1 to 7
  const { toast } = useToast()
  const [validSubjects, setValidSubjects] = React.useState<Subject[]>([])

  React.useEffect(() => {
    const [valid, overlaps] = checkOverlap(subjects);
    setValidSubjects(valid);
    
    if (overlaps.length > 0) {
      toast({
        variant: "destructive",
        title: "Subject overlap detected",
        description: overlaps.join('\n'),
      })
    }
  }, [subjects, toast]);

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
                  {validSubjects
                    .filter(subject => isSameDay(parseDate(subject.date), currentDate))
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