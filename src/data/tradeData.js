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

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatTimeWithSeconds(date) {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(
    date.getSeconds()
  )}`;
}

function getRandomTradingDuration() {
  const start = new Date();
  start.setHours(9, 15, 0, 0); // 09:15:00

  const end = new Date();
  end.setHours(15, 30, 0, 0); // 15:30:00

  // random entry time (ms precision)
  const entry = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );

  // duration between 5 and 60 minutes, with seconds precision
  const durationSeconds = Math.floor(Math.random() * (56 * 60)) + 5 * 60;

  const exit = new Date(entry.getTime() + durationSeconds * 1000);

  return {
    entryTime: formatTimeWithSeconds(entry), // "HH:mm:ss"
    exitTime: formatTimeWithSeconds(exit), // "HH:mm:ss"
    durationSeconds, // number
    durationMinutes: +(durationSeconds / 60).toFixed(2),
  };
}

const days = 100;
const dateBeforeDays = getDateBeforeDays(days);

let cumulativePnl = 0;
let capital = 15000;

const fix = (v) => +parseFloat(v).toFixed(2);

const randomPrice = (min = 100, max = 400) =>
  fix(Math.random() * (max - min) + min);

const randomQty = () => {
  const values = [10, 15, 20, 25, 30];
  return values[Math.floor(Math.random() * values.length)];
};

const randomSymbol = (num) => {
  if (num >= 0 && num <= 0.33) return "Nifty 50";
  else if (num > 0.33 && num <= 0.66) return "BANKNIFTY";
  else return "SENSEX";
};

export const tradeData = Array.from({ length: days }).map((_, i) => {
  const num = Math.random();
  const tradeId = `T00${i + 1}`;
  const date = generateDate(dateBeforeDays, i);

  const risk = 500;

  const qty = randomQty(); // 10–30
  const entry = randomPrice(100, 400); // base price

  // 🔒 exit move: max risk / qty pts down, 100 pts up
  const move = randomPrice(-risk / qty, 100);
  const exit = num > 0.5 ? fix(-risk / qty + entry) : fix(entry + move);

  // ✅ derived PnL
  const pnl = fix((exit - entry) * qty);

  const { entryTime, exitTime, durationSeconds } = getRandomTradingDuration();
  const charges = fix(65 + num * 10);
  const trade = `Trade ${i + 1}`;
  const rr = fix(pnl / risk);

  cumulativePnl = fix(cumulativePnl + pnl);
  capital = fix(capital + pnl);

  if (i === 0) {
    console.log(entryTime, exitTime, durationSeconds);
  }

  return {
    "Trade Id": tradeId,
    Date: date,
    "Entry Time": entryTime,
    "Exit Time": exitTime,
    Duration: durationSeconds,
    Symbol: randomSymbol(num),
    Entry: entry,
    Exit: exit,
    Qty: qty,
    SL: exit - entry,
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
