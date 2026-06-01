"use client";
import { useState, useEffect } from "react";

type Availability = "Available" | "Partial" | "Not Available";

type ProjectResource = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  availability: Availability;
  allocatedHours: number;   // hours allocated to this project per sprint
  sprintCapacity: number;   // total sprint capacity
  monthlySalary: number;    // HR salary — used to derive rate
  workingHoursPerMonth: number; // default 160
};

const initialResources: ProjectResource[] = [
  { id: "r1", name: "Rahul S.",  role: "Backend Lead",   avatar: "R", availability: "Partial",       allocatedHours: 60, sprintCapacity: 80, monthlySalary: 160000, workingHoursPerMonth: 160 },
  { id: "r2", name: "Priya M.",  role: "Frontend Dev",   avatar: "P", availability: "Available",     allocatedHours: 80, sprintCapacity: 80, monthlySalary: 140000, workingHoursPerMonth: 160 },
  { id: "r3", name: "Amit K.",   role: "DevOps Engineer",avatar: "A", availability: "Available",     allocatedHours: 80, sprintCapacity: 80, monthlySalary: 150000, workingHoursPerMonth: 160 },
  { id: "r4", name: "Sneha R.",  role: "UI/UX Designer", avatar: "S", availability: "Not Available", allocatedHours: 0,  sprintCapacity: 80, monthlySalary: 120000, workingHoursPerMonth: 160 },
  { id: "r5", name: "Vikram P.", role: "Full Stack Dev",  avatar: "V", availability: "Partial",       allocatedHours: 45, sprintCapacity: 80, monthlySalary: 180000, workingHoursPerMonth: 160 },
  { id: "r6", name: "Meera J.",  role: "QA Engineer",    avatar: "M", availability: "Available",     allocatedHours: 80, sprintCapacity: 80, monthlySalary: 100000, workingHoursPerMonth: 160 },
];

// Pre-computed from initial tracking entries
const INITIAL_PROJECT_HOURS: Record<string, number> = {
  "Rahul S.": 73, "Priya M.": 69, "Amit K.": 62, "Vikram P.": 85, "Sneha R.": 64,
};

const availabilityStyle: Record<Availability, string> = {
  "Available":     "bg-green-100 text-green-700 border-green-200",
  "Partial":       "bg-amber-100 text-amber-700 border-amber-200",
  "Not Available": "bg-red-100  text-red-700  border-red-200",
};
const availabilityDot: Record<Availability, string> = {
  "Available": "bg-green-500", "Partial": "bg-amber-400", "Not Available": "bg-red-500",
};

function ratePerHour(r: ProjectResource) {
  return r.workingHoursPerMonth > 0 ? r.monthlySalary / r.workingHoursPerMonth : 0;
}

