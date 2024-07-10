"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  addDays,
  format,
  isToday,
  isSameDay,
  parse,
  subDays,
  differenceInDays,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SubjectDetailBox from "@/components/ui/SubjectDetailBox";
import DateFilter from "./DateFilter";

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
}

const subjectColors: { [key: string]: string } = {
  'Maths': 'bg-red-200 border-red-500',
  'Applied Science': 'bg-green-200 border-green-500',
  'FOC': 'bg-blue-200 border-blue-500',
  'FEEE': 'bg-yellow-200 border-yellow-500',
  // Add more subjects and their corresponding colors
};

export type CustomCalendarProps = {
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

function CustomCalendar({ subjects }: CustomCalendarProps) {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(addDays(new Date(), 6));
  const [filteredStartDate, setFilteredStartDate] = React.useState<Date | null>(null);
  const [filteredEndDate, setFilteredEndDate] = React.useState<Date | null>(null);
  const [visibleDays, setVisibleDays] = React.useState(7);
  const hours = Array.from({ length: 7 }, (_, i) => i + 1); // Hours 1 to 7
  const { toast } = useToast();
  const [validSubjects, setValidSubjects] = React.useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = React.useState<Subject | null>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const [valid, overlaps] = checkOverlap(subjects);
    setValidSubjects(valid);
    
    if (overlaps.length > 0) {
      toast({
        variant: "destructive",
        title: "Subject overlap detected",
        description: overlaps.join('\n'),
      });
    }
  }, [subjects, toast]);

  const handlePrevWeek = () => {
    if (!filteredStartDate || startDate > filteredStartDate) {
      setStartDate(prev => subDays(prev, 7));
      setEndDate(prev => subDays(prev, 7));
    }
  };
  
  const handleNextWeek = () => {
    if (!filteredEndDate || addDays(endDate, 7) <= filteredEndDate) {
      setStartDate(prev => addDays(prev, 7));
      setEndDate(prev => addDays(prev, 7));
    }
  };

  const handleToday = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(addDays(today, 6));
    setFilteredStartDate(null);
    setFilteredEndDate(null);
    setVisibleDays(7);
  };

  const handleDateChange = (start: Date, end: Date) => {
    setFilteredStartDate(start);
    setFilteredEndDate(end);
    setStartDate(start);
    setEndDate(end);
    const daysBetween = differenceInDays(end, start) + 1;
    setVisibleDays(daysBetween);
    scrollToDate(start);
  };

  const handleRemoveFilter = () => {
    setFilteredStartDate(null);
    setFilteredEndDate(null);
    handleToday();
  };

  const scrollToDate = (date: Date) => {
    if (calendarRef.current) {
      const dayIndex = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
      const dayElement = calendarRef.current.children[dayIndex] as HTMLElement;
      if (dayElement) {
        dayElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  React.useEffect(() => {
    if (filteredStartDate) {
      scrollToDate(filteredStartDate);
    }
  }, [filteredStartDate]);

  return (
    <div className="h-screen flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrevWeek}
            disabled={filteredStartDate !== null && startDate <= filteredStartDate}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <DateFilter 
            startDate={filteredStartDate || startDate} 
            endDate={filteredEndDate || endDate} 
            onDateChange={handleDateChange}
            onFilterRemove={handleRemoveFilter}
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNextWeek}
            disabled={filteredEndDate !== null && endDate >= filteredEndDate}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-lg font-medium">
          {format(startDate, "MMMM yyyy")}
        </span>
        <Button onClick={handleToday}>Today</Button>
      </div>
      <div className="flex-grow grid w-full  grid-cols-[auto,1fr] overflow-auto">
        <div className="space-y-6 pr-4 w-20 fixed z-20 bg-white border-r text-right">
          <div className="text-center w-full p-3 pb-10 h-12 border-b  top-0"></div>
          {hours.map(hour => (
            <div key={hour} className="h-14 flex items-center justify-end">
              <span className="text-sm text-gray-500 -translate-y-1/2">
                Hour {hour}
              </span>
            </div>
          ))}
        </div>
        <div className="grid pl-20 w-screen" style={{ gridTemplateColumns: `repeat(${visibleDays}, minmax(150px, 1fr))` }} ref={calendarRef}>
          {Array.from({ length: visibleDays }).map((_, dayIndex) => {
            const currentDate = addDays(startDate, dayIndex);
            return (
              <div key={dayIndex} className="border-l first:border-l-0">
                <div className={cn(
                  "text-center p-2 border-b sticky top-0 bg-white z-10",
                  isToday(currentDate) && "bg-blue-100",
                  filteredStartDate && isSameDay(currentDate, filteredStartDate) && "bg-green-100"
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
                            "absolute left-1 right-1 p-2 rounded-lg text-xs overflow-hidden border-2 cursor-pointer",
                            bgColor,
                            subject.isComplete 
                              ? 'border-solid' 
                              : 'border-dashed bg-opacity-50',
                            subjectColors[subject.title]?.split(' ')[1] || 'border-gray-500'
                          )}
                          style={{
                            top: `${(subject.startHour - 1) * 80 + 4}px`,
                            height: `${subject.duration * 80 - 8}px`,
                          }}
                          onClick={() => setSelectedSubject(subject)}
                        >
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex justify-between">
                              <div className="font-semibold text-sm">{subject.title}</div>
                              <div>{subject.code}</div>
                            </div>
                            <div className="flex justify-between px-2 ">
                              <div className="font-bold ">{subject.total}</div>
                              <div className="font-bold ">{subject.present}</div>
                              <div className="font-bold ">{subject.absent}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {hours.map(hour => (
                    <div key={hour} className="h-20 min-w-40 border-b"></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {selectedSubject && (
        <SubjectDetailBox
          subject={selectedSubject}
          onClose={() => setSelectedSubject(null)}
        />
      )}
    </div>
  );
}
CustomCalendar.displayName = "CustomCalendar";

export { CustomCalendar };
