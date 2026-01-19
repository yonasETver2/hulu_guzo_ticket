// Bus code options
export const busCode = [{ option: "Large Bus" }, { option: "Min Bus" }];

//month of the year
export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**year generator */
export const currentYear = new Date().getFullYear();
const startYear = currentYear - 20; // 20 years before
const endYear = currentYear + 5; // 5 years after

const years = Array.from(
  { length: endYear - startYear + 1 }, // total number of years
  (_, i) => startYear + i
);

export const yearOptions = years
  .slice() // make a copy to avoid mutating original
  .sort((a, b) => b - a) // sort descending
  .map((year) => ({
    value: year,
    label: year.toString(),
  }));

export const busLayout = {
  "Large Bus": {
    totalSeats: 64,
    rowSeats: { 1: 17, 2: 17, 3: 1, 4: 17, 5: 17 },
    blankIndices: { 4: [2, 9, 17], 5: [2, 9] },
  },
  "Min Bus": {
    totalSeats: 45,
    rowSeats: { 1: 12, 2: 12, 3: 1, 4: 12, 5: 12 },
    blankIndices: { 4: [7, 12], 5: [7] },
  },
};

//gregorian
export const GREG_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const GREG_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//ethiopian month
export const ETH_MONTHS = [
  "መስከረም",
  "ጥቅምት",
  "ኅዳር",
  "ታኅሣሥ",
  "ጥር",
  "የካቲት",
  "መጋቢት",
  "ሚያዝያ",
  "ግንቦት",
  "ሰኔ",
  "ሐምሌ",
  "ነሐሴ",
  "ጳጉሜ",
];

//ethiopian week day
export const ETH_WEEKDAYS = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];

type EthiopianDate = {
  year: number;
  month: number; // 1–13
  day: number;
};

