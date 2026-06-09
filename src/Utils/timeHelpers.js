// Get current UK (GMT/BST) hour and minute
export const getUKHourMinute = () => {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const h = parseInt(parts.find((p) => p.type === "hour").value, 10);
  const m = parseInt(parts.find((p) => p.type === "minute").value, 10);
  return { h, m };
};

// Computes the minimum selectable time boundary (Current UK time + 4 hours)
export const getMinimumBookingTime = () => {
  const { h: ukH, m: ukM } = getUKHourMinute();
  
  // Add 4 hours (240 mins), round UP to next 30-min boundary
  const totalMins = ukH * 60 + ukM + 240;
  const roundedMins = Math.ceil(totalMins / 30) * 30;
  
  const minHour24 = Math.floor(roundedMins / 60) % 24;
  const minMinute = roundedMins % 60;
  
  return {
    roundedMins,
    minHour24,
    minMinute,
    isTomorrow: roundedMins >= 1440
  };
};
