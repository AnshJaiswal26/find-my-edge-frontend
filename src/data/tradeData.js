const generateDate = (startDate, i) => {
  const today = new Date(startDate);
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  return new Date(year, month, day + i).toISOString().split("T")[0];
};

const getDateBeforeDays = (daysBefore) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - daysBefore);
  const date = currentDate.toISOString().split("T")[0];

  return date;
};

function getRandomTradingDuration() {
  const start = new Date();
  start.setHours(9, 15, 0, 0);

  const end = new Date();
  end.setHours(15, 30, 0, 0);

  const entry = new Date(start.getTime() + Math.random() * (end - start));
  const durationMinutes = Math.floor(Math.random() * 56) + 5;
  const exit = new Date(entry.getTime() + durationMinutes * 60000);

  return {
    entry: entry.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    exit: exit.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

const days = 100;
const dateBeforeDays = getDateBeforeDays(days);

let cumulativePnl = 0;
let capital = 15000;

export const tradeData = Array.from({ length: days }).map((_, i) => {
  const fix = (v) => +parseFloat(v).toFixed(2);

  const num = Math.random();
  const tradeId = `T00${i + 1}`;
  const date = generateDate(dateBeforeDays, i);
  const risk = 500;
  const pnl = fix(num <= 0.4 ? num * 10 * risk : -(410 + num * 100));
  const { entry, exit } = getRandomTradingDuration();
  const entryTime = entry;
  const exitTime = exit;
  const charges = fix(65 + num * 10);
  const trade = `Trade ${i + 1}`;
  const rr = fix(pnl / risk);

  cumulativePnl = fix(cumulativePnl + pnl);
  capital = fix(capital + pnl);

  return {
    "Trade Id": tradeId,
    Date: date,
    "Entry Time": entryTime,
    "Exit Time": exitTime,
    Pnl: pnl,
    "Cummulative Pnl": cumulativePnl,
    Profit: pnl > 0 ? pnl : 0,
    Loss: pnl < 0 ? pnl : 0,
    Risk: risk,
    Charges: charges,
    Trade: trade,
    "Risk/Reward": rr,
    Capital: capital,
  };
});

console.log(tradeData);
console.log(+tradeData.reduce((acc, r) => r.Pnl + acc, 0).toFixed(2));