//from gregorian ethiopian date
function gregorianToEthiopian(date: Date): EthiopianDate {
  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth() + 1; // JS months are 0-based
  const gregorianDay = date.getDate();

  // Ethiopian new year in Gregorian calendar
  const isGregorianLeap =
    (gregorianYear % 4 === 0 && gregorianYear % 100 !== 0) ||
    gregorianYear % 400 === 0;

  const ethiopianNewYearDay = isGregorianLeap ? 12 : 11;

  // Days from Sept 11/12 to the given date
  const gregorianNewYear = new Date(
    gregorianYear,
    8, // September
    ethiopianNewYearDay
  );

  let daysDiff = Math.floor(
    (date.getTime() - gregorianNewYear.getTime()) / (1000 * 60 * 60 * 24)
  );

  let ethiopianYear = gregorianYear - (daysDiff >= 0 ? 7 : 8);

  if (daysDiff < 0) {
    // date is before Ethiopian New Year
    const prevNewYear = new Date(
      gregorianYear - 1,
      8,
      (gregorianYear - 1) % 4 === 0 ? 12 : 11
    );

    daysDiff = Math.floor(
      (date.getTime() - prevNewYear.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  const ethiopianMonth = Math.floor(daysDiff / 30) + 1;
  const ethiopianDay = (daysDiff % 30) + 1;

  return {
    year: ethiopianYear,
    month: ethiopianMonth,
    day: ethiopianDay,
  };
}

type EthiopianTime = {
  hour: number; // 1–12
  minute: number;
  period: "day" | "night";
};

// from gregorian to ethiopian time
function gregorianToEthiopianTime(date: Date): EthiopianTime {
  const gHour = date.getHours();
  const minute = date.getMinutes();

  // Ethiopian hour calculation
  let ethHour = (gHour + 6) % 12;
  if (ethHour === 0) ethHour = 12;

  // Day: 6:00 AM – 5:59 PM
  const period = gHour >= 6 && gHour < 18 ? "day" : "night";

  return {
    hour: ethHour,
    minute,
    period,
  };
}

export const formatEthiopianTime = (date: Date): string => {
  const eth = gregorianToEthiopianTime(date);

  return `${eth.period === "day" ? "ቀን" : "ምሽት"} ${eth.hour}:${eth.minute
    .toString()
    .padStart(2, "0")} `;
};

//pars am pm format
export const parseAmPmTime = (time: string): Date => {
  const [timePart, modifier] = time.split(" "); // "02:30", "PM"
  let [hour, minute] = timePart.split(":").map(Number);

  if (modifier === "PM" && hour !== 12) hour += 12;
  if (modifier === "AM" && hour === 12) hour = 0;

  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
};

type EthiopianDateTime = {
  year: number;
  month: number; // 1–13
  day: number;
  hour: number;
  minute: number;
  period: "day" | "night";
  weekday: number; // 0–6
};

//from ethiopian to gregorian date time
function gregorianToEthiopianDateTime(date: Date): EthiopianDateTime {
  const gYear = date.getFullYear();
  const gHour = date.getHours();
  const minute = date.getMinutes();
  const weekday = date.getDay(); // ✅ weekday number

  const isGregorianLeap =
    (gYear % 4 === 0 && gYear % 100 !== 0) || gYear % 400 === 0;

  const ethiopianNewYearDay = isGregorianLeap ? 12 : 11;
  const newYear = new Date(gYear, 8, ethiopianNewYearDay);

  let daysDiff = Math.floor(
    (date.getTime() - newYear.getTime()) / (1000 * 60 * 60 * 24)
  );

  let ethYear = gYear - (daysDiff >= 0 ? 7 : 8);

  if (daysDiff < 0) {
    const prevNewYear = new Date(gYear - 1, 8, (gYear - 1) % 4 === 0 ? 12 : 11);

    daysDiff = Math.floor(
      (date.getTime() - prevNewYear.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  const ethMonth = Math.floor(daysDiff / 30) + 1;
  const ethDay = (daysDiff % 30) + 1;

  let ethHour = (gHour + 6) % 12;
  if (ethHour === 0) ethHour = 12;

  const period = gHour >= 6 && gHour < 18 ? "day" : "night";

  return {
    year: ethYear,
    month: ethMonth,
    day: ethDay,
    hour: ethHour,
    minute,
    period,
    weekday, // ✅ added
  };
}

export const formatEthiopianDate = (date: Date): string => {
  const eth = gregorianToEthiopianDateTime(date);
  return `${ETH_WEEKDAYS[eth.weekday]}፣ ${ETH_MONTHS[eth.month - 1]} ${
    eth.day
  }፣  ${eth.year}`;
};

// Convert Gregorian date to Ethiopian date

export function gregorianToEthiopianDate(date: Date): EthiopianDate {
  const gYear = date.getFullYear();
  const isGregorianLeap =
    (gYear % 4 === 0 && gYear % 100 !== 0) || gYear % 400 === 0;

  const ethiopianNewYearDay = isGregorianLeap ? 12 : 11;
  const newYear = new Date(gYear, 8, ethiopianNewYearDay);

  let daysDiff = Math.floor(
    (date.getTime() - newYear.getTime()) / (1000 * 60 * 60 * 24)
  );

  let ethYear = gYear - (daysDiff >= 0 ? 7 : 8);

  if (daysDiff < 0) {
    const prevNewYear = new Date(gYear - 1, 8, (gYear - 1) % 4 === 0 ? 12 : 11);

    daysDiff = Math.floor(
      (date.getTime() - prevNewYear.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  return {
    year: ethYear,
    month: Math.floor(daysDiff / 30) + 1,
    day: (daysDiff % 30) + 1,
  };
}

export function getDaysInMonth(month: number, year: number): number {
  if (month === 13) return year % 4 === 3 ? 6 : 5; // Pagume leap
  return 30;
}

// Convert Ethiopian date to Gregorian
export function ethiopianToGregorian(ethDate: EthiopianDate): Date {
  const { year: eYear, month: eMonth, day: eDay } = ethDate;

  const approxGYear = eYear + 7;
  const isLeap =
    (approxGYear % 4 === 0 && approxGYear % 100 !== 0) ||
    approxGYear % 400 === 0;
  const newYearDay = isLeap ? 12 : 11;
  const newYear = new Date(approxGYear, 8, newYearDay);

  const daysFromNewYear = (eMonth - 1) * 30 + (eDay - 1);
  const gDate = new Date(newYear);
  gDate.setDate(newYear.getDate() + daysFromNewYear);

  return gDate;
}
