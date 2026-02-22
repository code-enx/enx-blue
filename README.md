# enx-blue 🎯

A beautiful daily habit tracker with GitHub-style contribution calendar, task management, and performance analytics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

## ✨ Features

- **📅 GitHub-Style Calendar** - Visual heatmap showing daily habit completion
- **✅ Habit Management** - Add, edit, delete habits with custom colors
- **📊 Performance Analytics** - Charts showing weekly, monthly, and yearly progress
- **📆 Date Navigation** - Browse and manage habits for any date
- **💾 Local Storage** - All data persists in your browser
- **📱 Responsive Design** - Works on desktop and mobile

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/enx-blue.git

# Navigate to project
cd enx-blue

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 3.4
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Date Handling:** date-fns
- **Icons:** Lucide React

## 📁 Project Structure

```
enx-blue/
├── src/
│   ├── components/
│   │   ├── ContributionCalendar.tsx  # GitHub-style calendar
│   │   ├── HabitList.tsx             # Habit management
│   │   ├── PerformanceCharts.tsx     # Analytics charts
│   │   └── DateSelector.tsx          # Date picker
│   ├── hooks/
│   │   └── useHabitStorage.ts        # LocalStorage hook
│   ├── types/
│   │   └── habit.ts                  # TypeScript types
│   ├── App.tsx                       # Main app
│   └── index.css                     # Global styles
├── dist/                             # Build output
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🌐 Deployment

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Framework: Vite
5. Build Command: `npm run build`
6. Output Directory: `dist`

### Option 2: Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub repo
4. Build Command: `npm run build`
5. Publish Directory: `dist`

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build"
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Deploy to GitHub Pages |

## 🎨 Customization

### Changing Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#3b82f6',
        foreground: '#ffffff',
      },
    },
  },
}
```

### Adding New Habit Colors

Edit `src/components/HabitList.tsx`:

```typescript
const HABIT_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  // Add your colors here
];
```

## 🔒 Data Storage

All habit data is stored in your browser's `localStorage`:

- `enx-blue-habits` - Your habit list
- `enx-blue-completions` - Completion records

**Note:** Data is tied to the domain. Clearing browser data will erase your habits.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Recharts](https://recharts.org/) for chart components
- [date-fns](https://date-fns.org/) for date manipulation

---

Made with ❤️ by enx
