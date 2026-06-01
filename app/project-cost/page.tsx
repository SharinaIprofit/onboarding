"use client";
import { useState, useEffect } from "react";

const CURRENCIES = [
  { symbol: "₹", code: "INR", name: "Indian Rupee" },
  { symbol: "$", code: "USD", name: "US Dollar" },
  { symbol: "€", code: "EUR", name: "Euro" },
  { symbol: "£", code: "GBP", name: "British Pound" },
  { symbol: "¥", code: "JPY", name: "Japanese Yen" },
  { symbol: "د.إ", code: "AED", name: "UAE Dirham" },
  { symbol: "S$", code: "SGD", name: "Singapore Dollar" },
  { symbol: "A$", code: "AUD", name: "Australian Dollar" },
  { symbol: "C$", code: "CAD", name: "Canadian Dollar" },
];

// Fallback sprint data when localStorage has nothing
const SPRINT_CONFIG: { sprint: string; estHours: number; status: "Completed" | "Active" | "Planned" }[] = [
  { sprint: "Sprint 1", estHours: 120, status: "Completed" },
  { sprint: "Sprint 2", estHours: 120, status: "Completed" },
  { sprint: "Sprint 3", estHours: 120, status: "Completed" },
  { sprint: "Sprint 4", estHours: 120, status: "Active" },
  { sprint: "Sprint 5", estHours: 120, status: "Planned" },
  { sprint: "Sprint 6", estHours: 120, status: "Planned" },
];

// Fallback resource rates if salary page hasn't been visited yet
const FALLBACK_RATES: Record<string, { monthlySalary: number; workingHoursPerMonth: number; ratePerHour: number }> = {
  "Rahul S.":  { monthlySalary: 160000, workingHoursPerMonth: 160, ratePerHour: 1000 },
  "Priya M.":  { monthlySalary: 140000, workingHoursPerMonth: 160, ratePerHour: 875  },
  "Amit K.":   { monthlySalary: 150000, workingHoursPerMonth: 160, ratePerHour: 937.5},
  "Sneha R.":  { monthlySalary: 120000, workingHoursPerMonth: 160, ratePerHour: 750  },
  "Vikram P.": { monthlySalary: 180000, workingHoursPerMonth: 160, ratePerHour: 1125 },
};

const FALLBACK_HOURS_BY_USER: Record<string, number> = {
  "Rahul S.": 73, "Priya M.": 69, "Amit K.": 62, "Vikram P.": 85, "Sneha R.": 64,
};

const FALLBACK_HOURS_BY_SPRINT: Record<string, number> = {
  "Sprint 1": 118, "Sprint 2": 115, "Sprint 3": 102, "Sprint 4": 23,
};

const statusStyle: Record<string, string> = {
  Completed: "bg-green-100 text-green-700",
  Active: "bg-blue-100 text-blue-700",
  Planned: "bg-slate-100 text-slate-500",
};

const BILLING_MONTHS = [
  { value: "2026-03", label: "Mar 2026" },
  { value: "2026-04", label: "Apr 2026" },
  { value: "2026-05", label: "May 2026" },
  { value: "2026-06", label: "Jun 2026" },
  { value: "2026-07", label: "Jul 2026" },
  { value: "2026-08", label: "Aug 2026" },
  { value: "2026-09", label: "Sep 2026" },
];

/** Count Mon–Fri working days in a given "YYYY-MM" month */
function getWorkingDays(yearMonth: string): number {
  const [year, month] = yearMonth.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate(); // month is 1-based here
  let count = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dow = new Date(year, month - 1, day).getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}