export default function SalaryPage() {
  const [resources, setResources]         = useState<ProjectResource[]>(initialResources);
  const [projectHours, setProjectHours]   = useState<Record<string, number>>(INITIAL_PROJECT_HOURS);
  const [editingId, setEditingId]         = useState<string | null>(null);
  const [draft, setDraft]                 = useState({ monthlySalary: 0, workingHoursPerMonth: 160, allocatedHours: 0 });
  // Overtime from board: logged > estimated per task, accumulated per user
  const [overtimeByUser, setOvertimeByUser] = useState<Record<string, number>>({
    "Rahul S.": 3, "Vikram P.": 3.5, "Amit K.": 1,
  });

  // Read logged hours + task-based overtime from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pm_logged_hours_by_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Object.keys(parsed).length > 0) setProjectHours(parsed);
        else localStorage.setItem("pm_logged_hours_by_user", JSON.stringify(INITIAL_PROJECT_HOURS));
      } else {
        localStorage.setItem("pm_logged_hours_by_user", JSON.stringify(INITIAL_PROJECT_HOURS));
      }
      const ot = localStorage.getItem("pm_overtime_by_user");
      if (ot) {
        const parsed = JSON.parse(ot);
        if (Object.keys(parsed).length > 0) setOvertimeByUser(parsed);
      }
    } catch {}
  }, []);

  // Publish rates + allocated hours so Project Cost page stays in sync
  useEffect(() => {
    try {
      const rates: Record<string, { monthlySalary: number; workingHoursPerMonth: number; ratePerHour: number }> = {};
      const alloc: Record<string, number> = {};
      resources.forEach((r) => {
        rates[r.name] = { monthlySalary: r.monthlySalary, workingHoursPerMonth: r.workingHoursPerMonth, ratePerHour: ratePerHour(r) };
        alloc[r.name] = r.allocatedHours;
      });
      localStorage.setItem("pm_resource_rates",     JSON.stringify(rates));
      localStorage.setItem("pm_allocated_hours",    JSON.stringify(alloc));
    } catch {}
  }, [resources]);

  const startEdit = (r: ProjectResource) => {
    setEditingId(r.id);
    setDraft({ monthlySalary: r.monthlySalary, workingHoursPerMonth: r.workingHoursPerMonth, allocatedHours: r.allocatedHours });
  };
  const saveEdit = (id: string) => {
    setResources((prev) => prev.map((r) => r.id === id
      ? { ...r, monthlySalary: draft.monthlySalary, workingHoursPerMonth: draft.workingHoursPerMonth, allocatedHours: draft.allocatedHours }
      : r
    ));
    setEditingId(null);
  };

  // Summary
  const availCount   = resources.filter((r) => r.availability === "Available").length;
  const partialCount = resources.filter((r) => r.availability === "Partial").length;
  const unavailCount = resources.filter((r) => r.availability === "Not Available").length;

  const rows = resources.map((r) => {
    const rate        = ratePerHour(r);
    const loggedHrs   = projectHours[r.name] ?? 0;
    // Overtime = hours logged beyond task estimates (from board), not allocation
    const overtimeHrs = Math.min(overtimeByUser[r.name] ?? 0, loggedHrs);
    const regularHrs  = Math.max(0, loggedHrs - overtimeHrs);
    const regularCost  = regularHrs  * rate;
    const overtimeCost = overtimeHrs * rate;
    const totalCost    = regularCost + overtimeCost;          // = loggedHrs × rate
    const allocPct    = r.sprintCapacity > 0 ? Math.round((r.allocatedHours / r.sprintCapacity) * 100) : 0;
    const utilizePct  = r.allocatedHours > 0 ? Math.min(100, Math.round((loggedHrs / r.allocatedHours) * 100)) : 0;
    const hasOvertime = overtimeHrs > 0;
    return { ...r, rate, loggedHrs, regularHrs, overtimeHrs, regularCost, overtimeCost, totalCost, allocPct, utilizePct, hasOvertime };
  });

  const totalLoggedHrs   = rows.reduce((a, r) => a + r.loggedHrs, 0);
  const totalRegularCost = rows.reduce((a, r) => a + r.regularCost, 0);
  const totalOTCost      = rows.reduce((a, r) => a + r.overtimeCost, 0);
  const totalCost        = rows.reduce((a, r) => a + r.totalCost, 0);
  const totalAllocHrs    = rows.reduce((a, r) => a + r.allocatedHours, 0);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Salary Cost</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Cost per resource = Hours logged on this project × (Monthly Salary ÷ Working hrs/month)
          </p>
        </div>
      </div>

      {/* Formula callout */}
      <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl text-sm">
        <span className="text-xl shrink-0">💡</span>
        <div className="text-indigo-800">
          <strong>Rate/hr</strong> = Monthly Salary ÷ Working Hours per Month &nbsp;·&nbsp;
          <strong>Cost on Project</strong> = Hours Logged on Project × Rate/hr &nbsp;·&nbsp;
          <span className="text-amber-700"><strong>Overtime not included</strong> in salary cost</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
          <div className="text-xs text-slate-400 mb-1">Team Size</div>
          <div className="text-2xl font-bold text-indigo-700">{resources.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">resources on project</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <div className="text-xs text-slate-400 mb-1">Available</div>
          <div className="text-2xl font-bold text-green-600">{availCount}</div>
          <div className="text-xs text-slate-400 mt-0.5">full capacity</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
          <div className="text-xs text-slate-400 mb-1">Partial</div>
          <div className="text-2xl font-bold text-amber-600">{partialCount}</div>
          <div className="text-xs text-slate-400 mt-0.5">shared with other projects</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <div className="text-xs text-slate-400 mb-1">Total Hours Logged</div>
          <div className="text-2xl font-bold text-blue-700">{totalLoggedHrs}h</div>
          <div className="text-xs text-slate-400 mt-0.5">of {totalAllocHrs}h allocated</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <div className="text-xs text-slate-400 mb-1">Total Salary Cost</div>
          <div className="text-2xl font-bold text-purple-700">₹{Math.round(totalCost).toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-0.5">logged hrs × individual rates</div>
        </div>
      </div>

      {/* Resource Cost Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-700">Resource Salary Cost on Project</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click Edit to update salary or working hours · Rate recalculates automatically
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> Available</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Partial</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Not Available</span>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2">Resource</th>
              <th className="text-left px-4 py-2">Availability on Project</th>
              <th className="text-right px-4 py-2">Allocated hrs</th>
              <th className="text-right px-4 py-2">Monthly Salary</th>
              <th className="text-right px-4 py-2">Work hrs/mo</th>
              <th className="text-right px-4 py-2 text-indigo-500">Rate / hr</th>
              <th className="text-right px-4 py-2 text-blue-500">Logged hrs</th>
              <th className="text-right px-4 py-2 text-purple-500">Salary Cost</th>
              <th className="text-center px-4 py-2">Utilisation</th>
              <th className="text-center px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isEditing = editingId === r.id;
              return isEditing ? (
                <tr key={r.id} className="border-b border-indigo-100 bg-indigo-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-sm font-bold text-indigo-700">{r.avatar}</div>
                      <div>
                        <div className="font-medium text-slate-700">{r.name}</div>
                        <div className="text-xs text-slate-400">{r.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${availabilityStyle[r.availability]}`}>
                      {r.availability}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" className="w-20 border border-indigo-200 rounded px-2 py-1 text-xs text-right"
                      value={draft.allocatedHours} onChange={(e) => setDraft((p) => ({ ...p, allocatedHours: Number(e.target.value) }))} />
                    <span className="text-xs text-slate-400 ml-1">/ {r.sprintCapacity}h</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">₹</span>
                      <input type="number" className="w-24 border border-indigo-200 rounded px-2 py-1 text-xs text-right"
                        value={draft.monthlySalary} onChange={(e) => setDraft((p) => ({ ...p, monthlySalary: Number(e.target.value) }))} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" className="w-16 border border-indigo-200 rounded px-2 py-1 text-xs text-right"
                      value={draft.workingHoursPerMonth} onChange={(e) => setDraft((p) => ({ ...p, workingHoursPerMonth: Number(e.target.value) }))} />
                  </td>
                  <td className="px-4 py-3 text-right text-indigo-600 font-semibold text-xs">
                    ₹{draft.workingHoursPerMonth > 0 ? Math.round(draft.monthlySalary / draft.workingHoursPerMonth).toLocaleString() : 0}/hr
                    <div className="text-slate-400 font-normal">÷{draft.workingHoursPerMonth}h</div>
                  </td>
                  <td colSpan={4} className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(r.id)} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg">Save</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs rounded-lg">Cancel</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={r.id} className={`border-b border-slate-50 hover:bg-slate-50 ${r.availability === "Not Available" ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 relative shrink-0">
                        {r.avatar}
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${availabilityDot[r.availability]}`} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-700">{r.name}</div>
                        <div className="text-xs text-slate-400">{r.role}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${availabilityStyle[r.availability]}`}>
                      {r.availability === "Available" ? "✓ Available" : r.availability === "Partial" ? "~ Partial" : "✗ Not Available"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="text-slate-700 font-semibold">{r.allocatedHours}h</div>
                    <div className="text-xs text-slate-400">of {r.sprintCapacity}h capacity ({r.allocPct}%)</div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="text-slate-700 font-semibold">₹{r.monthlySalary.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">per month</div>
                  </td>

                  <td className="px-4 py-3 text-right text-slate-500">{r.workingHoursPerMonth}h</td>

                  <td className="px-4 py-3 text-right">
                    <div className="text-indigo-600 font-bold">₹{Math.round(r.rate).toLocaleString()}/hr</div>
                    <div className="text-xs text-slate-400">÷{r.workingHoursPerMonth}h</div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    {r.loggedHrs > 0 ? (
                      <div className="space-y-0.5">
                        <div className="text-xs text-slate-500">{r.regularHrs}h regular</div>
                        {r.hasOvertime
                          ? <div className="text-xs font-semibold text-amber-500">{r.overtimeHrs}h overtime</div>
                          : null}
                        <div className={`font-bold text-sm ${r.hasOvertime ? "text-amber-600" : "text-blue-600"}`}>
                          = {r.loggedHrs}h total
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic text-xs">No hours logged</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {r.loggedHrs > 0 ? (
                      <div className="space-y-0.5">
                        <div className="text-xs text-slate-500">₹{Math.round(r.regularCost).toLocaleString()} regular</div>
                        {r.hasOvertime
                          ? <div className="text-xs font-semibold text-amber-500">₹{Math.round(r.overtimeCost).toLocaleString()} overtime</div>
                          : null}
                        <div className="font-bold text-sm text-purple-700">
                          = ₹{Math.round(r.totalCost).toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-300 text-xs">₹0</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {r.allocatedHours > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-16">
                          <div
                            className={`h-2 rounded-full transition-all ${r.hasOvertime ? "bg-amber-400" : r.utilizePct >= 80 ? "bg-green-500" : "bg-indigo-400"}`}
                            style={{ width: `${Math.min(r.utilizePct, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold w-8 text-right ${r.hasOvertime ? "text-amber-600" : "text-slate-500"}`}>
                          {r.utilizePct}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300 italic">N/A</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button onClick={() => startEdit(r)} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200">Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold">
              <td className="px-4 py-3 text-slate-700 font-bold" colSpan={2}>Project Total</td>
              <td className="px-4 py-3 text-right text-slate-600">{totalAllocHrs}h allocated</td>
              <td colSpan={3} />
              <td className="px-4 py-3 text-right">
                <div className="text-xs text-slate-500">{rows.reduce((a,r)=>a+r.regularHrs,0)}h regular</div>
                {rows.some(r=>r.hasOvertime) && <div className="text-xs text-amber-500 font-semibold">{rows.reduce((a,r)=>a+r.overtimeHrs,0)}h overtime</div>}
                <div className="font-bold text-sm text-blue-700">= {totalLoggedHrs}h total</div>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="text-xs text-slate-500">₹{Math.round(totalRegularCost).toLocaleString()} regular</div>
                {totalOTCost > 0 && <div className="text-xs text-amber-500 font-semibold">₹{Math.round(totalOTCost).toLocaleString()} overtime</div>}
                <div className="font-bold text-sm text-purple-700">= ₹{Math.round(totalCost).toLocaleString()}</div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-16">
                    <div className="h-2 rounded-full bg-indigo-500"
                      style={{ width: `${totalAllocHrs > 0 ? Math.min(100, Math.round((totalLoggedHrs / totalAllocHrs) * 100)) : 0}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    {totalAllocHrs > 0 ? Math.min(100, Math.round((totalLoggedHrs / totalAllocHrs) * 100)) : 0}%
                  </span>
                </div>
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
