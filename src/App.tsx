import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import EnxLogo from "./assets/enx-logo.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ContributionCalendar } from '@/components/ContributionCalendar';
import { HabitList } from '@/components/HabitList';
import { PerformanceCharts } from '@/components/PerformanceCharts';
import { DateSelector } from '@/components/DateSelector';
import { useHabitStorage } from '@/hooks/useHabitStorage';
import { CalendarDays, BarChart3, ListTodo } from 'lucide-react';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const {
    habits,
    completions,
    isLoaded,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    isCompleted,
    getDateProgress,
    getYearStats,
  } = useHabitStorage();

  // Show loading state while data is being loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your habits...</p>
        </div>
      </div>
    );
  }

  const selectedDateProgress = getDateProgress(selectedDate);
  const yearStats = getYearStats(selectedYear);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <img src={EnxLogo} alt="enx logo" className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">enx-blue</h1>
                <p className="text-xs text-slate-400">Daily Habit Tracker</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-slate-400">Today's Progress</p>
                <p className="text-lg font-semibold text-blue-400">
                  {selectedDateProgress.completedHabits.length} / {selectedDateProgress.totalHabits}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {Math.round(selectedDateProgress.completionRate)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700 w-full justify-start">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="habits"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <ListTodo className="h-4 w-4 mr-2" />
              Habits
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Calendar & Date Selector */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contribution Calendar */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-blue-500" />
                      Contribution Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ContributionCalendar
                      year={selectedYear}
                      onYearChange={setSelectedYear}
                      getDateProgress={getDateProgress}
                      onDateClick={(date) => {
                        setSelectedDate(date);
                        setCurrentMonth(parseISO(date));
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Performance Overview */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      Performance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PerformanceCharts
                      habits={habits}
                      completions={completions}
                      selectedYear={selectedYear}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Date Selector & Daily Habits */}
              <div className="space-y-6">
                {/* Date Selector */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DateSelector
                      selectedDate={selectedDate}
                      onDateChange={setSelectedDate}
                      currentMonth={currentMonth}
                      onMonthChange={setCurrentMonth}
                    />
                  </CardContent>
                </Card>

                {/* Daily Habits */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white text-base">
                      Habits for {format(parseISO(selectedDate), 'MMM d, yyyy')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <HabitList
                        habits={habits}
                        selectedDate={selectedDate}
                        onAddHabit={addHabit}
                        onUpdateHabit={updateHabit}
                        onDeleteHabit={deleteHabit}
                        onToggleCompletion={toggleCompletion}
                        isCompleted={isCompleted}
                      />
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Habits Tab */}
          <TabsContent value="habits">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* All Habits Management */}
              <Card className="bg-slate-900/50 border-slate-800 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ListTodo className="h-5 w-5 text-blue-500" />
                    Manage Your Habits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HabitList
                    habits={habits}
                    selectedDate={selectedDate}
                    onAddHabit={addHabit}
                    onUpdateHabit={updateHabit}
                    onDeleteHabit={deleteHabit}
                    onToggleCompletion={toggleCompletion}
                    isCompleted={isCompleted}
                  />
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm mb-2">Total Habits</p>
                    <p className="text-4xl font-bold text-white">{habits.length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm mb-2">Today's Completion</p>
                    <p className="text-4xl font-bold text-blue-400">
                      {Math.round(selectedDateProgress.completionRate)}%
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-slate-400 text-sm mb-2">Active Days This Year</p>
                    <p className="text-4xl font-bold text-green-400">{yearStats.activeDays}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <PerformanceCharts
                habits={habits}
                completions={completions}
                selectedYear={selectedYear}
              />
              
              {/* Year Selection for Analytics */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">View Historical Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <Button
                          key={year}
                          variant={selectedYear === year ? 'default' : 'outline'}
                          onClick={() => setSelectedYear(year)}
                          className={`
                            ${selectedYear === year 
                              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                              : 'bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700'
                            }
                          `}
                        >
                          {year}
                        </Button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-slate-400 mt-4">
                    Select a year to view your historical habit tracking data. 
                    All your data is stored locally in your browser.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              enx-blue - Your Personal Habit Tracker
            </p>
            <p className="text-slate-600 text-xs">
              Data stored locally in your browser
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