export default function ProjectCostPage() {
  const [currencyCode,  setCurrencyCode]  = useState("INR");
  const [billingMonth,  setBillingMonth]  = useState("2026-05");

  // Data loaded from localStorage (set by tracking + salary pages)
  const [hoursByUser,    setHoursByUser]    = useState<Record<string, number>>(FALLBACK_HOURS_BY_USER);
  const [hoursBySprint,  setHoursBySprint]  = useState<Record<string, number>>(FALLBACK_HOURS_BY_SPRINT);
  const [resourceRates,  setResourceRates]  = useState<typeof FALLBACK_RATES>(FALLBACK_RATES);
  const [allocatedHours, setAllocatedHours] = useState<Record<string, number>>({
    "Rahul S.": 60, "Priya M.": 80, "Amit K.": 80,
    "Sneha R.": 0,  "Vikram P.": 45, "Meera J.": 80,
  });
  // Overtime per user from task estimates (board publishes this)
  const [overtimeByUser, setOvertimeByUser] = useState<Record<string, number>>({
    "Rahul S.": 3, "Vikram P.": 3.5, "Amit K.": 1,
  });

  useEffect(() => {
    try {
      const u = localStorage.getItem("pm_logged_hours_by_user");
      if (u) {
        const parsed = JSON.parse(u);
        if (Object.keys(parsed).length > 0) setHoursByUser(parsed);
      } else {
        localStorage.setItem("pm_logged_hours_by_user", JSON.stringify(FALLBACK_HOURS_BY_USER));
      }
      const s = localStorage.getItem("pm_logged_hours_by_sprint");
      if (s) {
        const parsed = JSON.parse(s);
        if (Object.keys(parsed).length > 0) setHoursBySprint(parsed);
      } else {
        localStorage.setItem("pm_logged_hours_by_sprint", JSON.stringify(FALLBACK_HOURS_BY_SPRINT));
      }
      const r = localStorage.getItem("pm_resource_rates");
      if (r) {
        const parsed = JSON.parse(r);
        if (Object.keys(parsed).length > 0) setResourceRates(parsed);
      }
      const a = localStorage.getItem("pm_allocated_hours");
      if (a) {
        const parsed = JSON.parse(a);
        if (Object.keys(parsed).length > 0) setAllocatedHours(parsed);
      }
      const ot = localStorage.getItem("pm_overtime_by_user");
      if (ot) {
        const parsed = JSON.parse(ot);
        if (Object.keys(parsed).length > 0) setOvertimeByUser(parsed);
      }
    } catch {}
  }, []);

  const currency = CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0];
  const fmt = (n: number) => `${currency.symbol}${Math.round(n).toLocaleString()}`;

  // Billing rate is based on ACTUAL working days in the selected billing month
  const workingDays         = getWorkingDays(billingMonth);
  const billableHoursPerMonth = workingDays * 8;
  const billingMonthLabel   = BILLING_MONTHS.find(m => m.value === billingMonth)?.label ?? billingMonth;

  // Sprint rows — merge config with actual logged hours
  const sprintRows = SPRINT_CONFIG.map((cfg) => {
    const logged = hoursBySprint[cfg.sprint] ?? 0;
    // Compute cost for this sprint by apportioning resource hours proportionally
    // (rough estimate: total cost × sprint_share_of_hours)
    return { ...cfg, loggedHours: logged };
  });

  // Resource cost rows — one row per resource that has logged any hours
  const allResourceNames = Array.from(new Set([...Object.keys(hoursByUser), ...Object.keys(resourceRates)]));
  const resourceRows = allResourceNames
    .filter((name) => (hoursByUser[name] ?? 0) > 0 || name in resourceRates)
    .map((name) => {
      const totalHrs           = hoursByUser[name] ?? 0;
      // Overtime = hours beyond task estimates (not allocation)
      const overtimeHrs        = Math.min(overtimeByUser[name] ?? 0, totalHrs);
      const regularHrs         = Math.max(0, totalHrs - overtimeHrs);
      const rate               = resourceRates[name] ?? FALLBACK_RATES[name];
      const monthlySalary      = rate?.monthlySalary ?? 0;
      const hrWorkingHrs       = rate?.workingHoursPerMonth ?? 160;   // HR-fixed (salary page)
      const hrRatePerHour      = hrWorkingHrs > 0 ? monthlySalary / hrWorkingHrs : 0;
      // Billing rate uses ACTUAL working days in the billing month — only for project finance
      const billingRatePerHour = billableHoursPerMonth > 0 ? monthlySalary / billableHoursPerMonth : 0;
      const regularCost        = regularHrs  * billingRatePerHour;
      const overtimeCost       = overtimeHrs * billingRatePerHour;
      const totalCost          = regularCost + overtimeCost;
      return { name, totalHrs, regularHrs, overtimeHrs, monthlySalary, hrWorkingHrs, hrRatePerHour, billingRatePerHour, regularCost, overtimeCost, totalCost };
    })
    .sort((a, b) => b.totalCost - a.totalCost);

  const totalEstHours    = sprintRows.reduce((a, r) => a + r.estHours, 0);
  const totalLoggedHrs   = sprintRows.reduce((a, r) => a + r.loggedHours, 0);
  const totalOvertimeCost= resourceRows.reduce((a, r) => a + r.overtimeCost, 0);
  const totalCost        = resourceRows.reduce((a, r) => a + r.totalCost, 0);
  const totalEstCost     = resourceRows.reduce((a, r) => a + r.monthlySalary, 0);
  const overshoot        = totalLoggedHrs > totalEstHours;
  const completionPct    = totalEstHours > 0 ? Math.round((totalLoggedHrs / totalEstHours) * 100) : 0;

  // Sprint-level cost: distribute total cost by sprint's share of total logged hours
  const sprintCostRows = sprintRows.map((r) => {
    const share = totalLoggedHrs > 0 ? r.loggedHours / totalLoggedHrs : 0;
    const sprintCost = share * totalCost;
    const estCost    = totalEstHours > 0 ? (r.estHours / totalEstHours) * totalEstCost : 0;
    const variance   = estCost - sprintCost;
    const pct        = r.estHours > 0 ? Math.min(100, Math.round((r.loggedHours / r.estHours) * 100)) : 0;
    const over       = r.loggedHours > r.estHours;
    return { ...r, sprintCost, estCost, variance, pct, over };
  });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Project Cost</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Billing Rate = Monthly Salary ÷ Actual Working Days × 8h · Varies by billing month · HR Salary rate unchanged
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Billing Month</span>
            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white font-semibold text-slate-700"
              value={billingMonth} onChange={(e) => setBillingMonth(e.target.value)}>
              {BILLING_MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Currency</span>
            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white font-semibold text-slate-700"
              value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)}>
              {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Why Billing Rate Changes ── */}
      {(() => {
        const HR_STANDARD_DAYS = 20;
        const HR_STANDARD_HRS  = 160;
        const dayDiff   = workingDays - HR_STANDARD_DAYS;
        const hrDiff    = billableHoursPerMonth - HR_STANDARD_HRS;
        const pctChange = ((billableHoursPerMonth - HR_STANDARD_HRS) / HR_STANDARD_HRS) * 100;
        // Use avg monthly salary across resources for example
        const avgSalary = resourceRows.length > 0
          ? resourceRows.reduce((a, r) => a + r.monthlySalary, 0) / resourceRows.length
          : 160000;
        const exampleHrRate      = avgSalary / HR_STANDARD_HRS;
        const exampleBillingRate = avgSalary / billableHoursPerMonth;
        const rateImpact         = exampleBillingRate - exampleHrRate;

        // All months comparison data
        const allMonthData = BILLING_MONTHS.map((m) => {
          const wd  = getWorkingDays(m.value);
          const bh  = wd * 8;
          const dd  = wd - HR_STANDARD_DAYS;
          return { ...m, workingDays: wd, billableHours: bh, dayDiff: dd };
        });

        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-5 py-3 bg-gradient-to-r from-indigo-50 to-slate-50 border-b border-slate-100 flex items-center gap-3">
              <span className="text-lg">📅</span>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Why Billing Rate Changes Every Month</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Billing Rate = Monthly Salary ÷ (Working Days × 8h) — same salary, different days each month = different rate
                </p>
              </div>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Formula explanation */}
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <span className="text-slate-500 text-xs">HR Rate (fixed)</span>
                  <span className="font-bold text-slate-600">Salary ÷ {HR_STANDARD_HRS}h</span>
                  <span className="text-xs text-slate-400">({HR_STANDARD_DAYS} days × 8h)</span>
                </div>
                <span className="text-slate-400 font-bold text-lg">≠</span>
                <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-300 rounded-lg px-3 py-2">
                  <span className="text-indigo-600 text-xs font-medium">Billing Rate (actual)</span>
                  <span className="font-bold text-indigo-700">Salary ÷ {billableHoursPerMonth}h</span>
                  <span className="text-xs text-indigo-500">({workingDays} days × 8h in {billingMonthLabel})</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-semibold ${dayDiff === 0 ? "bg-slate-50 border-slate-200 text-slate-500" : dayDiff > 0 ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-green-50 border-green-200 text-green-700"}`}>
                  {dayDiff === 0 ? "= Same as HR standard" : dayDiff > 0 ? `▲ ${dayDiff} more days → rate ↓` : `▼ ${Math.abs(dayDiff)} fewer days → rate ↑`}
                </div>
              </div>

              {/* Month-by-month comparison strip */}
              <div>
                <div className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wide">Month-by-Month Working Days</div>
                <div className="grid grid-cols-7 gap-2">
                  {allMonthData.map((m) => {
                    const isSelected = m.value === billingMonth;
                    const dd = m.dayDiff;
                    return (
                      <button key={m.value} onClick={() => setBillingMonth(m.value)}
                        className={`rounded-xl p-3 text-center border-2 transition-all ${isSelected ? "border-indigo-500 bg-indigo-50 shadow-sm" : "border-slate-100 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50"}`}>
                        <div className={`text-xs font-bold mb-1 ${isSelected ? "text-indigo-700" : "text-slate-600"}`}>
                          {m.label.split(" ")[0]}
                        </div>
                        <div className={`text-lg font-extrabold ${isSelected ? "text-indigo-700" : "text-slate-700"}`}>
                          {m.workingDays}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">days</div>
                        <div className={`text-xs font-semibold mt-1 ${isSelected ? "text-indigo-600" : "text-slate-500"}`}>
                          {m.billableHours}h
                        </div>
                        {dd !== 0 && (
                          <div className={`text-xs font-medium mt-0.5 ${dd > 0 ? "text-amber-500" : "text-green-500"}`}>
                            {dd > 0 ? `+${dd}d` : `${dd}d`}
                          </div>
                        )}
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mx-auto mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs text-slate-400 mt-1.5">
                  ±days shown relative to HR standard ({HR_STANDARD_DAYS} days · {HR_STANDARD_HRS}h) · Click any month to switch billing period
                </div>
              </div>

              {/* Current month impact callout */}
              <div className={`flex items-start gap-4 px-4 py-3 rounded-xl border ${dayDiff === 0 ? "bg-slate-50 border-slate-200" : dayDiff > 0 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
                <div className="shrink-0 text-2xl">{dayDiff === 0 ? "✅" : dayDiff > 0 ? "⚠️" : "✅"}</div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 text-sm mb-1">
                    {billingMonthLabel}: {workingDays} working days × 8h = <span className="text-indigo-700">{billableHoursPerMonth} billable hours</span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-0.5">
                    {dayDiff === 0 ? (
                      <div>This month matches the HR standard (20 days · 160h) — billing rate equals the HR rate exactly.</div>
                    ) : (
                      <>
                        <div>
                          {dayDiff > 0 ? `${dayDiff} more` : `${Math.abs(dayDiff)} fewer`} working day{Math.abs(dayDiff) !== 1 ? "s" : ""} than
                          the HR standard ({HR_STANDARD_DAYS} days · {HR_STANDARD_HRS}h)
                          → billing rate is <span className={`font-semibold ${dayDiff > 0 ? "text-amber-700" : "text-green-700"}`}>
                            {Math.abs(pctChange).toFixed(1)}% {dayDiff > 0 ? "lower" : "higher"}
                          </span> than HR rate.
                        </div>
                        <div className="text-slate-500">
                          Example (avg salary ₹{Math.round(avgSalary / 1000)}k):&nbsp;
                          HR rate <span className="line-through text-slate-400">₹{Math.round(exampleHrRate)}/hr</span>&nbsp;→&nbsp;
                          Billing rate <span className={`font-semibold ${rateImpact > 0 ? "text-green-700" : "text-amber-700"}`}>₹{Math.round(exampleBillingRate)}/hr</span>
                          &nbsp;({rateImpact >= 0 ? "+" : ""}₹{Math.round(rateImpact)}/hr)
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-xs text-slate-400">Rate difference</div>
                  <div className={`text-xl font-bold ${rateImpact >= 0 ? "text-green-600" : "text-amber-600"}`}>
                    {rateImpact >= 0 ? "+" : ""}₹{Math.round(rateImpact)}/hr
                  </div>
                  <div className="text-xs text-slate-400">vs HR rate</div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-slate-300">
          <div className="text-xs text-slate-400 mb-1">Estimated Hours</div>
          <div className="text-2xl font-bold text-slate-800">{totalEstHours}h</div>
          <div className="text-xs text-slate-400 mt-0.5">across {sprintRows.length} sprints</div>
        </div>
        <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${overshoot ? "border-red-500" : "border-indigo-500"}`}>
          <div className="text-xs text-slate-400 mb-1">Logged Hours</div>
          <div className={`text-2xl font-bold ${overshoot ? "text-red-600" : "text-indigo-700"}`}>
            {overshoot && "⚠ "}{totalLoggedHrs}h
          </div>
          <div className={`text-xs mt-0.5 ${overshoot ? "text-red-500 font-semibold" : "text-slate-400"}`}>
            {completionPct}%{overshoot ? " — OVERSHOOT" : " complete"}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <div className="text-xs text-slate-400 mb-1">Total Project Cost</div>
          <div className="text-2xl font-bold text-purple-700">{fmt(totalCost)}</div>
          <div className="text-xs text-slate-400 mt-0.5">all logged hrs × billing rate · {resourceRows.length} contributors</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
          <div className="text-xs text-slate-400 mb-1">Overtime Cost (included above)</div>
          <div className={`text-2xl font-bold ${totalOvertimeCost > 0 ? "text-amber-600" : "text-slate-300"}`}>
            {fmt(totalOvertimeCost)}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">hrs beyond task estimates × rate</div>
        </div>
      </div>

      {/* ── Resource Cost Breakdown ── */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-700">Resource Cost Breakdown — {billingMonthLabel}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cost = Total hours logged × Billing Rate · Overtime (hours beyond task estimate) is included in total cost and shown separately
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            Live — updates when hours are logged
          </div>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2">Resource</th>
              <th className="text-right px-4 py-2">Monthly Salary</th>
              <th className="text-right px-4 py-2 text-slate-400">HR Rate/hr</th>
              <th className="text-right px-4 py-2 text-indigo-600">Billing Rate/hr</th>
              <th className="text-right px-4 py-2 text-slate-500">Allocated hrs</th>
              <th className="text-right px-4 py-2 text-blue-600">Total Hrs Logged</th>
              <th className="text-right px-4 py-2 text-amber-500">of which Overtime</th>
              <th className="text-right px-4 py-2 text-purple-600">Total Cost</th>
              <th className="text-right px-4 py-2 text-amber-600">Overtime Cost</th>
              <th className="text-right px-4 py-2">% of Total</th>
            </tr>
          </thead>
          <tbody>
            {resourceRows.map((r) => {
              const pct = totalCost > 0 ? Math.round((r.totalCost / totalCost) * 100) : 0;
              return (
                <tr key={r.name} className={`border-b border-slate-50 hover:bg-slate-50 ${r.overtimeHrs > 0 ? "bg-amber-50/20" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">{r.name[0]}</div>
                      <span className="font-medium text-slate-700">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">₹{r.monthlySalary.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-slate-400 text-xs line-through decoration-slate-300">₹{Math.round(r.hrRatePerHour).toLocaleString()}/hr</span>
                    <div className="text-xs text-slate-300">HR fixed ÷{r.hrWorkingHrs}h</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-indigo-600 font-bold">₹{Math.round(r.billingRatePerHour).toLocaleString()}/hr</span>
                    <div className="text-xs text-indigo-400">÷{billableHoursPerMonth}h actual</div>
                  </td>
                  {/* Allocated hours — commitment to this project */}
                  <td className="px-4 py-3 text-right">
                    {allocatedHours[r.name] != null ? (
                      <>
                        <div className="font-semibold text-slate-700">{allocatedHours[r.name]}h</div>
                        <div className="text-xs text-slate-400">
                          {r.totalHrs > allocatedHours[r.name]
                            ? <span className="text-amber-500">+{Math.round((r.totalHrs - allocatedHours[r.name]) * 10) / 10}h over</span>
                            : `${allocatedHours[r.name] - r.totalHrs}h remaining`}
                        </div>
                      </>
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  {/* Total hours logged — the real hours spent on project */}
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-blue-700 text-base">{r.totalHrs}h</div>
                    <div className="text-xs text-slate-400">{r.totalHrs}h × ₹{Math.round(r.billingRatePerHour).toLocaleString()}</div>
                  </td>
                  {/* Overtime hours — hours beyond task estimates */}
                  <td className="px-4 py-3 text-right">
                    {r.overtimeHrs > 0 ? (
                      <div>
                        <span className="font-bold text-amber-600">{r.overtimeHrs}h</span>
                        <div className="text-xs text-amber-500">beyond task estimate</div>
                      </div>
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  {/* Total cost = all hours × billing rate */}
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-purple-700 text-base">{fmt(r.totalCost)}</div>
                    {r.overtimeHrs > 0 && (
                      <div className="text-xs text-slate-400">incl. ₹{Math.round(r.overtimeCost).toLocaleString()} OT</div>
                    )}
                  </td>
                  {/* Overtime cost — sub-component of total */}
                  <td className="px-4 py-3 text-right">
                    {r.overtimeCost > 0 ? (
                      <span className="font-semibold text-amber-600">{fmt(r.overtimeCost)}</span>
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-16 bg-slate-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${r.overtimeHrs > 0 ? "bg-amber-400" : "bg-indigo-500"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
              <td className="px-4 py-3 text-slate-700 font-bold">Total</td>
              <td className="px-4 py-3 text-right text-slate-600">₹{resourceRows.reduce((a, r) => a + r.monthlySalary, 0).toLocaleString()}</td>
              <td colSpan={2} />
              <td className="px-4 py-3 text-right text-slate-600 font-bold">{Object.values(allocatedHours).reduce((a, h) => a + h, 0)}h</td>
              <td className="px-4 py-3 text-right text-blue-700 font-bold">{resourceRows.reduce((a, r) => a + r.totalHrs, 0)}h</td>
              <td className="px-4 py-3 text-right text-amber-600 font-bold">{resourceRows.reduce((a, r) => a + r.overtimeHrs, 0)}h</td>
              <td className="px-4 py-3 text-right text-purple-700 font-bold text-lg">{fmt(totalCost)}</td>
              <td className="px-4 py-3 text-right text-amber-600 font-bold">{fmt(totalOvertimeCost)}</td>
              <td className="px-4 py-3 text-right text-slate-500">100%</td>
            </tr>
          </tfoot>
        </table>
        </div>
      </div>

      {/* ── Per-Sprint Cost Table ── */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-700">Per-Sprint Cost Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Sprint cost = proportional share of total resource cost · Red when logged hours exceed estimate</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> Under</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Overshoot</span>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2">Sprint</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-right px-4 py-2">Est. Hours</th>
              <th className="text-right px-4 py-2">Logged Hours</th>
              <th className="text-right px-4 py-2">Sprint Cost</th>
              <th className="text-right px-4 py-2">Variance</th>
              <th className="text-right px-4 py-2">Progress</th>
            </tr>
          </thead>
          <tbody>
            {sprintCostRows.map((r) => (
              <tr key={r.sprint} className={`border-b border-slate-50 hover:bg-slate-50 ${r.over ? "bg-red-50/40" : r.status === "Active" ? "bg-indigo-50/30" : ""}`}>
                <td className="px-4 py-3 font-medium text-slate-700">
                  {r.sprint}
                  {r.status === "Active" && <span className="ml-1 text-xs text-indigo-600 font-semibold">(Active)</span>}
                  {r.over && <span className="ml-1 text-xs text-red-600 font-semibold">⚠ +{r.loggedHours - r.estHours}h</span>}
                </td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${statusStyle[r.status]}`}>{r.status}</span></td>
                <td className="px-4 py-3 text-right text-slate-500">{r.estHours}h</td>
                <td className={`px-4 py-3 text-right font-semibold ${r.over ? "text-red-600" : "text-slate-700"}`}>
                  {r.loggedHours}h
                  {r.over && <div className="text-xs text-red-500 font-normal">+{r.loggedHours - r.estHours}h over · included in cost</div>}
                </td>
                <td className={`px-4 py-3 text-right font-bold text-base ${r.over ? "text-red-600" : "text-indigo-600"}`}>
                  {r.loggedHours > 0 ? fmt(r.sprintCost) : <span className="text-slate-300 text-sm font-normal">Not started</span>}
                </td>
                <td className={`px-4 py-3 text-right font-semibold ${r.variance > 0 ? "text-green-600" : r.variance < 0 ? "text-red-600" : "text-slate-400"}`}>
                  {r.loggedHours === 0 ? "—" : r.variance >= 0 ? `+${fmt(r.variance)}` : `−${fmt(Math.abs(r.variance))}`}
                </td>
                <td className="px-4 py-3 w-32">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all ${r.over ? "bg-red-500" : r.status === "Completed" ? "bg-green-500" : r.status === "Active" ? "bg-indigo-500" : "bg-slate-200"}`}
                        style={{ width: `${Math.min(r.pct, 100)}%` }} />
                    </div>
                    <span className={`text-xs w-9 text-right ${r.over ? "text-red-600 font-bold" : "text-slate-400"}`}>{r.pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={`border-t-2 border-slate-200 font-semibold ${overshoot ? "bg-red-50" : "bg-slate-50"}`}>
              <td className="px-4 py-3 text-slate-700 font-bold">Project Total</td>
              <td />
              <td className="px-4 py-3 text-right text-slate-600">{totalEstHours}h</td>
              <td className={`px-4 py-3 text-right font-bold ${overshoot ? "text-red-600" : "text-slate-700"}`}>{totalLoggedHrs}h</td>
              <td className={`px-4 py-3 text-right text-lg font-bold ${overshoot ? "text-red-700" : "text-indigo-700"}`}>{fmt(totalCost)}</td>
              <td className={`px-4 py-3 text-right font-bold ${totalEstCost - totalCost >= 0 ? "text-green-600" : "text-red-600"}`}>
                {totalEstCost - totalCost >= 0 ? `+${fmt(totalEstCost - totalCost)}` : `−${fmt(Math.abs(totalEstCost - totalCost))}`}
              </td>
              <td className="px-4 py-3 text-right text-slate-500">{completionPct}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
