import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
}

export function DateSelector({ 
  selectedDate, 
  onDateChange, 
  currentMonth, 
  onMonthChange 
}: DateSelectorProps) {
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    onMonthChange(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    onDateChange(format(date, 'yyyy-MM-dd'));
  };

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevMonth}
          className="bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-white min-w-[140px]"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {format(currentMonth, 'MMMM yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto bg-slate-900 border-slate-700 p-0">
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }, (_, i) => {
                  const month = new Date(currentMonth.getFullYear(), i, 1);
                  return (
                    <Button
                      key={i}
                      variant="ghost"
                      size="sm"
                      onClick={() => onMonthChange(month)}
                      className={`
                        text-white hover:bg-slate-800
                        ${isSameMonth(month, currentMonth) ? 'bg-blue-600 hover:bg-blue-500' : ''}
                      `}
                    >
                      {format(month, 'MMM')}
                    </Button>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Mini Calendar */}
      <div className="bg-slate-800/30 rounded-lg p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-slate-500 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isSelected = dateStr === selectedDate;
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  aspect-square flex items-center justify-center rounded-md text-sm
                  transition-all duration-200
                  ${isSelected 
                    ? 'bg-blue-600 text-white' 
                    : isTodayDate
                      ? 'bg-blue-600/30 text-blue-400 border border-blue-500/50'
                      : isCurrentMonth
                        ? 'text-white hover:bg-slate-700'
                        : 'text-slate-600'
                  }
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Select Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDateChange(format(new Date(), 'yyyy-MM-dd'))}
          className="flex-1 bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-white"
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDateChange(format(subDays(new Date(), 1), 'yyyy-MM-dd'))}
          className="flex-1 bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-white"
        >
          Yesterday
        </Button>
      </div>
    </div>
  );
}

// Helper function for yesterday
function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}
