import React, { useEffect, useState } from "react";
import styles from "./SheetIntegration.module.css";
import { Button, InputField, Select } from "@ui";

// Small UI helpers
function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl shadow-sm bg-white p-6 ${className}`}>
      {children}
    </div>
  );
}

function SheetButton({
  name = "Google Sheets",
  driveName = "",
  onClick = () => null,
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-6 rounded-lg border hover:shadow-sm bg-[var(--color-bg-container)]"
    >
      <div
        className={`w-10 h-10 rounded-md ${
          name === "Google Sheets" ? "bg-emerald-600" : "bg-emerald-700"
        } flex items-center justify-center text-white font-bold`}
      >
        {name === "Google Sheets" ? "G" : "X"}
      </div>
      <div className="text-left">
        <div className="font-semibold text-lg">Connect to {name}</div>
        <div className="text-sm text-[var(--color-text-label)]">
          Use Google Drive spreadsheets {driveName}
        </div>
      </div>
    </button>
  );
}

export default function SheetIntegration() {
  // high-level step
  const [step, setStep] = useState("connect"); // 'connect' | 'mapping'

  // connection state
  const [provider, setProvider] = useState(null); // 'google' | 'excel'
  const [account, setAccount] = useState(null);

  // connect page options
  const [enableSync, setEnableSync] = useState(true);
  const [frequency, setFrequency] = useState("Daily");
  const [sheetName, setSheetName] = useState("");

  // mapping state
  const [sheets, setSheets] = useState([]);
  const [columns, setColumns] = useState([]);
  const tradeFields = [
    "tradeId",
    "date",
    "entryTime",
    "exitTime",
    "pnl",
    "cumulativePnl",
    "profit",
    "loss",
    "symbol",
    "strategy",
  ];
  const [mapping, setMapping] = useState({});

  // ----------------- Mock helpers (replace these with real calls) -----------------
  function prettyFieldName(field) {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (s) => s.toUpperCase())
      .trim();
  }

  function mockConnect(which) {
    setProvider(which);
    // simulate an auth/network flow
    setTimeout(() => {
      setAccount(which === "google" ? "ansh@gmail.com" : "Ansh - OneDrive");
      const mockSheets = [
        { name: "Trades", id: "sheet_trades" },
        { name: "DailySummary", id: "sheet_summary" },
        { name: "Export_1", id: "sheet_export_1" },
      ];
      const mockColumns = [
        "Trade Id",
        "Date",
        "Entry Time",
        "Exit Time",
        "PnL",
        "Cumulative Pnl",
        "Profit",
        "Loss",
      ];
      setSheets(mockSheets);
      setColumns(mockColumns);
      setSheetName(mockSheets[0].name);

      // auto-map by name if possible
      const initial = {};
      tradeFields.forEach((f) => {
        const pretty = prettyFieldName(f);
        const found = mockColumns.find((c) =>
          c.toLowerCase().includes(pretty.toLowerCase())
        );
        initial[f] = found || "";
      });
      setMapping(initial);
      setStep("mapping");
    }, 700);
  }

  // ----------------- Connect Page -----------------
  function ConnectPage() {
    return (
      <div className="max-w-5xl mx-auto py-12 px-6 text-[var(--color-text-heading)]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Connect</h1>
          <p className="mt-3 text-[var(--color-text-label)]">
            Connect to Google Sheets or Microsoft Excel to map trades and inject
            your trade data into sheets.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <SheetButton
            name="Google Sheets"
            driveName="Use Google Drive spreadsheets"
            onClick={() => mockConnect("google")}
          />

          <SheetButton
            name="Microsoft Excel"
            driveName="Use OneDrive / Excel Online"
            onClick={() => mockConnect("excel")}
          />
        </div>

        <hr className="my-6" />

        <div className="grid grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="text-2xl font-medium mb-3">Options</h3>
            <label className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={enableSync}
                onChange={(e) => setEnableSync(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="ml-1">Enable sync</span>
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="ml-1">Frequency (enable to edit)</span>
            </label>
          </div>

          <div>
            <InputField
              labelPosition="top"
              label={"Sheet Name"}
              value={""}
              placeholder="Sheet name"
              onChange={(v) => setSheetName(v)}
              className="bg-[inherit] w-[505px] p-3 rounded-[0.5rem]"
            />

            <label className="block mt-3 mb-2 text-sm text-gray-600">
              Frequency
            </label>

            <Select
              value={"Hourly"}
              options={["Hourly", "Daily", "Every 6 hours", "Manual"]}
              buttonClass="p-3 rounded-[0.5rem]"
            />

            <div className="mt-4 text-right">
              <Button
                text={"Save Options"}
                color={"var(--color-green)"}
                onClick={() =>
                  alert("This is mock. Choose a provider to connect.")
                }
                className={"px-3 py-2"}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------- Mapping Page -----------------
  function MappingPage() {
    function updateMapping(field, col) {
      setMapping((m) => ({ ...m, [field]: col }));
    }
    function addColumn() {
      const newCol = `Column_${columns.length + 1}`;
      setColumns((c) => [...c, newCol]);
    }
    function removeColumn(idx) {
      const removed = columns[idx];
      setColumns((c) => c.filter((_, i) => i !== idx));
      setMapping((m) => {
        const copy = { ...m };
        Object.keys(copy).forEach((k) => {
          if (copy[k] === removed) copy[k] = "";
        });
        return copy;
      });
    }
    function previewRow() {
      const example = {
        tradeId: "T011",
        date: "2025-08-21",
        entryTime: "11:33 am",
        exitTime: "11:54 am",
        pnl: "695.31",
        cumulativePnl: "-264.28",
        profit: "695.31",
        loss: "0",
        symbol: "BANKNIFTY",
        strategy: "scalping",
      };
      return columns.map((col) => {
        const field = Object.keys(mapping).find((f) => mapping[f] === col);
        return field ? example[field] : "";
      });
    }
    function saveMapping() {
      // call your backend to save mapping and schedule sync
      console.log("Save mapping", {
        provider,
        account,
        sheetName,
        mapping,
        enableSync,
        frequency,
      });
      alert("Mapping saved (mock). Replace with real backend call.");
    }

    const preview = previewRow();

    return (
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Mapping & Sync</h2>
            <div className="text-sm text-gray-600">
              Connected: {account} ({provider})
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep("connect")}
              className="px-4 py-2 rounded-md border bg-white"
            >
              Disconnect / Back
            </button>
            <button
              onClick={saveMapping}
              className="px-4 py-2 rounded-md bg-blue-600 text-white"
            >
              Save Mapping & Enable Sync
            </button>
          </div>
        </div>

        <Card>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm mb-2">Select Sheet</label>
              <select
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="w-full rounded-md border p-2"
              >
                {sheets.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <div className="mt-4">
                <label className="block text-sm mb-2">Sheet Columns</label>
                <div className="space-y-2">
                  {columns.map((c, i) => (
                    <div key={c + i} className="flex items-center gap-2">
                      <input
                        className="flex-1 rounded-md border p-2"
                        value={c}
                        onChange={(e) =>
                          setColumns((cols) =>
                            cols.map((col, idx) =>
                              idx === i ? e.target.value : col
                            )
                          )
                        }
                      />
                      <button
                        onClick={() => removeColumn(i)}
                        className="px-3 py-1 rounded border bg-red-50 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <button
                    onClick={addColumn}
                    className="px-3 py-2 rounded border bg-gray-50"
                  >
                    Add Column
                  </button>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm mb-2">
                Map your trade fields to sheet columns
              </label>
              <div className="grid grid-cols-2 gap-4">
                {tradeFields.map((f) => (
                  <div key={f} className="p-3 border rounded-md bg-white">
                    <div className="font-medium mb-2">{prettyFieldName(f)}</div>
                    <select
                      value={mapping[f] || ""}
                      onChange={(e) => updateMapping(f, e.target.value)}
                      className="w-full rounded-md border p-2"
                    >
                      <option value="">-- Do not export --</option>
                      {columns.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Preview (single row)</h4>
                <div className="overflow-auto border rounded-md">
                  <table className="min-w-full text-left table-fixed">
                    <thead>
                      <tr>
                        {columns.map((c) => (
                          <th key={c} className="p-3 border-r">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {preview.map((v, i) => (
                          <td key={i} className="p-3 border-r">
                            {v}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setStep("connect")}
                  className="px-4 py-2 rounded border"
                >
                  Back
                </button>
                <button
                  onClick={saveMapping}
                  className="px-4 py-2 rounded bg-green-600 text-white"
                >
                  Save & Enable
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return <div>{step === "connect" ? <ConnectPage /> : <MappingPage />}</div>;
}
