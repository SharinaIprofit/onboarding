"use client";
import { useState } from "react";

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const PORTFOLIO = [
  { name: "Alpha Web App Suite", client: "Nexgen Technologies", health: "On Track", budget: 1850000, spent: 620000, team: 6, sprints: 4, risk: "Low" },
  { name: "Mobile Banking App", client: "FinEdge Solutions", health: "At Risk", budget: 3200000, spent: 1980000, team: 9, sprints: 7, risk: "High" },
  { name: "ERP Integration", client: "ManufactureX Ltd.", health: "On Track", budget: 2750000, spent: 1100000, team: 5, sprints: 5, risk: "Medium" },
  { name: "HR Portal Redesign", client: "TalentFirst Corp.", health: "Delayed", budget: 980000, spent: 890000, team: 4, sprints: 3, risk: "High" },
];

const VELOCITY_DATA = [
  { sprint: "S1", pts: 34, capacity: 40 },
  { sprint: "S2", pts: 30, capacity: 40 },
  { sprint: "S3", pts: 28, capacity: 40 },
  { sprint: "S4", pts: null, capacity: 40 },
];

const COST_TREND = [
  { month: "Feb", budget: 300000, actual: 280000 },
  { month: "Mar", budget: 320000, actual: 315000 },
  { month: "Apr", budget: 310000, actual: 298000 },
  { month: "May", budget: 350000, actual: 340000 },
  { month: "Jun", budget: 330000, actual: 0 },
];

const TEAM_UTIL = [
  { name: "Rahul S.", role: "Backend Lead", util: 91 },
  { name: "Priya M.", role: "Frontend Dev", util: 75 },
  { name: "Amit K.", role: "DevOps", util: 68 },
  { name: "Sneha R.", role: "UI/UX", util: 100 },
  { name: "Vikram P.", role: "Full Stack", util: 83 },
  { name: "Meera J.", role: "QA", util: 55 },
];

const BURNDOWN = [
  { day: "D1", ideal: 120, actual: 120 },
  { day: "D3", ideal: 96, actual: 98 },
  { day: "D5", ideal: 72, actual: 80 },
  { day: "D7", ideal: 48, actual: 65 },
  { day: "D9", ideal: 24, actual: 46 },
  { day: "D11", ideal: 0, actual: null },
];

const RISK_ITEMS = [
  { id: "R1", title: "Scope creep from client requests", project: "Alpha Web App Suite", impact: "High", prob: "High", score: 9 },
  { id: "R2", title: "Third-party API integration failure", project: "Mobile Banking App", impact: "High", prob: "Medium", score: 6 },
  { id: "R3", title: "Team member unavailability", project: "ERP Integration", impact: "Medium", prob: "Low", score: 2 },
  { id: "R4", title: "Budget overrun — HR Portal", project: "HR Portal Redesign", impact: "High", prob: "High", score: 9 },
];

const healthColor: Record<string, string> = {
  "On Track": "bg-green-100 text-green-700",
  "At Risk": "bg-amber-100 text-amber-700",
  "Delayed": "bg-red-100 text-red-700",
};
const riskColor: Record<string, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
};

