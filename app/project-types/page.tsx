"use client"

import { useState } from "react"
import ProjectBanner from "../_components/ProjectBanner"

type ProjectModel = {
  id: string; name: string; icon: string; workflow: string
  flexibility: "Very High" | "High" | "Medium" | "Low"
  billing: string; color: string; borderColor: string
  headerColor: string; pillColor: string; description: string
  keyFields: { label: string; example: string }[]
  phases: string[]; bestFor: string
}

const FLEXIBILITY_COLOR: Record<string, string> = {
  "Very High": "bg-emerald-100 text-emerald-700",
  High: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-600",
}

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`

const MODELS: ProjectModel[] = [
  {
    id: "saas", name: "SaaS", icon: "☁️", workflow: "Continuous loop",
    flexibility: "Very High", billing: "Subscription",
    color: "bg-violet-50", borderColor: "border-violet-300", headerColor: "bg-violet-600", pillColor: "bg-violet-100 text-violet-700",
    description: "Ongoing product development with continuous delivery cycles, feature releases, and subscriber-based revenue.",
    keyFields: [
      { label: "Product Name", example: "ProjectFlow Pro" },
      { label: "Subscription Plan", example: "Starter / Growth / Enterprise" },
      { label: "Users per Tier", example: "50 users" },
      { label: "Monthly Recurring Revenue", example: "Auto-calculated" },
      { label: "Renewal Cycle", example: "Monthly / Annual" },
    ],
    phases: ["Discovery", "Sprint Loop", "Release", "Monitor", "Iterate"],
    bestFor: "Product companies building recurring-revenue software",
  },
  {
    id: "tm", name: "Time & Material", icon: "⏱️", workflow: "Sprint-based",
    flexibility: "High", billing: "Hourly / Monthly",
    color: "bg-blue-50", borderColor: "border-blue-300", headerColor: "bg-blue-600", pillColor: "bg-blue-100 text-blue-700",
    description: "Client is billed for actual time spent and materials used. Scope can evolve across sprints.",
    keyFields: [
      { label: "Rate Card (per resource)", example: "₹1,200/hr – Sr. Dev" },
      { label: "Monthly Cap", example: "₹5,00,000/month" },
      { label: "Sprint Cadence", example: "2 weeks" },
      { label: "Billing Frequency", example: "Monthly" },
      { label: "Resource Mix", example: "2 Dev, 1 QA, 0.5 PM" },
    ],
    phases: ["Kickoff", "Sprint 1", "Sprint 2", "Sprint N", "Closure"],
    bestFor: "Evolving scope where client wants control over backlog",
  },
  {
    id: "dedicated", name: "Dedicated Team", icon: "👥", workflow: "Agile ongoing",
    flexibility: "High", billing: "Monthly per resource",
    color: "bg-teal-50", borderColor: "border-teal-300", headerColor: "bg-teal-600", pillColor: "bg-teal-100 text-teal-700",
    description: "A dedicated offshore/nearshore team working exclusively for the client under their direction.",
    keyFields: [
      { label: "Team Size", example: "6 FTEs" },
      { label: "Monthly Team Cost", example: "Auto-calculated" },
      { label: "Contract Duration", example: "12 months" },
      { label: "Notice Period", example: "30 days" },
      { label: "Resource Availability", example: "100% / 50% / 25%" },
    ],
    phases: ["Onboarding", "Month 1", "Month 2", "Month N", "Renewal / Exit"],
    bestFor: "Clients needing full-time embedded engineering capacity",
  },
  {
    id: "bot", name: "BOT", icon: "🔄", workflow: "Phased transfer",
    flexibility: "Medium", billing: "Contract-based",
    color: "bg-orange-50", borderColor: "border-orange-300", headerColor: "bg-orange-600", pillColor: "bg-orange-100 text-orange-700",
    description: "Build–Operate–Transfer: vendor builds the team/system, operates it, then transfers ownership to client.",
    keyFields: [
      { label: "Build Phase Duration", example: "6 months" },
      { label: "Operate Phase Duration", example: "12 months" },
      { label: "Transfer Timeline", example: "Month 18–24" },
      { label: "IP Ownership Transfer Date", example: "2027-06-01" },
      { label: "Transition Plan", example: "Knowledge transfer doc" },
    ],
    phases: ["Build", "Operate", "Transfer"],
    bestFor: "Clients wanting to eventually own a fully operational team/product",
  },
  {
    id: "staffaug", name: "Staff Augmentation", icon: "➕", workflow: "Task-based",
    flexibility: "High", billing: "Monthly per person",
    color: "bg-cyan-50", borderColor: "border-cyan-300", headerColor: "bg-cyan-600", pillColor: "bg-cyan-100 text-cyan-700",
    description: "Individual resources placed with the client team to fill specific skill gaps, working under client management.",
    keyFields: [
      { label: "Technology Stack", example: "React, Node.js, DevOps" },
      { label: "Resources Required", example: "Auto-calculated" },
      { label: "Availability per Resource", example: "100% / 50% / 25%" },
      { label: "Effective Resources", example: "0.5 = 50% available" },
      { label: "Minimum Commitment", example: "3 months" },
    ],
    phases: [],
    bestFor: "Filling specific skill gaps within an existing client team",
  },
  {
    id: "outcome", name: "Outcome-based", icon: "🎯", workflow: "KPI-based",
    flexibility: "Medium", billing: "Performance-based",
    color: "bg-rose-50", borderColor: "border-rose-300", headerColor: "bg-rose-600", pillColor: "bg-rose-100 text-rose-700",
    description: "Billing tied to agreed KPIs and business outcomes — not time or deliverables.",
    keyFields: [
      { label: "Success KPIs", example: "99.9% uptime, < 2s load" },
      { label: "Base Fee", example: "₹3,00,000/month" },
      { label: "Performance Bonus", example: "+20% on KPI hit" },
      { label: "Penalty Clause", example: "-10% if below threshold" },
    ],
    phases: ["Goal Setting", "Baseline", "Execution", "KPI Review", "Payout"],
    bestFor: "Clients who want vendor skin-in-the-game for results",
  },
  {
    id: "milestone", name: "Milestone", icon: "🏁", workflow: "Stage-based",
    flexibility: "Medium", billing: "Phase payments",
    color: "bg-amber-50", borderColor: "border-amber-300", headerColor: "bg-amber-600", pillColor: "bg-amber-100 text-amber-700",
    description: "Payments unlocked on achieving predefined project milestones — combines fixed scope with phased billing.",
    keyFields: [
      { label: "Milestone Name", example: "MVP Delivery" },
      { label: "Milestone Amount", example: "Auto-calculated from %" },
      { label: "Acceptance Criteria", example: "Signed UAT report" },
      { label: "Due Date", example: "2026-08-15" },
      { label: "Payment Terms", example: "Net 15 after sign-off" },
    ],
    phases: ["M1: Kickoff", "M2: Requirements", "M3: MVP", "M4: UAT", "M5: Go Live"],
    bestFor: "Projects with clear stages where client pays on verified completion",
  },
]

// ── SaaS billing state ───────────────────────────────────────────────────────
const SAAS_PLANS = [
  { type: "Starter", ratePerUser: 599 },
  { type: "Growth", ratePerUser: 999 },
  { type: "Enterprise", ratePerUser: 1499 },
]

// ── Dedicated Team resource state ────────────────────────────────────────────
const AVAIL_OPTS = [100, 75, 50, 25]
type DResource = { id: string; name: string; role: string; monthlyRate: number; availability: number }

// ── Staff Aug resource state ─────────────────────────────────────────────────
type SAResource = { id: string; tech: string; resourcesRequired: number; availability: number; monthlyRate: number }

// ── Milestone billing state ──────────────────────────────────────────────────
type MSItem = { id: string; name: string; pct: number; dueDate: string; status: string }

export default function ProjectTypesPage() {
  const [selected, setSelected] = useState<ProjectModel>(MODELS[0])
  const [tab, setTab] = useState<"fields" | "billing" | "phases">("fields")

  // ── SaaS state
  const [saasPlan, setSaasPlan] = useState("Growth")
  const [saasUsers, setSaasUsers] = useState(50)
  const [saasDuration, setSaasDuration] = useState(12)
  const saasRate = SAAS_PLANS.find(p => p.type === saasPlan)?.ratePerUser ?? 999
  const saasMonthly = saasRate * saasUsers
  const saasTotal = saasMonthly * saasDuration

  // ── T&M state
  const [tmResources, setTmResources] = useState([
    { id: "t1", name: "Rahul S.", role: "Backend Lead", hourlyRate: 1000, hoursPerMonth: 160 },
    { id: "t2", name: "Priya M.", role: "Frontend Dev", hourlyRate: 875, hoursPerMonth: 160 },
    { id: "t3", name: "Amit K.", role: "DevOps Engineer", hourlyRate: 938, hoursPerMonth: 80 },
  ])
  const [tmDuration, setTmDuration] = useState(4)
  const tmMonthly = tmResources.reduce((s, r) => s + r.hourlyRate * r.hoursPerMonth, 0)
  const tmTotal = tmMonthly * tmDuration

  // ── Dedicated Team state
  const [dedicatedResources, setDedicatedResources] = useState<DResource[]>([
    { id: "d1", name: "Rahul S.", role: "Backend Lead", monthlyRate: 160000, availability: 100 },
    { id: "d2", name: "Priya M.", role: "Frontend Dev", monthlyRate: 140000, availability: 100 },
    { id: "d3", name: "Amit K.", role: "DevOps Engineer", monthlyRate: 150000, availability: 50 },
    { id: "d4", name: "Sneha R.", role: "UI/UX Designer", monthlyRate: 120000, availability: 25 },
    { id: "d5", name: "Vikram P.", role: "Full Stack Dev", monthlyRate: 180000, availability: 100 },
    { id: "d6", name: "Meera J.", role: "QA Engineer", monthlyRate: 100000, availability: 50 },
  ])
  const [dedicatedDuration, setDedicatedDuration] = useState(12)
  const dedicatedMonthly = dedicatedResources.reduce((s, r) => s + r.monthlyRate * (r.availability / 100), 0)
  const dedicatedTotal = dedicatedMonthly * dedicatedDuration

  // ── BOT state
  const [bot, setBot] = useState({ buildCost: 2500000, operateFee: 400000, operateDuration: 12, transferFee: 500000 })
  const [botFields, setBotFields] = useState({
    buildDuration: "6",
    operateDuration: "12",
    transferTimeline: "Month 18–24",
    ipTransferDate: "2027-06-01",
    transitionPlan: "Knowledge transfer documentation, team handover, runbook delivery",
  })
  const botTotal = bot.buildCost + bot.operateFee * bot.operateDuration + bot.transferFee

  // ── Staff Aug state
  const [saResources, setSaResources] = useState<SAResource[]>([
    { id: "sa1", tech: "React / Frontend", resourcesRequired: 2, availability: 100, monthlyRate: 120000 },
    { id: "sa2", tech: "Node.js / Backend", resourcesRequired: 1, availability: 50, monthlyRate: 140000 },
    { id: "sa3", tech: "DevOps / Cloud", resourcesRequired: 1, availability: 25, monthlyRate: 150000 },
    { id: "sa4", tech: "QA / Testing", resourcesRequired: 1, availability: 100, monthlyRate: 100000 },
  ])
  const [saDuration, setSaDuration] = useState(3)
  const saMonthlyCost = saResources.reduce((s, r) => s + r.monthlyRate * r.resourcesRequired * (r.availability / 100), 0)
  const saEffectiveResources = saResources.reduce((s, r) => s + r.resourcesRequired * (r.availability / 100), 0)
  const saTotal = saMonthlyCost * saDuration

  // ── Outcome state
  const [outcome, setOutcome] = useState({ baseFee: 300000, bonusPct: 20, penaltyPct: 10, duration: 6 })
  const outcomeBase = outcome.baseFee * outcome.duration
  const outcomeBonus = outcomeBase * (outcome.bonusPct / 100)
  const outcomeTotal = outcomeBase + outcomeBonus

  // ── Milestone state
  const [msProjectCost, setMsProjectCost] = useState(1850000)
  const [milestones, setMilestones] = useState<MSItem[]>([
    { id: "ms1", name: "Advance on Agreement Signing", pct: 25, dueDate: "2026-06-05", status: "Pending" },
    { id: "ms2", name: "On Requirements Freeze", pct: 20, dueDate: "2026-06-20", status: "Pending" },
    { id: "ms3", name: "On MVP Delivery", pct: 30, dueDate: "2026-08-15", status: "Pending" },
    { id: "ms4", name: "On UAT Sign-off", pct: 15, dueDate: "2026-09-10", status: "Pending" },
    { id: "ms5", name: "On Go Live", pct: 10, dueDate: "2026-09-30", status: "Pending" },
  ])
  const [editMsId, setEditMsId] = useState<string | null>(null)
  const [editMs, setEditMs] = useState<MSItem | null>(null)
  const totalMsPct = milestones.reduce((s, m) => s + m.pct, 0)

  function handleSelect(id: string) {
    const m = MODELS.find(m => m.id === id)
    if (m) { setSelected(m); setTab("fields") }
  }

  // compute total project cost per model
  function getTotal() {
    if (selected.id === "saas") return saasTotal
    if (selected.id === "tm") return tmTotal
    if (selected.id === "dedicated") return dedicatedTotal
    if (selected.id === "bot") return botTotal
    if (selected.id === "staffaug") return saTotal
    if (selected.id === "outcome") return outcomeTotal
    if (selected.id === "milestone") return msProjectCost
    return 0
  }

  const hasPhasesTab = selected.id !== "staffaug"

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <ProjectBanner />

      {/* Hero banner */}
      <div className={`rounded-2xl border-2 ${selected.borderColor} ${selected.color} px-6 py-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{selected.icon}</span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Project Type Guide</p>
              <h1 className="text-2xl font-bold text-slate-800">{selected.name}</h1>
              <p className="text-sm text-slate-500 mt-0.5 max-w-lg">{selected.description}</p>
            </div>
          </div>
          <div className="shrink-0">
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Switch Project Type</label>
            <select
              value={selected.id}
              onChange={e => handleSelect(e.target.value)}
              className="border-2 border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold bg-white text-slate-700 focus:ring-2 focus:ring-indigo-300 focus:outline-none shadow-sm min-w-[220px] cursor-pointer"
            >
              {MODELS.map(m => <option key={m.id} value={m.id}>{m.icon}  {m.name}</option>)}
            </select>
          </div>
        </div>
        {/* stats strip */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-200">
          {[
            { label: "Workflow", value: selected.workflow },
            { label: "Billing", value: selected.billing },
            { label: "Best for", value: selected.bestFor },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-slate-200 text-xs">
              <span className="text-slate-400 font-medium">{s.label}</span>
              <span className="font-semibold text-slate-700">{s.value}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-slate-200 text-xs">
            <span className="text-slate-400 font-medium">Flexibility</span>
            <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${FLEXIBILITY_COLOR[selected.flexibility]}`}>{selected.flexibility}</span>
          </div>
          {getTotal() > 0 && (
            <div className="flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-3 py-1.5 border border-indigo-700 text-xs ml-auto">
              <span className="font-medium">Project Cost</span>
              <span className="font-bold text-sm">{fmt(getTotal())}</span>
            </div>
          )}
        </div>
      </div>

      {/* Pill switcher */}
      <div className="flex flex-wrap gap-2">
        {MODELS.map(m => (
          <button key={m.id} onClick={() => handleSelect(m.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              selected.id === m.id ? `${m.pillColor} border-current shadow-sm scale-105` : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
            }`}>
            <span>{m.icon}</span>{m.name}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {(["fields", "billing", ...(hasPhasesTab ? ["phases"] : [])] as const).map(t => (
            <button key={t} onClick={() => setTab(t as typeof tab)}
              className={`px-6 py-3.5 text-sm font-medium transition-colors ${
                tab === t ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}>
              {t === "fields" ? "Key Onboarding Fields" : t === "billing" ? "Billing Configuration" : "Phase Timeline"}
            </button>
          ))}
          <div className="ml-auto flex items-center px-4 gap-3">
            {getTotal() > 0 && (
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                Total: {fmt(getTotal())}
              </span>
            )}
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${selected.pillColor}`}>{selected.icon} {selected.name}</span>
          </div>
        </div>

        {/* ── KEY FIELDS TAB ─────────────────────────────────────────────── */}
        {tab === "fields" && (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Auto-filled from CRM</p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Project Name", example: "Alpha Web Application Suite" },
                    { label: "Project ID", example: "PRJ-2026-0048" },
                    { label: "Client Name", example: "Nexgen Technologies Pvt. Ltd." },
                    { label: "Currency", example: "INR ₹" },
                    { label: "Start Date", example: "2026-06-01" },
                    { label: "End Date", example: "2026-09-30" },
                    { label: "Description", example: "Full-stack web application suite…" },
                  ].map(f => (
                    <div key={f.label} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                      <span className="text-xs text-slate-600 font-medium">{f.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-mono">{f.example}</span>
                        <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-medium">CRM</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${selected.headerColor}`} />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{selected.name} — Required fields</p>
                </div>

                {/* BOT — editable required fields */}
                {selected.id === "bot" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-700 font-semibold block mb-1">Build Phase Duration (months)</label>
                      <input value={botFields.buildDuration} onChange={e => setBotFields(f => ({ ...f, buildDuration: e.target.value }))}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 focus:outline-none bg-orange-50" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-700 font-semibold block mb-1">Operate Phase Duration (months)</label>
                      <input value={botFields.operateDuration} onChange={e => setBotFields(f => ({ ...f, operateDuration: e.target.value }))}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 focus:outline-none bg-orange-50" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-700 font-semibold block mb-1">Transfer Timeline</label>
                      <input value={botFields.transferTimeline} onChange={e => setBotFields(f => ({ ...f, transferTimeline: e.target.value }))}
                        placeholder="e.g. Month 18–24"
                        className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 focus:outline-none bg-orange-50" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-700 font-semibold block mb-1">IP Ownership Transfer Date</label>
                      <input type="date" value={botFields.ipTransferDate} onChange={e => setBotFields(f => ({ ...f, ipTransferDate: e.target.value }))}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 focus:outline-none bg-orange-50" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-700 font-semibold block mb-1">Transition Plan</label>
                      <textarea rows={2} value={botFields.transitionPlan} onChange={e => setBotFields(f => ({ ...f, transitionPlan: e.target.value }))}
                        className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-orange-300 focus:outline-none bg-orange-50" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selected.keyFields.map(f => (
                      <div key={f.label} className={`flex items-center justify-between rounded-lg px-3 py-2.5 border ${selected.color} ${selected.borderColor}`}>
                        <span className="text-xs text-slate-700 font-semibold">{f.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">{f.example}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${selected.pillColor}`}>Required</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
                  <strong>Note:</strong> For <strong>{selected.name}</strong>, these fields drive the billing calculation on the next tab.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BILLING TAB ────────────────────────────────────────────────── */}
        {tab === "billing" && (
          <div className="p-6 space-y-5">

            {/* ── SaaS ─────────────────────────────────────── */}
            {selected.id === "saas" && (
              <>
                <div className={`rounded-xl px-5 py-3 text-white text-sm font-semibold flex items-center gap-2 ${selected.headerColor}`}>
                  ☁️ SaaS — Subscription Billing
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-slate-700 font-semibold block mb-1">Subscription Type</label>
                    <select value={saasPlan} onChange={e => setSaasPlan(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none">
                      {SAAS_PLANS.map(p => <option key={p.type}>{p.type}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-700 font-semibold block mb-1">Number of Users</label>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button onClick={() => setSaasUsers(u => Math.max(1, u - 1))} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm">−</button>
                      <input type="number" value={saasUsers} onChange={e => setSaasUsers(Math.max(1, Number(e.target.value)))}
                        className="flex-1 text-center text-sm font-semibold py-2 focus:outline-none" />
                      <button onClick={() => setSaasUsers(u => u + 1)} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-700 font-semibold block mb-1">Duration (months)</label>
                    <input type="number" value={saasDuration} onChange={e => setSaasDuration(Math.max(1, Number(e.target.value)))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none" />
                  </div>
                </div>
                <div className={`rounded-xl border-2 ${selected.borderColor} ${selected.color} p-5 grid grid-cols-4 gap-4`}>
                  <div className="text-center"><p className="text-xs text-slate-500 mb-1">Rate / User / Month</p><p className="text-lg font-bold text-slate-800">{fmt(saasRate)}</p></div>
                  <div className="text-center"><p className="text-xs text-slate-500 mb-1">Users</p><p className="text-lg font-bold text-slate-800">{saasUsers}</p></div>
                  <div className="text-center"><p className="text-xs text-slate-500 mb-1">Monthly Revenue</p><p className="text-lg font-bold text-violet-700">{fmt(saasMonthly)}</p></div>
                  <div className="text-center"><p className="text-xs text-slate-500 mb-1">Total ({saasDuration} months)</p><p className="text-xl font-bold text-indigo-700">{fmt(saasTotal)}</p></div>
                </div>
              </>
            )}

            {/* ── T&M ─────────────────────────────────────── */}
            {selected.id === "tm" && (
              <>
                <div className={`rounded-xl px-5 py-3 text-white text-sm font-semibold flex items-center gap-2 ${selected.headerColor}`}>
                  ⏱️ Time & Material — Resource Billing
                </div>
                <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Resource", "Role", "Hourly Rate (₹)", "Hours/Month", "Monthly Cost"].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tmResources.map(r => (
                      <tr key={r.id} className="border-t border-slate-100">
                        <td className="px-3 py-2.5 font-medium text-slate-700">{r.name}</td>
                        <td className="px-3 py-2.5 text-slate-500">{r.role}</td>
                        <td className="px-3 py-2.5">
                          <input type="number" value={r.hourlyRate}
                            onChange={e => setTmResources(list => list.map(x => x.id === r.id ? { ...x, hourlyRate: Number(e.target.value) } : x))}
                            className="w-24 border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-300 focus:outline-none" />
                        </td>
                        <td className="px-3 py-2.5">
                          <input type="number" value={r.hoursPerMonth}
                            onChange={e => setTmResources(list => list.map(x => x.id === r.id ? { ...x, hoursPerMonth: Number(e.target.value) } : x))}
                            className="w-20 border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-300 focus:outline-none" />
                        </td>
                        <td className="px-3 py-2.5 font-semibold text-blue-700">{fmt(r.hourlyRate * r.hoursPerMonth)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-xs text-slate-700 font-semibold block mb-1">Duration (months)</label>
                    <input type="number" value={tmDuration} onChange={e => setTmDuration(Math.max(1, Number(e.target.value)))}
                      className="w-32 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none" />
                  </div>
                  <div className={`flex-1 rounded-xl border-2 ${selected.borderColor} ${selected.color} p-4 grid grid-cols-3 gap-4`}>
                    <div className="text-center"><p className="text-xs text-slate-500 mb-1">Monthly Cost</p><p className="text-lg font-bold text-blue-700">{fmt(tmMonthly)}</p></div>
                    <div className="text-center"><p className="text-xs text-slate-500 mb-1">Duration</p><p className="text-lg font-bold text-slate-800">{tmDuration} months</p></div>
                    <div className="text-center"><p className="text-xs text-slate-500 mb-1">Project Cost</p><p className="text-xl font-bold text-indigo-700">{fmt(tmTotal)}</p></div>
                  </div>
                </div>
              </>
            )}

            {/* ── Dedicated Team ───────────────────────────── */}
            {selected.id === "dedicated" && (
              <>
                <div className={`rounded-xl px-5 py-3 text-white text-sm font-semibold flex items-center gap-2 ${selected.headerColor}`}>
                  👥 Dedicated Team — Resource Cost (availability-adjusted)
                </div>
                <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Resource", "Role", "Monthly Rate (₹)", "Availability", "Effective Cost/Month"].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dedicatedResources.map(r => {
                      const effectiveCost = r.monthlyRate * (r.availability / 100)
                      return (
                        <tr key={r.id} className="border-t border-slate-100">
                          <td className="px-3 py-2.5 font-medium text-slate-700">{r.name}</td>
                          <td className="px-3 py-2.5 text-slate-500 text-xs">{r.role}</td>
                          <td className="px-3 py-2.5">
                            <input type="number" value={r.monthlyRate}
                              onChange={e => setDedicatedResources(list => list.map(x => x.id === r.id ? { ...x, monthlyRate: Number(e.target.value) } : x))}
                              className="w-28 border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-teal-300 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <select value={r.availability}
                                onChange={e => setDedicatedResources(list => list.map(x => x.id === r.id ? { ...x, availability: Number(e.target.value) } : x))}
                                className="border border-slate-200 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-teal-300 focus:outline-none">
                                {AVAIL_OPTS.map(a => <option key={a} value={a}>{a}%</option>)}
                              </select>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                r.availability === 100 ? "bg-green-100 text-green-700" :
                                r.availability === 75 ? "bg-teal-100 text-teal-700" :
                                r.availability === 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                              }`}>{r.availability === 100 ? "Full" : r.availability === 75 ? "3/4" : r.availability === 50 ? "Half" : "1/4"}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`font-semibold text-sm ${r.availability < 100 ? "text-amber-600" : "text-teal-700"}`}>{fmt(effectiveCost)}</span>
                            {r.availability < 100 && <span className="text-xs text-slate-400 ml-1">({r.availability}% of {fmt(r.monthlyRate)})</span>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-xs font-semibold text-slate-600">Monthly Team Cost</td>
                      <td className="px-3 py-2 font-bold text-teal-700">{fmt(dedicatedMonthly)}</td>
                    </tr>
                  </tfoot>
                </table>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-xs text-slate-700 font-semibold block mb-1">Contract Duration (months)</label>
                    <input type="number" value={dedicatedDuration} onChange={e => setDedicatedDuration(Math.max(1, Number(e.target.value)))}
                      className="w-32 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none" />
                  </div>
                  <div className={`flex-1 rounded-xl border-2 ${selected.borderColor} ${selected.color} p-4 grid grid-cols-3 gap-4`}>
                    <div className="text-center"><p className="text-xs text-slate-500 mb-1">Monthly Team Cost</p><p className="text-lg font-bold text-teal-700">{fmt(dedicatedMonthly)}</p></div>
                    <div className="text-center"><p className="text-xs text-slate-500 mb-1">Duration</p><p className="text-lg font-bold text-slate-800">{dedicatedDuration} months</p></div>
                    <div className="text-center"><p className="text-xs text-slate-500 mb-1">Total Project Cost</p><p className="text-xl font-bold text-indigo-700">{fmt(dedicatedTotal)}</p></div>
                  </div>
                </div>
              </>
            )}

            {/* ── BOT ──────────────────────────────────────── */}
            {selected.id === "bot" && (
              <>
                <div className={`rounded-xl px-5 py-3 text-white text-sm font-semibold flex items-center gap-2 ${selected.headerColor}`}>
                  🔄 BOT — Cost Breakdown (editable)
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`rounded-xl border-2 ${selected.borderColor} ${selected.color} p-4 space-y-3`}>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Build Phase</p>
                    <div>
                      <label className="text-xs text-slate-700 font-semibold block mb-1">Build Cost (₹)</label>
                      <input type="number" value={bot.buildCost} onChange={e => setBot(b => ({ ...b, buildCost: Number(e.target.value) }))}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 focus:outline-none" />
                    </div>
                    <div className="text-right text-sm font-bold text-orange-700">{fmt(bot.buildCost)}</div>
                  </div>
                  <div className={`rounded-xl border-2 ${selected.borderColor} ${selected.color} p-4 space-y-3`}>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Operate Phase</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-700 font-semibold block mb-1">Monthly Fee (₹)</label>
                        <input type="number" value={bot.operateFee} onChange={e => setBot(b => ({ ...b, operateFee: Number(e.target.value) }))}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-700 font-semibold block mb-1">Duration (months)</label>
                        <input type="number" value={bot.operateDuration} onChange={e => setBot(b => ({ ...b, operateDuration: Number(e.target.value) }))}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 focus:outline-none" />
                      </div>
                    </div>
                    <div className="text-right text-sm font-bold text-orange-700">{fmt(bot.operateFee * bot.operateDuration)}</div>
                  </div>
                  <div className={`rounded-xl border-2 ${selected.borderColor} ${selected.color} p-4 space-y-3`}>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Transfer Phase</p>
                    <div>
                      <label className="text-xs text-slate-700 font-semibold block mb-1">Transfer Fee (₹)</label>
                      <input type="number" value={bot.transferFee} onChange={e => setBot(b => ({ ...b, transferFee: Number(e.target.value) }))}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 focus:outline-none" />
                    </div>
                    <div className="text-right text-sm font-bold text-orange-700">{fmt(bot.transferFee)}</div>
                  </div>
                  <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-4 flex flex-col justify-center items-center gap-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total BOT Cost</p>
                    <p className="text-3xl font-bold text-indigo-700">{fmt(botTotal)}</p>
                    <div className="text-xs text-slate-500 space-y-1 w-full">
                      <div className="flex justify-between"><span>Build</span><span className="font-medium">{fmt(bot.buildCost)}</span></div>
                      <div className="flex justify-between"><span>Operate ({bot.operateDuration}mo)</span><span className="font-medium">{fmt(bot.operateFee * bot.operateDuration)}</span></div>
                      <div className="flex justify-between"><span>Transfer</span><span className="font-medium">{fmt(bot.transferFee)}</span></div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Staff Augmentation ──────────────────────── */}
            {selected.id === "staffaug" && (
              <>
                <div className={`rounded-xl px-5 py-3 text-white text-sm font-semibold flex items-center gap-2 ${selected.headerColor}`}>
                  ➕ Staff Augmentation — Resource Calculator
                </div>
                <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Technology Stack", "Resources Required", "Availability", "Effective Resources", "Monthly Rate (₹)", "Monthly Cost"].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {saResources.map(r => {
                      const eff = r.resourcesRequired * (r.availability / 100)
                      const cost = r.monthlyRate * r.resourcesRequired * (r.availability / 100)
                      return (
                        <tr key={r.id} className="border-t border-slate-100">
                          <td className="px-3 py-2.5">
                            <input value={r.tech} onChange={e => setSaResources(list => list.map(x => x.id === r.id ? { ...x, tech: e.target.value } : x))}
                              className="w-36 border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-cyan-300 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center border border-slate-200 rounded overflow-hidden w-24">
                              <button onClick={() => setSaResources(list => list.map(x => x.id === r.id ? { ...x, resourcesRequired: Math.max(1, x.resourcesRequired - 1) } : x))} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-bold">−</button>
                              <span className="flex-1 text-center text-xs font-semibold py-1">{r.resourcesRequired}</span>
                              <button onClick={() => setSaResources(list => list.map(x => x.id === r.id ? { ...x, resourcesRequired: x.resourcesRequired + 1 } : x))} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-bold">+</button>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <select value={r.availability} onChange={e => setSaResources(list => list.map(x => x.id === r.id ? { ...x, availability: Number(e.target.value) } : x))}
                              className="border border-slate-200 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-cyan-300 focus:outline-none">
                              {AVAIL_OPTS.map(a => <option key={a} value={a}>{a}%</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${eff >= 1 ? "bg-green-100 text-green-700" : eff >= 0.5 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                              {eff.toFixed(2)} res
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <input type="number" value={r.monthlyRate} onChange={e => setSaResources(list => list.map(x => x.id === r.id ? { ...x, monthlyRate: Number(e.target.value) } : x))}
                              className="w-28 border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-cyan-300 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2.5 font-semibold text-cyan-700">{fmt(cost)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-xs font-semibold text-slate-600">Totals</td>
                      <td className="px-3 py-2 text-xs font-bold text-cyan-700">{saEffectiveResources.toFixed(2)} eff. res</td>
                      <td className="px-3 py-2"></td>
                      <td className="px-3 py-2 font-bold text-cyan-700">{fmt(saMonthlyCost)}/mo</td>
                    </tr>
                  </tfoot>
                </table>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-xs text-slate-700 font-semibold block mb-1">Engagement Duration (months)</label>
                    <input type="number" value={saDuration} onChange={e => setSaDuration(Math.max(1, Number(e.target.value)))}
                      className="w-32 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none" />
                  </div>
                  <div className={`flex-1 rounded-xl border-2 ${selected.borderColor} ${selected.color} p-4 grid grid-cols-3 gap-4`}>
                    <div className="text-center"><p className="text-xs text-slate-500 mb-1">Monthly Cost</p><p className="text-lg font-bold text-cyan-700">{fmt(saMonthlyCost)}</p></div>
                    <div className="text-center"><p className="text-xs text-slate-500 mb-1">Duration</p><p className="text-lg font-bold text-slate-800">{saDuration} months</p></div>
                    <div className="text-center"><p className="text-xs text-slate-500 mb-1">Total Project Cost</p><p className="text-xl font-bold text-indigo-700">{fmt(saTotal)}</p></div>
                  </div>
                </div>
              </>
            )}

            {/* ── Outcome-based ────────────────────────────── */}
            {selected.id === "outcome" && (
              <>
                <div className={`rounded-xl px-5 py-3 text-white text-sm font-semibold flex items-center gap-2 ${selected.headerColor}`}>
                  🎯 Outcome-based — Performance Billing
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-700 font-semibold block mb-1">Base Monthly Fee (₹)</label>
                      <input type="number" value={outcome.baseFee} onChange={e => setOutcome(o => ({ ...o, baseFee: Number(e.target.value) }))}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-700 font-semibold block mb-1">Performance Bonus %</label>
                        <input type="number" value={outcome.bonusPct} onChange={e => setOutcome(o => ({ ...o, bonusPct: Number(e.target.value) }))}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-700 font-semibold block mb-1">Penalty %</label>
                        <input type="number" value={outcome.penaltyPct} onChange={e => setOutcome(o => ({ ...o, penaltyPct: Number(e.target.value) }))}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-700 font-semibold block mb-1">Duration (months)</label>
                      <input type="number" value={outcome.duration} onChange={e => setOutcome(o => ({ ...o, duration: Number(e.target.value) }))}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-700 font-semibold block mb-1">Success KPIs</label>
                      <textarea rows={2} defaultValue="99.9% uptime · Page load < 2s · CSAT > 4.5"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-indigo-300 focus:outline-none" />
                    </div>
                  </div>
                  <div className={`rounded-xl border-2 ${selected.borderColor} ${selected.color} p-5 flex flex-col justify-center space-y-4`}>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cost Breakdown</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Base ({outcome.duration} months)</span><span className="font-semibold text-slate-700">{fmt(outcomeBase)}</span></div>
                      <div className="flex justify-between text-green-700"><span>+ Bonus ({outcome.bonusPct}% on hit)</span><span className="font-semibold">+{fmt(outcomeBonus)}</span></div>
                      <div className="flex justify-between text-red-600"><span>− Penalty ({outcome.penaltyPct}% if missed)</span><span className="font-semibold">−{fmt(outcomeBase * outcome.penaltyPct / 100)}</span></div>
                      <div className="flex justify-between border-t border-slate-200 pt-2 text-indigo-700"><span className="font-bold">Total Project Cost</span><span className="font-bold text-lg">{fmt(outcomeTotal)}</span></div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Milestone ────────────────────────────────── */}
            {selected.id === "milestone" && (
              <>
                <div className={`rounded-xl px-5 py-3 text-white text-sm font-semibold flex items-center gap-2 ${selected.headerColor}`}>
                  🏁 Milestone — Editable Payment Schedule
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <div>
                    <label className="text-xs text-slate-700 font-semibold block mb-1">Total Project Cost (₹)</label>
                    <input type="number" value={msProjectCost} onChange={e => setMsProjectCost(Number(e.target.value))}
                      className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold w-44 focus:ring-2 focus:ring-indigo-300 focus:outline-none" />
                  </div>
                  <div className={`text-sm px-4 py-2 rounded-lg font-semibold ${totalMsPct === 100 ? "bg-green-100 text-green-700" : totalMsPct < 100 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                    Total %: {totalMsPct}% {totalMsPct === 100 ? "✓" : totalMsPct < 100 ? `(${100 - totalMsPct}% remaining)` : "(over by " + (totalMsPct - 100) + "%)"}
                  </div>
                </div>
                <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50">
                    <tr>
                      {["#", "Milestone Name", "% of Total", "Amount (₹)", "Due Date", "Status", "Actions"].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {milestones.map((m, i) => (
                      <tr key={m.id} className="border-t border-slate-100">
                        {editMsId === m.id && editMs ? (
                          <>
                            <td className="px-3 py-2 text-xs text-slate-400">{i + 1}</td>
                            <td className="px-3 py-2">
                              <input value={editMs.name} onChange={e => setEditMs({ ...editMs, name: e.target.value })}
                                className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-300 focus:outline-none" />
                            </td>
                            <td className="px-3 py-2">
                              <input type="number" value={editMs.pct} onChange={e => setEditMs({ ...editMs, pct: Number(e.target.value) })}
                                className="w-16 border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-300 focus:outline-none" />
                            </td>
                            <td className="px-3 py-2 text-xs text-slate-400 font-mono">{fmt(msProjectCost * editMs.pct / 100)}</td>
                            <td className="px-3 py-2">
                              <input type="date" value={editMs.dueDate} onChange={e => setEditMs({ ...editMs, dueDate: e.target.value })}
                                className="border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-300 focus:outline-none" />
                            </td>
                            <td className="px-3 py-2">
                              <select value={editMs.status} onChange={e => setEditMs({ ...editMs, status: e.target.value })}
                                className="border border-slate-200 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-amber-300 focus:outline-none">
                                {["Pending", "Invoiced", "Received", "Overdue"].map(s => <option key={s}>{s}</option>)}
                              </select>
                            </td>
                            <td className="px-3 py-2 flex gap-1">
                              <button onClick={() => { setMilestones(list => list.map(x => x.id === m.id ? editMs! : x)); setEditMsId(null) }}
                                className="text-xs bg-amber-600 text-white px-2 py-1 rounded hover:bg-amber-700">Save</button>
                              <button onClick={() => setEditMsId(null)} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200">Cancel</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-3 py-2 text-xs text-slate-400">{i + 1}</td>
                            <td className="px-3 py-2 font-medium text-slate-700">{m.name}</td>
                            <td className="px-3 py-2">
                              <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">{m.pct}%</span>
                            </td>
                            <td className="px-3 py-2 font-semibold text-amber-700">{fmt(msProjectCost * m.pct / 100)}</td>
                            <td className="px-3 py-2 text-xs text-slate-500 font-mono">{m.dueDate}</td>
                            <td className="px-3 py-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                m.status === "Received" ? "bg-green-100 text-green-700" :
                                m.status === "Invoiced" ? "bg-blue-100 text-blue-700" :
                                m.status === "Overdue" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                              }`}>{m.status}</span>
                            </td>
                            <td className="px-3 py-2">
                              <button onClick={() => { setEditMsId(m.id); setEditMs({ ...m }) }}
                                className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100">Edit</button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                    <tr>
                      <td colSpan={2} className="px-3 py-2 text-xs font-semibold text-slate-600">Total</td>
                      <td className="px-3 py-2"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${totalMsPct === 100 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{totalMsPct}%</span></td>
                      <td className="px-3 py-2 font-bold text-indigo-700">{fmt(milestones.reduce((s, m) => s + msProjectCost * m.pct / 100, 0))}</td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              </>
            )}
          </div>
        )}

        {/* ── PHASES TAB ─────────────────────────────────────────────────── */}
        {tab === "phases" && hasPhasesTab && (
          <div className="p-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Lifecycle Phases</p>
            <div className="relative max-w-xl">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200" />
              <div className="space-y-3">
                {selected.phases.map((ph, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 z-10 ${selected.headerColor}`}>{i + 1}</div>
                    <div className={`flex-1 rounded-lg px-4 py-3 border-2 ${i === 0 ? selected.borderColor + " " + selected.color : "border-slate-100 bg-slate-50"}`}>
                      <p className="text-sm font-semibold text-slate-700">{ph}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {i === 0 ? "Project initiation, team setup, stakeholder alignment" :
                         i === selected.phases.length - 1 ? "Final delivery, client sign-off, handover & closure" :
                         "Active execution, reviews, client feedback & iteration"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
