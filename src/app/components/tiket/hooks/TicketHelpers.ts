// components/TicketHelpers.ts
export function formatDate(dateStr?: string | Date | null): string {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTime(timeStr?: string | Date | null): string {
  if (!timeStr) return "N/A";

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (typeof timeStr === "string") {
    // Expecting "HH:MM" or "HH:MM:SS"
    const parts = timeStr.split(":").map(Number);
    [hours, minutes, seconds] = parts;
  } else if (timeStr instanceof Date) {
    hours = timeStr.getHours();
    minutes = timeStr.getMinutes();
    seconds = timeStr.getSeconds();
  }

  const date = new Date();
  date.setHours(hours, minutes, seconds);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}


export const formatDateTime = (value?: string) => {
  if (!value) return "";

  const d = new Date(value);
  if (isNaN(d.getTime())) return value;

  return d.toLocaleString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // ✅ AM / PM
  });
};
