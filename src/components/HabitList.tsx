import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Habit } from '@/types/habit';

interface HabitListProps {
  habits: Habit[];
  selectedDate: string;
  onAddHabit: (name: string, color: string) => void;
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
  onDeleteHabit: (id: string) => void;
  onToggleCompletion: (habitId: string, date: string) => void;
  isCompleted: (habitId: string, date: string) => boolean;
}

const HABIT_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Yellow', value: '#eab308' },
];

export function HabitList({
  habits,
  selectedDate,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onToggleCompletion,
  isCompleted,
}: HabitListProps) {
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0].value);
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim(), selectedColor);
      setNewHabitName('');
      setSelectedColor(HABIT_COLORS[0].value);
      setIsDialogOpen(false);
    }
  };

  const handleStartEdit = (habit: Habit) => {
    setEditingHabit(habit.id);
    setEditName(habit.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      onUpdateHabit(id, { name: editName.trim() });
    }
    setEditingHabit(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingHabit(null);
    setEditName('');
  };

  const completedCount = habits.filter(h => isCompleted(h.id, selectedDate)).length;
  const progress = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Header with Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Daily Habits</h3>
          <p className="text-sm text-slate-400">
            {completedCount} of {habits.length} completed
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Habit Name</label>
                <Input
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g., Read 30 minutes"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Color</label>
                <div className="flex flex-wrap gap-2">
                  {HABIT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`
                        w-8 h-8 rounded-full transition-all duration-200
                        ${selectedColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}
                      `}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <Button 
                onClick={handleAddHabit}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                disabled={!newHabitName.trim()}
              >
                Add Habit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Bar */}
      {habits.length > 0 && (
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Habit Items */}
      <div className="space-y-2">
        {habits.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No habits yet. Add your first habit to get started!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const isDone = isCompleted(habit.id, selectedDate);
            const isEditing = editingHabit === habit.id;

            return (
              <div
                key={habit.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  ${isDone ? 'bg-slate-800/60' : 'bg-slate-800/30'}
                  hover:bg-slate-800/80
                `}
              >
                {/* Checkbox */}
                <button
                  onClick={() => onToggleCompletion(habit.id, selectedDate)}
                  className={`
                    w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200
                    ${isDone 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-700 border border-slate-600 hover:border-blue-500'
                    }
                  `}
                >
                  {isDone && <Check className="h-4 w-4" />}
                </button>

                {/* Habit Name / Edit Input */}
                {isEditing ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-slate-800 border-slate-700 text-white h-8"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(habit.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSaveEdit(habit.id)}
                      className="h-8 w-8 text-green-400 hover:text-green-300"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      className="h-8 w-8 text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span 
                      className={`
                        flex-1 text-sm transition-all duration-200
                        ${isDone ? 'text-slate-400 line-through' : 'text-white'}
                      `}
                    >
                      {habit.name}
                    </span>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-slate-400 hover:text-white"
                          >
                            <Palette className="h-3.5 w-3.5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto bg-slate-900 border-slate-700 p-2">
                          <div className="flex flex-wrap gap-1">
                            {HABIT_COLORS.map((color) => (
                              <button
                                key={color.value}
                                onClick={() => onUpdateHabit(habit.id, { color: color.value })}
                                className={`
                                  w-6 h-6 rounded-full transition-all
                                  ${habit.color === color.value ? 'ring-2 ring-white' : ''}
                                `}
                                style={{ backgroundColor: color.value }}
                              />
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEdit(habit)}
                        className="h-7 w-7 text-slate-400 hover:text-white"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDeleteHabit(habit.id)}
                        className="h-7 w-7 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