export default function ExecutiveDashboard() {
  const [activeTab, setActiveTab] = useState<"portfolio" | "charts" | "risk">("portfolio");

  const totalBudget = PORTFOLIO.reduce((a, p) => a + p.budget, 0);
  const totalSpent = PORTFOLIO.reduce((a, p) => a + p.spent, 0);
  const budgetPct = Math.round((totalSpent / totalBudget) * 100);
  const avgUtil = Math.round(TEAM_UTIL.reduce((a, t) => a + t.util, 0) / TEAM_UTIL.length);
  const openRisks = RISK_ITEMS.filter((r) => r.score >= 6).length;

  // SVG chart helpers
  const CHART_W = 520;
  const CHART_H = 180;
  const PAD_L = 50;
  const PAD_T = 20;

  // Velocity chart
  const velMax = 45;
  const velBarW = 40;
  const velGroupW = CHART_W / VELOCITY_DATA.length;
  const completedVel = VELOCITY_DATA.filter((d) => d.pts !== null);

  // Cost trend chart
  const costMax = 400000;
  const costGroupW = CHART_W / COST_TREND.length;
  const cBarW = 28;

  // Burndown chart
  const bdMax = 130;
  const bdGroupW = CHART_W / (BURNDOWN.length - 1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Portfolio overview · 4 active projects</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">As of June 2026</span>
          <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs rounded-lg font-medium">Q2 FY2026</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Portfolio Budget", value: fmt(totalBudget), sub: `${budgetPct}% utilized`, color: "bg-indigo-500", icon: "💼" },
          { label: "Active Sprints", value: "4", sub: "3 on track · 1 delayed", color: "bg-emerald-500", icon: "🏃" },
          { label: "Team Utilization", value: `${avgUtil}%`, sub: `${TEAM_UTIL.filter((t) => t.util >= 90).length} overloaded`, color: avgUtil >= 85 ? "bg-amber-500" : "bg-blue-500", icon: "👥" },
          { label: "Open High Risks", value: String(openRisks), sub: "Needs attention", color: openRisks >= 2 ? "bg-red-500" : "bg-green-500", icon: "⚠️" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-3">
            <div className={`${c.color} w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg shrink-0`}>{c.icon}</div>
            <div>
              <div className="text-xl font-bold text-slate-800">{c.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{c.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Budget Overview Bar */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-700">Portfolio Budget Overview</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${budgetPct > 80 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{budgetPct}% utilized</span>
        </div>
        <div className="flex items-center gap-4 text-sm mb-3">
          <span className="text-slate-500">Total: <span className="font-semibold text-slate-800">{fmt(totalBudget)}</span></span>
          <span className="text-slate-500">Spent: <span className="font-semibold text-indigo-600">{fmt(totalSpent)}</span></span>
          <span className="text-slate-500">Remaining: <span className="font-semibold text-emerald-600">{fmt(totalBudget - totalSpent)}</span></span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${budgetPct > 80 ? "bg-amber-500" : "bg-indigo-500"}`} style={{ width: `${budgetPct}%` }} />
        </div>
        <div className="grid grid-cols-4 gap-3 mt-4">
          {PORTFOLIO.map((p) => {
            const pct = Math.round((p.spent / p.budget) * 100);
            return (
              <div key={p.name} className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs font-medium text-slate-700 truncate">{p.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{fmt(p.spent)} / {fmt(p.budget)}</div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full rounded-full ${pct > 85 ? "bg-red-500" : pct > 65 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-400">{pct}%</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${healthColor[p.health]}`}>{p.health}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl shadow-sm p-1.5 w-fit">
        {(["portfolio", "charts", "risk"] as const).map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === t ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
            {t === "portfolio" ? "Portfolio" : t === "charts" ? "Charts & Velocity" : "Risk Summary"}
          </button>
        ))}
      </div>

      {/* Portfolio Tab */}
      {activeTab === "portfolio" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-700">Active Projects</h3>
            <p className="text-xs text-slate-400 mt-0.5">Health, budget, and team across all active projects</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wide bg-slate-50">
                <th className="px-5 py-3 text-left">Project</th>
                <th className="px-5 py-3 text-left">Client</th>
                <th className="px-5 py-3 text-left">Health</th>
                <th className="px-5 py-3 text-right">Budget</th>
                <th className="px-5 py-3 text-right">Spent</th>
                <th className="px-5 py-3 text-center">Team</th>
                <th className="px-5 py-3 text-center">Sprints</th>
                <th className="px-5 py-3 text-center">Risk</th>
              </tr>
            </thead>
            <tbody>
              {PORTFOLIO.map((p, i) => {
                const pct = Math.round((p.spent / p.budget) * 100);
                return (
                  <tr key={p.name} className={`border-t border-slate-50 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                    <td className="px-5 py-3 font-medium text-slate-800">{p.name}</td>
                    <td className="px-5 py-3 text-slate-500">{p.client}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${healthColor[p.health]}`}>{p.health}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-slate-700">{fmt(p.budget)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-slate-700">{fmt(p.spent)}</span>
                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct > 85 ? "bg-red-500" : "bg-indigo-500"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">{p.team}</span>
                    </td>
                    <td className="px-5 py-3 text-center text-slate-600">{p.sprints}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskColor[p.risk]}`}>{p.risk}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === "charts" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Sprint Velocity Chart */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-1">Sprint Velocity</h3>
            <p className="text-xs text-slate-400 mb-4">Story points completed per sprint</p>
            <svg viewBox={`0 0 ${CHART_W + 60} ${CHART_H + 60}`} className="w-full">
              {/* Y grid */}
              {[0, 10, 20, 30, 40].map((v) => {
                const y = PAD_T + CHART_H - (v / velMax) * CHART_H;
                return (
                  <g key={v}>
                    <line x1={PAD_L} y1={y} x2={PAD_L + CHART_W} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                    <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{v}</text>
                  </g>
                );
              })}
              {/* Bars */}
              {VELOCITY_DATA.map((d, i) => {
                const x = PAD_L + i * velGroupW + (velGroupW - velBarW) / 2;
                if (d.pts === null) {
                  return (
                    <g key={d.sprint}>
                      <rect x={x} y={PAD_T + CHART_H - 20} width={velBarW} height={20} fill="#e2e8f0" rx="3" strokeDasharray="4" stroke="#94a3b8" strokeWidth="1" fillOpacity="0.5" />
                      <text x={x + velBarW / 2} y={PAD_T + CHART_H - 24} textAnchor="middle" fontSize="9" fill="#94a3b8">pending</text>
                      <text x={x + velBarW / 2} y={PAD_T + CHART_H + 14} textAnchor="middle" fontSize="10" fill="#64748b">{d.sprint}</text>
                    </g>
                  );
                }
                const bh = (d.pts / velMax) * CHART_H;
                const by = PAD_T + CHART_H - bh;
                return (
                  <g key={d.sprint}>
                    <rect x={x} y={by} width={velBarW} height={bh} fill="#6366f1" rx="3" />
                    <text x={x + velBarW / 2} y={by - 4} textAnchor="middle" fontSize="10" fill="#4f46e5" fontWeight="600">{d.pts}</text>
                    <text x={x + velBarW / 2} y={PAD_T + CHART_H + 14} textAnchor="middle" fontSize="10" fill="#64748b">{d.sprint}</text>
                  </g>
                );
              })}
              {/* Trend line through completed */}
              {completedVel.length > 1 && (
                <path
                  d={completedVel.map((d, i) => {
                    const gi = VELOCITY_DATA.indexOf(d);
                    const cx = PAD_L + gi * velGroupW + velGroupW / 2;
                    const cy = PAD_T + CHART_H - ((d.pts as number) / velMax) * CHART_H;
                    return `${i === 0 ? "M" : "L"} ${cx} ${cy}`;
                  }).join(" ")}
                  fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3"
                />
              )}
              {completedVel.map((d) => {
                const gi = VELOCITY_DATA.indexOf(d);
                const cx = PAD_L + gi * velGroupW + velGroupW / 2;
                const cy = PAD_T + CHART_H - ((d.pts as number) / velMax) * CHART_H;
                return <circle key={d.sprint} cx={cx} cy={cy} r="4" fill="#f59e0b" />;
              })}
            </svg>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded inline-block" /> Completed pts</span>
              <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-amber-400 inline-block" /> Velocity trend</span>
            </div>
          </div>

          {/* Cost Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-1">Cost Trend</h3>
            <p className="text-xs text-slate-400 mb-4">Monthly budget vs actual spend</p>
            <svg viewBox={`0 0 ${CHART_W + 60} ${CHART_H + 60}`} className="w-full">
              {[0, 100000, 200000, 300000, 400000].map((v) => {
                const y = PAD_T + CHART_H - (v / costMax) * CHART_H;
                return (
                  <g key={v}>
                    <line x1={PAD_L} y1={y} x2={PAD_L + CHART_W} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                    <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{v === 0 ? "0" : `${v / 1000}k`}</text>
                  </g>
                );
              })}
              {COST_TREND.map((d, i) => {
                const cx = PAD_L + i * costGroupW;
                const budgetH = (d.budget / costMax) * CHART_H;
                const actualH = d.actual > 0 ? (d.actual / costMax) * CHART_H : 0;
                return (
                  <g key={d.month}>
                    <rect x={cx + (costGroupW - cBarW * 2 - 4) / 2} y={PAD_T + CHART_H - budgetH} width={cBarW} height={budgetH} fill="#c7d2fe" rx="2" />
                    {d.actual > 0 && (
                      <rect x={cx + (costGroupW - cBarW * 2 - 4) / 2 + cBarW + 4} y={PAD_T + CHART_H - actualH} width={cBarW} height={actualH} fill="#6366f1" rx="2" />
                    )}
                    <text x={cx + costGroupW / 2} y={PAD_T + CHART_H + 14} textAnchor="middle" fontSize="10" fill="#64748b">{d.month}</text>
                  </g>
                );
              })}
            </svg>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-200 rounded inline-block" /> Budget</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded inline-block" /> Actual</span>
            </div>
          </div>

          {/* Burndown Chart */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-1">Sprint 4 Burndown</h3>
            <p className="text-xs text-slate-400 mb-4">Remaining hours vs ideal burndown</p>
            <svg viewBox={`0 0 ${CHART_W + 60} ${CHART_H + 60}`} className="w-full">
              {[0, 30, 60, 90, 120].map((v) => {
                const y = PAD_T + CHART_H - (v / bdMax) * CHART_H;
                return (
                  <g key={v}>
                    <line x1={PAD_L} y1={y} x2={PAD_L + CHART_W} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                    <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{v}</text>
                  </g>
                );
              })}
              {/* Ideal line */}
              <path
                d={BURNDOWN.map((d, i) => {
                  const x = PAD_L + i * bdGroupW;
                  const y = PAD_T + CHART_H - (d.ideal / bdMax) * CHART_H;
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                }).join(" ")}
                fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6,3"
              />
              {/* Actual line */}
              <path
                d={BURNDOWN.filter((d) => d.actual !== null).map((d, i) => {
                  const origI = BURNDOWN.indexOf(d);
                  const x = PAD_L + origI * bdGroupW;
                  const y = PAD_T + CHART_H - ((d.actual as number) / bdMax) * CHART_H;
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                }).join(" ")}
                fill="none" stroke="#f59e0b" strokeWidth="2"
              />
              {BURNDOWN.map((d, i) => {
                const x = PAD_L + i * bdGroupW;
                return (
                  <text key={d.day} x={x} y={PAD_T + CHART_H + 14} textAnchor="middle" fontSize="10" fill="#64748b">{d.day}</text>
                );
              })}
            </svg>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-slate-400 inline-block border-dashed" /> Ideal</span>
              <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-amber-400 inline-block" /> Actual</span>
            </div>
          </div>

          {/* Team Utilization */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-1">Team Utilization</h3>
            <p className="text-xs text-slate-400 mb-4">Current sprint allocation vs capacity</p>
            <div className="space-y-3">
              {TEAM_UTIL.map((t) => (
                <div key={t.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {t.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 truncate">{t.name}</span>
                      <span className={`text-xs font-semibold ml-2 ${t.util >= 90 ? "text-red-600" : t.util >= 75 ? "text-amber-600" : "text-emerald-600"}`}>{t.util}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${t.util >= 100 ? "bg-red-500" : t.util >= 90 ? "bg-orange-500" : t.util >= 75 ? "bg-amber-400" : "bg-emerald-500"}`}
                        style={{ width: `${Math.min(t.util, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Risk Summary Tab */}
      {activeTab === "risk" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Risk Impact Matrix */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-1">Risk Impact Matrix</h3>
            <p className="text-xs text-slate-400 mb-4">Impact × Probability — each cell shows risk count</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-slate-500 text-left">Impact ↓ / Prob →</th>
                    <th className="p-2 font-semibold text-slate-600 w-24">Low</th>
                    <th className="p-2 font-semibold text-slate-600 w-24">Medium</th>
                    <th className="p-2 font-semibold text-slate-600 w-24">High</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { impact: "High", cells: [
                      { prob: "Low", color: "bg-amber-100 text-amber-800", count: RISK_ITEMS.filter((r) => r.impact === "High" && r.prob === "Low").length },
                      { prob: "Medium", color: "bg-orange-100 text-orange-800", count: RISK_ITEMS.filter((r) => r.impact === "High" && r.prob === "Medium").length },
                      { prob: "High", color: "bg-red-100 text-red-800", count: RISK_ITEMS.filter((r) => r.impact === "High" && r.prob === "High").length },
                    ]},
                    { impact: "Medium", cells: [
                      { prob: "Low", color: "bg-green-100 text-green-800", count: RISK_ITEMS.filter((r) => r.impact === "Medium" && r.prob === "Low").length },
                      { prob: "Medium", color: "bg-amber-100 text-amber-800", count: RISK_ITEMS.filter((r) => r.impact === "Medium" && r.prob === "Medium").length },
                      { prob: "High", color: "bg-orange-100 text-orange-800", count: RISK_ITEMS.filter((r) => r.impact === "Medium" && r.prob === "High").length },
                    ]},
                    { impact: "Low", cells: [
                      { prob: "Low", color: "bg-green-50 text-green-700", count: RISK_ITEMS.filter((r) => r.impact === "Low" && r.prob === "Low").length },
                      { prob: "Medium", color: "bg-green-100 text-green-800", count: RISK_ITEMS.filter((r) => r.impact === "Low" && r.prob === "Medium").length },
                      { prob: "High", color: "bg-amber-100 text-amber-800", count: RISK_ITEMS.filter((r) => r.impact === "Low" && r.prob === "High").length },
                    ]},
                  ].map((row) => (
                    <tr key={row.impact}>
                      <td className="p-2 font-semibold text-slate-600 text-left">{row.impact}</td>
                      {row.cells.map((cell) => (
                        <td key={cell.prob} className={`p-3 rounded ${cell.color} font-bold text-lg`}>
                          {cell.count > 0 ? cell.count : <span className="text-slate-300 text-base font-normal">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-3 h-3 bg-red-100 rounded inline-block" /> Critical</span>
              <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-3 h-3 bg-amber-100 rounded inline-block" /> High</span>
              <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-3 h-3 bg-green-100 rounded inline-block" /> Low</span>
            </div>
          </div>

          {/* Risk Register */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-700">Active Risk Register</h3>
                <p className="text-xs text-slate-400 mt-0.5">Auto-escalation if score &gt; 8 → PM / VP notified</p>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {RISK_ITEMS.map((r) => (
                <div key={r.id} className={`px-5 py-4 ${r.score >= 8 ? "bg-red-50" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-400">{r.id}</span>
                        {r.score >= 8 && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">Auto-Escalated</span>
                        )}
                      </div>
                      <div className="text-sm font-medium text-slate-800">{r.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{r.project}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskColor[r.impact]}`}>{r.impact}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${r.score >= 8 ? "bg-red-500 text-white" : r.score >= 4 ? "bg-amber-500 text-white" : "bg-green-500 text-white"}`}>
                        {r.score}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-amber-50 border-t border-amber-100">
              <p className="text-xs text-amber-700">
                <span className="font-semibold">{RISK_ITEMS.filter((r) => r.score >= 8).length} risks</span> auto-escalated to PM & VP Engineering
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
