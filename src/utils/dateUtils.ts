import { Habit } from '../types';

export function getTodayStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateStr(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculates current streak and longest streak for a habit
 */
export function calculateStreak(completedDates: string[], todayStr: string): {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate30Days: number;
  completedToday: boolean;
} {
  const dateSet = new Set(completedDates);
  const completedToday = dateSet.has(todayStr);
  const totalCompletions = completedDates.length;

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(todayStr);

  // If today is not completed, start checking from yesterday
  if (!completedToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const yyyy = checkDate.getFullYear();
    const mm = String(checkDate.getMonth() + 1).padStart(2, '0');
    const dd = String(checkDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    if (dateSet.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  if (completedDates.length > 0) {
    const sortedDates = [...completedDates].sort();
    let tempStreak = 0;
    let prevDate: Date | null = null;

    for (const dStr of sortedDates) {
      const parts = dStr.split('-');
      const currDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffTime = currDate.getTime() - prevDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      prevDate = currDate;
    }
  }

  // Calculate last 30 days completion rate
  let last30Completed = 0;
  const t = new Date(todayStr);
  for (let i = 0; i < 30; i++) {
    const d = new Date(t);
    d.setDate(d.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    if (dateSet.has(`${yyyy}-${mm}-${dd}`)) {
      last30Completed++;
    }
  }
  const completionRate30Days = Math.round((last30Completed / 30) * 100);

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate30Days,
    completedToday,
  };
}

export interface MatrixCell {
  dateStr: string;
  isCompleted: boolean;
  isToday: boolean;
  isFuture: boolean;
  formattedDate: string;
  dayOfWeek: number; // 0 = Sun, 6 = Sat
}

/**
 * Builds a 2D matrix (rows x cols) ending on today.
 * The matrix displays a grid of dots like in the attached screenshot.
 * Defaults to 6 rows x 22 columns = 132 total days.
 */
export function buildDotMatrix(
  completedDates: string[],
  todayStr: string,
  rows: number = 6,
  cols: number = 22
): MatrixCell[][] {
  const dateSet = new Set(completedDates);
  const totalCells = rows * cols;

  const todayDate = new Date(todayStr);
  const cells: MatrixCell[] = [];

  // Generate cells from oldest (leftmost top) to newest (bottom right = today)
  for (let i = totalCells - 1; i >= 0; i--) {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - i);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const isToday = dateStr === todayStr;
    const isFuture = d.getTime() > todayDate.getTime();
    const isCompleted = dateSet.has(dateStr);

    cells.push({
      dateStr,
      isCompleted,
      isToday,
      isFuture,
      formattedDate: formatDateStr(dateStr),
      dayOfWeek: d.getDay(),
    });
  }

  // Organize cells into a 2D matrix (rows x cols) where:
  // Column-major or Row-major order:
  // In contribution grids, items are often organized by columns (each col is a period)
  // or by row-major grid. In the attached screenshot, the grid is a uniform grid of dots filling rows and columns cleanly.
  // We construct `rows` arrays, each containing `cols` items.
  const matrix: MatrixCell[][] = [];

  for (let r = 0; r < rows; r++) {
    const rowCells: MatrixCell[] = [];
    for (let c = 0; c < cols; c++) {
      const index = c * rows + r;
      if (index < cells.length) {
        rowCells.push(cells[index]);
      }
    }
    matrix.push(rowCells);
  }

  return matrix;
}
