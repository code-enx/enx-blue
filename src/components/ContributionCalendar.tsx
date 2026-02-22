import { useMemo } from 'react';
import { format, startOfYear, endOfYear, eachDayOfInterval, getDay, addDays } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DailyProgress } from '@/types/habit';

interface ContributionCalendarProps {
  year: number;
  onYearChange: (year: number) => void;
  getDateProgress: (date: string) => DailyProgress;
  onDateClick?: (date: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ContributionCalendar({ 
  year, 
  onYearChange, 
  getDateProgress,
  onDateClick 
}: ContributionCalendarProps) {
  const calendarData = useMemo(() => {
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 0, 1));
    const days = eachDayOfInterval({ start, end });
    
    // Group by weeks
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    // Pad start to align with Sunday
    const firstDayOfWeek = getDay(start);
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(addDays(start, -firstDayOfWeek + i));
    }
    
    days.forEach((day) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    
    // Pad end
    while (currentWeek.length < 7) {
      currentWeek.push(addDays(currentWeek[currentWeek.length - 1], 1));
    }
    weeks.push(currentWeek);
    
    return weeks;
  }, [year]);

  const getContributionLevel = (date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const progress = getDateProgress(dateStr);
    
    if (progress.totalHabits === 0) return 0;
    const rate = progress.completionRate;
    
    if (rate === 0) return 0;
    if (rate <= 25) return 1;
    if (rate <= 50) return 2;
    if (rate <= 75) return 3;
    return 4;
  };

  const getContributionColor = (level: number): string => {
    const colors = [
      'bg-slate-800',
      'bg-blue-900/60',
      'bg-blue-700/70',
      'bg-blue-500/80',
      'bg-blue-400',
    ];
    return colors[level];
  };

  const getMonthLabels = () => {
    const labels: { month: string; index: number }[] = [];
    calendarData.forEach((week, weekIndex) => {
      week.forEach((day, dayIndex) => {
        if (dayIndex === 0 && day.getDate() <= 7 && day.getFullYear() === year) {
          const monthIndex = day.getMonth();
          if (!labels.find(l => l.index === monthIndex)) {
            labels.push({ month: MONTHS[monthIndex], index: weekIndex });
          }
        }
      });
    });
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="w-full">
      {/* Year Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{year}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onYearChange(year - 1)}
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onYearChange(year + 1)}
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[750px]">
          {/* Month Labels */}
          <div className="flex mb-2">
            <div className="w-8" /> {/* Spacer for weekday labels */}
            <div className="flex-1 flex relative h-6">
              {monthLabels.map(({ month, index }) => (
                <div
                  key={month}
                  className="absolute text-xs text-slate-400 font-medium"
                  style={{ left: `${(index / calendarData.length) * 100}%` }}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="flex">
            {/* Weekday Labels */}
            <div className="flex flex-col gap-1 mr-2 w-8">
              {WEEKDAYS.map((day, i) => (
                i % 2 === 0 ? (
                  <div key={day} className="h-3 text-[10px] text-slate-500 flex items-center">
                    {day}
                  </div>
                ) : (
                  <div key={day} className="h-3" />
                )
              ))}
            </div>

            {/* Contribution Cells */}
            <div className="flex gap-1">
              <TooltipProvider>
                {calendarData.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => {
                      const level = getContributionLevel(day);
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const progress = getDateProgress(dateStr);
                      const isCurrentYear = day.getFullYear() === year;
                      
                      return (
                        <Tooltip key={dayIndex}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => onDateClick?.(dateStr)}
                              className={`
                                w-3 h-3 rounded-sm transition-all duration-200
                                ${isCurrentYear ? getContributionColor(level) : 'bg-slate-800/30'}
                                ${isCurrentYear ? 'hover:ring-2 hover:ring-blue-400/50' : ''}
                                ${level > 0 ? 'shadow-sm shadow-blue-500/20' : ''}
                              `}
                              disabled={!isCurrentYear}
                            />
                          </TooltipTrigger>
                          <TooltipContent 
                            side="top" 
                            className="bg-slate-800 border-slate-700 text-white"
                          >
                            <div className="text-xs">
                              <p className="font-medium">{format(day, 'MMM d, yyyy')}</p>
                              {isCurrentYear && progress.totalHabits > 0 ? (
                                <p className="text-slate-300 mt-1">
                                  {progress.completedHabits.length} of {progress.totalHabits} habits completed
                                  <span className="text-blue-400 ml-1">
                                    ({Math.round(progress.completionRate)}%)
                                  </span>
                                </p>
                              ) : isCurrentYear ? (
                                <p className="text-slate-400 mt-1">No habits configured</p>
                              ) : null}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-xs text-slate-500">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`}
              />
            ))}
            <span className="text-xs text-slate-500">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
