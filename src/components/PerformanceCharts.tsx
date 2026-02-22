import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import type { Habit, HabitCompletion } from '@/types/habit';

interface PerformanceChartsProps {
  habits: Habit[];
  completions: HabitCompletion[];
  selectedYear: number;
}

export function PerformanceCharts({ habits, completions, selectedYear }: PerformanceChartsProps) {
  // Weekly data
  const weeklyData = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(subDays(today, 6 * 7), { weekStartsOn: 0 });
    const end = endOfWeek(today, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayCompletions = completions.filter(
        c => c.date === dateStr && c.completed
      ).length;
      const totalHabits = habits.filter(h => !h.archived).length;
      
      return {
        date: format(day, 'MMM d'),
        fullDate: dateStr,
        completed: dayCompletions,
        total: totalHabits,
        rate: totalHabits > 0 ? Math.round((dayCompletions / totalHabits) * 100) : 0,
      };
    });
  }, [completions, habits]);

  // Monthly data for selected year
  const monthlyData = useMemo(() => {
    const data = [];
    for (let month = 0; month < 12; month++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const yearPrefix = `${selectedYear}-${monthStr}`;
      
      const monthCompletions = completions.filter(
        c => c.date.startsWith(yearPrefix) && c.completed
      ).length;
      
      const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
      const totalHabits = habits.filter(h => !h.archived).length;
      const maxPossible = totalHabits * daysInMonth;
      
      data.push({
        month: format(new Date(selectedYear, month), 'MMM'),
        completed: monthCompletions,
        maxPossible,
        rate: maxPossible > 0 ? Math.round((monthCompletions / maxPossible) * 100) : 0,
      });
    }
    return data;
  }, [completions, habits, selectedYear]);

  // Habit completion stats
  const habitStats = useMemo(() => {
    const activeHabits = habits.filter(h => !h.archived);
    return activeHabits.map(habit => {
      const habitCompletions = completions.filter(
        c => c.habitId === habit.id && c.completed
      ).length;
      return {
        name: habit.name,
        completions: habitCompletions,
        color: habit.color,
      };
    }).sort((a, b) => b.completions - a.completions);
  }, [habits, completions]);

  // Overall stats
  const overallStats = useMemo(() => {
    const activeHabits = habits.filter(h => !h.archived);
    const totalHabits = activeHabits.length;
    
    const yearStart = `${selectedYear}-01-01`;
    const yearEnd = `${selectedYear}-12-31`;
    const yearCompletions = completions.filter(
      c => c.date >= yearStart && c.date <= yearEnd && c.completed
    );
    
    const totalCompleted = yearCompletions.length;
    const activeDays = new Set(yearCompletions.map(c => c.date)).size;
    const maxPossible = totalHabits * 365;
    
    return {
      totalHabits,
      totalCompleted,
      activeDays,
      overallRate: maxPossible > 0 ? Math.round((totalCompleted / maxPossible) * 100) : 0,
      currentStreak: calculateStreak(completions, activeHabits.map(h => h.id)),
    };
  }, [habits, completions, selectedYear]);

  function calculateStreak(completions: HabitCompletion[], habitIds: string[]): number {
    if (habitIds.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = format(subDays(today, i), 'yyyy-MM-dd');
      const dayCompletions = completions.filter(
        c => c.date === checkDate && c.completed && habitIds.includes(c.habitId)
      ).length;
      
      if (dayCompletions > 0 || i === 0) {
        if (dayCompletions > 0) streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Total Habits</p>
            <p className="text-2xl font-bold text-white">{overallStats.totalHabits}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Completion Rate</p>
            <p className="text-2xl font-bold text-blue-400">{overallStats.overallRate}%</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Active Days</p>
            <p className="text-2xl font-bold text-green-400">{overallStats.activeDays}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Current Streak</p>
            <p className="text-2xl font-bold text-orange-400">{overallStats.currentStreak} days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="bg-slate-800/50 border-slate-700">
          <TabsTrigger value="weekly" className="data-[state=active]:bg-blue-600">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-blue-600">Monthly</TabsTrigger>
          <TabsTrigger value="habits" className="data-[state=active]:bg-blue-600">By Habit</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Last 7 Weeks Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 0 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">{selectedYear} Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habits" className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Habit Completion Stats</CardTitle>
            </CardHeader>
            <CardContent>
              {habitStats.length > 0 ? (
                <div className="space-y-3">
                  {habitStats.map((stat) => (
                    <div key={stat.name} className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stat.color }}
                      />
                      <span className="text-sm text-white flex-1">{stat.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              backgroundColor: stat.color,
                              width: `${Math.min((stat.completions / 365) * 100, 100)}%`
                            }}
                          />
                        </div>
                        <span className="text-sm text-slate-400 w-12 text-right">
                          {stat.completions}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">No habits to display</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
