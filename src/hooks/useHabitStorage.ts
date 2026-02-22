import { useState, useEffect, useCallback } from 'react';
import type { Habit, HabitCompletion, DailyProgress } from '@/types/habit';

const HABITS_KEY = 'enx-blue-habits';
const COMPLETIONS_KEY = 'enx-blue-completions';

export function useHabitStorage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedHabits = localStorage.getItem(HABITS_KEY);
        const storedCompletions = localStorage.getItem(COMPLETIONS_KEY);
        
        if (storedHabits) {
          setHabits(JSON.parse(storedHabits));
        }
        if (storedCompletions) {
          setCompletions(JSON.parse(storedCompletions));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);

  // Save habits to localStorage
  const saveHabits = useCallback((newHabits: Habit[]) => {
    try {
      localStorage.setItem(HABITS_KEY, JSON.stringify(newHabits));
      setHabits(newHabits);
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  }, []);

  // Save completions to localStorage
  const saveCompletions = useCallback((newCompletions: HabitCompletion[]) => {
    try {
      localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(newCompletions));
      setCompletions(newCompletions);
    } catch (error) {
      console.error('Error saving completions:', error);
    }
  }, []);

  // Add a new habit
  const addHabit = useCallback((name: string, color: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: new Date().toISOString().split('T')[0],
      archived: false,
    };
    const updatedHabits = [...habits, newHabit];
    saveHabits(updatedHabits);
    return newHabit;
  }, [habits, saveHabits]);

  // Update a habit
  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    const updatedHabits = habits.map(h => 
      h.id === id ? { ...h, ...updates } : h
    );
    saveHabits(updatedHabits);
  }, [habits, saveHabits]);

  // Delete a habit
  const deleteHabit = useCallback((id: string) => {
    const updatedHabits = habits.filter(h => h.id !== id);
    const updatedCompletions = completions.filter(c => c.habitId !== id);
    saveHabits(updatedHabits);
    saveCompletions(updatedCompletions);
  }, [habits, completions, saveHabits, saveCompletions]);

  // Toggle habit completion for a date
  const toggleCompletion = useCallback((habitId: string, date: string) => {
    const existingIndex = completions.findIndex(
      c => c.habitId === habitId && c.date === date
    );
    
    let newCompletions;
    if (existingIndex >= 0) {
      // Toggle existing
      newCompletions = [...completions];
      newCompletions[existingIndex] = {
        ...newCompletions[existingIndex],
        completed: !newCompletions[existingIndex].completed
      };
    } else {
      // Add new completion
      newCompletions = [...completions, { habitId, date, completed: true }];
    }
    
    saveCompletions(newCompletions);
  }, [completions, saveCompletions]);

  // Check if a habit is completed on a specific date
  const isCompleted = useCallback((habitId: string, date: string): boolean => {
    return completions.some(
      c => c.habitId === habitId && c.date === date && c.completed
    );
  }, [completions]);

  // Get completion rate for a specific date
  const getDateProgress = useCallback((date: string): DailyProgress => {
    const activeHabits = habits.filter(h => !h.archived);
    const completedHabits = activeHabits.filter(h => 
      isCompleted(h.id, date)
    ).map(h => h.id);
    
    return {
      date,
      completedHabits,
      totalHabits: activeHabits.length,
      completionRate: activeHabits.length > 0 
        ? (completedHabits.length / activeHabits.length) * 100 
        : 0
    };
  }, [habits, isCompleted]);

  // Get all completions for a date range
  const getCompletionsForRange = useCallback((startDate: string, endDate: string): HabitCompletion[] => {
    return completions.filter(c => 
      c.date >= startDate && c.date <= endDate && c.completed
    );
  }, [completions]);

  // Get statistics for a specific year
  const getYearStats = useCallback((year: number) => {
    const yearStart = `${year}-01-01`;
    const yearEnd = `${year}-12-31`;
    const yearCompletions = getCompletionsForRange(yearStart, yearEnd);
    
    const completionsByDate = new Map<string, number>();
    yearCompletions.forEach(c => {
      const count = completionsByDate.get(c.date) || 0;
      completionsByDate.set(c.date, count + 1);
    });

    const activeHabits = habits.filter(h => !h.archived);
    const totalPossible = activeHabits.length * 365;
    const totalCompleted = yearCompletions.length;
    
    return {
      totalCompleted,
      totalPossible,
      overallRate: totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0,
      completionsByDate,
      activeDays: completionsByDate.size,
    };
  }, [habits, getCompletionsForRange]);

  // Get monthly statistics
  const getMonthlyStats = useCallback((year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
    
    const dailyStats = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${monthPrefix}-${String(day).padStart(2, '0')}`;
      dailyStats.push(getDateProgress(date));
    }
    
    return dailyStats;
  }, [getDateProgress]);

  return {
    habits: habits.filter(h => !h.archived),
    allHabits: habits,
    completions,
    isLoaded,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    isCompleted,
    getDateProgress,
    getCompletionsForRange,
    getYearStats,
    getMonthlyStats,
  };
}
