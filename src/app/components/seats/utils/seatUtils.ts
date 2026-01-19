// ----------------- Helper utilities -----------------

/**
 * Seat interface for typing
 */
interface Seat {
  pos_row: number;
  pos_col: number;
  seat_number: string;
}

/**
 * Convert 12-hour time string (e.g., "2:30 PM") to 24-hour format "HH:MM:SS"
 */
export const to24Hour = (timeStr: string | null): string | null => {
  if (!timeStr) return null;

  const [time, modifier] = timeStr.split(" ");
  if (!time || !modifier) return null;

  let [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;

  const m = modifier.toUpperCase();
  if (m === "PM" && hours < 12) hours += 12;
  if (m === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:00`;
};

/**
 * Read JSON data from localStorage safely
 */
export const readJSON = <T>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Write JSON data to localStorage safely
 */
export const writeJSON = <T>(key: string, val: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn("Failed to persist", key, e);
  }
};

/**
 * Group flat seat list by row
 */
export const groupSeatsByRow = (seats: Seat[] = []): Record<number, Seat[]> => {
  return seats.reduce((acc: Record<number, Seat[]>, seat) => {
    const row = seat.pos_row;
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});
};

/**
 * Flatten seat layout into ordered seat IDs
 * Sorted by column first, then row (vertical scan)
 */
export const layoutToOrderedSeats = (
  layout: Record<string, Seat[]>
): string[] => {
  const all: { id: string; row: number; col: number }[] = [];

  Object.values(layout).forEach((rowSeats) => {
    rowSeats.forEach((s) =>
      all.push({ id: s.seat_number, row: s.pos_row, col: s.pos_col })
    );
  });

  all.sort((a, b) => (a.col === b.col ? a.row - b.row : a.col - b.col));

  return all.map((x) => x.id);
};
