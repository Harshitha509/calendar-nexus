import React from 'react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";

interface DateFilterProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
  onFilterRemove: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ startDate, endDate, onDateChange, onFilterRemove }) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });
  const { toast } = useToast();

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) return;

    setDate(range);
    if (range.from && range.to) {
      const newFrom = startOfDay(range.from);
      const newTo = endOfDay(range.to);
      onDateChange(newFrom, newTo);

      toast({
        title: "Date range updated",
        description: `New range: ${format(newFrom, "LLL dd, y")} - ${format(newTo, "LLL dd, y")}`,
      });
    }
  };

  const handleRemoveFilter = () => {
    setDate(undefined);
    onFilterRemove();
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={`w-[300px] justify-start text-left font-normal ${date?.from ? "bg-blue-100" : ""}`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              <>
                {format(date.from, "LLL dd, y")} - {date.to ? format(date.to, "LLL dd, y") : "Select end date"}
              </>
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {date && (
        <Button variant="ghost" size="icon" onClick={handleRemoveFilter}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default DateFilter;
