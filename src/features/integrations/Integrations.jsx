import React, { useState } from "react";
import { BrokerIntegration } from "./brokers/BrokersIntegration";
import {
  ChevronRight,
  Sheet,
  FileSpreadsheet,
  RefreshCw,
  Clock,
  CheckCircle2,
} from "lucide-react";

// ---------- Sheet Connect Card ----------

function SheetCard({
  name = "Google Sheets",
  driveName = "",
  onClick = () => null,
  connected = false,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 32px rgba(0,0,0,0.10)"
          : "0 1px 4px rgba(0,0,0,0.04)",
      }}
      className="group relative flex items-center gap-5 px-6 py-4 rounded-xl border border-(--border) bg-(--surface) text-left w-full"
    >
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md">
          <Sheet size={20} className="text-white" />
        </div>
        <span
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-(--surface) ${
            connected ? "bg-emerald-500" : "bg-(--border)"
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-(--text) text-sm leading-snug tracking-tight">
          {name}
        </p>
        <p className="text-xs text-(--text-muted) mt-0.5 font-normal">
          {connected
            ? "Connected · syncing automatically"
            : `Connect via Google Drive${driveName ? ` · ${driveName}` : ""}`}
        </p>
      </div>

      {connected ? (
        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
      ) : (
        <ChevronRight
          size={16}
          className="text-(--text-muted) group-hover:text-(--text) transition-colors"
        />
      )}
    </button>
  );
}

// ---------- Feature Row ----------

function FeatureRow({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-(--surface-muted) border border-(--border) flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={14} className="text-(--text-muted)" />
      </div>
      <div>
        <p className="text-sm font-medium text-(--text) leading-snug">
          {title}
        </p>
        <p className="text-xs text-(--text-muted) mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

// ---------- Divider ----------

function Divider({ label }) {
  return (
    <div className="flex items-center gap-4 w-full my-2">
      <div className="flex-1 h-px bg-(--border)" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)">
        {label}
      </span>
      <div className="flex-1 h-px bg-(--border)" />
    </div>
  );
}

// ---------- Mapping Section ----------

function MappingSection() {
  return (
    <div className="w-full mt-2">
      <div className="rounded-xl border border-(--border) bg-(--surface-muted) overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--border)">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-(--text) tracking-tight">
              Google Sheets · Connected
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-(--text-muted) font-medium">
            Column Mapping
          </span>
        </div>

        <div className="divide-y divide-(--border)">
          {[
            { source: "Date", target: "Transaction Date" },
            { source: "Symbol", target: "Ticker" },
            { source: "Quantity", target: "Shares" },
            { source: "Price", target: "Fill Price" },
          ].map(({ source, target }) => (
            <div key={source} className="flex items-center px-6 py-3.5 gap-4">
              <span className="w-32 text-sm text-(--text-muted) font-mono">
                {source}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-(--text-muted) flex-shrink-0"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm text-(--text) font-medium">
                {target}
              </span>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-(--border) flex justify-end">
          <button className="px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
            Confirm Mapping
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Data Sources Section ----------

function DataSourcesSection({ onConnect, connected }) {
  return (
    <div className="border border-(--border) rounded-xl overflow-hidden">
      {/* Section header */}
      <div className="px-6 py-4 border-b border-(--border) bg-(--surface-muted) flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-(--text) tracking-tight">
            Data Sources
          </h3>
          <p className="text-xs text-(--text-muted) mt-0.5">
            Import your transaction history from external spreadsheets
          </p>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border border-(--border) text-(--text-muted)">
          {connected ? "1 connected" : "0 connected"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-(--border)">
        {/* Left: connect card + supported formats */}
        <div className="p-6 flex flex-col gap-5 bg-(--surface-muted)">
          <SheetCard
            name="Google Sheets"
            onClick={onConnect}
            connected={connected}
          />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted) mb-3">
              Supported Formats
            </p>
            <div className="flex flex-wrap gap-2">
              {[".xlsx", ".csv", ".gsheet", "Google Drive"].map((fmt) => (
                <span
                  key={fmt}
                  className="text-xs px-2.5 py-1 rounded-md border border-(--border) text-(--text-muted) bg-(--surface) font-mono"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: how it works */}
        <div className="p-6 flex flex-col gap-5 bg-(--surface)">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-(--text-muted)">
            How It Works
          </p>
          <div className="flex flex-col gap-4">
            <FeatureRow
              icon={FileSpreadsheet}
              title="Map your columns"
              description="Match your spreadsheet headers to our standard transaction fields in one step."
            />
            <FeatureRow
              icon={RefreshCw}
              title="Auto-sync on change"
              description="We watch your sheet for updates and re-import transactions automatically."
            />
            <FeatureRow
              icon={Clock}
              title="Full history import"
              description="Pull in years of historical trades and positions on the first connection."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Page ----------

export default function IntegrationsPage() {
  const [step, setStep] = useState("connect");
  const [connected, setConnected] = useState(false);

  function handleGoogleConnect() {
    setConnected(true);
    setStep("mapping");
  }

  return (
    <div className="min-h-[82vh] bg-(--surface)">
      <div className="mx-auto px-4 sm:px-8 flex flex-col gap-6">
        {/* Brokers */}
        <div>
          <BrokerIntegration />
        </div>
      </div>
    </div>
  );
}

// {/* Data Sources */}
// <DataSourcesSection
//   onConnect={handleGoogleConnect}
//   connected={connected}
// />

// {/* Mapping */}
// {step === "mapping" && (
//   <div>
//     <Divider label="Column Mapping" />
//     <MappingSection />
//   </div>
// )}
