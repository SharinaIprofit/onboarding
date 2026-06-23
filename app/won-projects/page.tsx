"use client";
import { useState, useEffect } from "react";

type WBSItem = {
  id: string;
  code: string;
  title: string;
  type: "Epic" | "Story" | "Task" | "Bug";
  hours: number;
  category: string;
};

type WonProject = {
  id: string;
  name: string;
  projectId: string;
  projectType: string;
  client: string;
  clientContact: {
    name: string;
    designation: string;
    email: string;
    phone: string;
    department: string;
  };
  spoc: string;
  spocRole: string;
  totalCost: number;
  currency: string;
  deliveryMonths: number;
  startDate: string;
  endDate: string;
  agreementSigned: boolean;
  agreementRef: string;
  agreementDate: string;
  closedDate: string;
  dealSource: "CRM" | "Government RFP";
  salesRep: string;
  notes: string;
  wbsItems: WBSItem[];
  risks: { description: string; impact: string; probability: string; mitigation: string }[];
  milestones: { name: string; dueDate: string; deliverable: string }[];
  status: "Won" | "Converted";
  convertedDate?: string;
  convertedSource?: "CRM" | "Government RFP";
};

const INITIAL_PROJECTS: WonProject[] = [
  {
    id: "WP-001",
    name: "Alpha Web Application Suite",
    projectId: "PRJ-2026-0048",
    projectType: "Fixed Price",
    client: "Nexgen Technologies Pvt. Ltd.",
    clientContact: {
      name: "Rajesh Kumar",
      designation: "Chief Executive Officer",
      email: "rajesh.kumar@nexgen-tech.in",
      phone: "+91 98450 12345",
      department: "Executive",
    },
    spoc: "Arjun Mehta",
    spocRole: "Sales Manager",
    totalCost: 1850000,
    currency: "INR",
    deliveryMonths: 4,
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    agreementSigned: true,
    agreementRef: "AGR-2026-NXT-0091",
    agreementDate: "2026-05-28",
    closedDate: "2026-05-26",
    dealSource: "CRM",
    salesRep: "Arjun Mehta",
    notes: "High-priority client. Full-stack web application covering user management, notifications, analytics dashboard, and admin portal.",
    wbsItems: [
      { id: "W-E01", code: "1.0", title: "User Management Module",              type: "Epic",  hours: 240, category: "Development" },
      { id: "W-E02", code: "2.0", title: "Notification System",                 type: "Epic",  hours: 120, category: "Development" },
      { id: "W-S01", code: "1.1", title: "User Registration & Authentication",  type: "Story", hours: 40,  category: "Backend" },
      { id: "W-S02", code: "1.2", title: "Role-Based Access Control",           type: "Story", hours: 32,  category: "Backend" },
      { id: "W-S03", code: "2.1", title: "Email & Push Notification Engine",    type: "Story", hours: 28,  category: "Backend" },
      { id: "W-T01", code: "0.1", title: "Project Scaffolding & CI/CD Setup",   type: "Task",  hours: 24,  category: "DevOps" },
      { id: "W-T02", code: "0.2", title: "UI/UX Design & Wireframes",           type: "Task",  hours: 48,  category: "Design" },
      { id: "W-T03", code: "0.3", title: "QA & Test Automation Framework",      type: "Task",  hours: 40,  category: "Testing" },
    ],
    risks: [
      { description: "Scope creep from client change requests", impact: "High", probability: "High", mitigation: "Formal change request process with sign-off" },
      { description: "Third-party API integration failure",      impact: "High", probability: "Low",  mitigation: "Mock APIs and fallback strategy" },
    ],
    milestones: [
      { name: "Project Kickoff",      dueDate: "2026-06-05", deliverable: "Kickoff meeting & signed SOW" },
      { name: "Requirements Freeze",  dueDate: "2026-06-20", deliverable: "BRD & FRD documents" },
      { name: "MVP Delivery",         dueDate: "2026-08-15", deliverable: "Working MVP on staging" },
      { name: "Go Live",              dueDate: "2026-09-30", deliverable: "Production deployment" },
    ],
    status: "Won",
  },
  {
    id: "WP-002",
    name: "Smart City Digital Governance Portal",
    projectId: "PRJ-2026-0051",
    projectType: "Fixed Price",
    client: "Ministry of Urban Development",
    clientContact: {
      name: "Dr. Suresh Iyer",
      designation: "Project Director",
      email: "suresh.iyer@urbandev.gov.in",
      phone: "+91 11 2303 6000",
      department: "IT & Digital Services",
    },
    spoc: "Priya Desai",
    spocRole: "Account Manager",
    totalCost: 4500000,
    currency: "INR",
    deliveryMonths: 8,
    startDate: "2026-07-01",
    endDate: "2027-02-28",
    agreementSigned: false,
    agreementRef: "RFP-GOV-2026-UD-0044",
    agreementDate: "",
    closedDate: "2026-06-10",
    dealSource: "Government RFP",
    salesRep: "Priya Desai",
    notes: "Government portal for citizen services, grievance redressal, and smart city dashboard. Agreement pending final approval from committee.",
    wbsItems: [
      { id: "G-E01", code: "1.0", title: "Citizen Services Portal",             type: "Epic",  hours: 400, category: "Development" },
      { id: "G-E02", code: "2.0", title: "Admin & Governance Dashboard",        type: "Epic",  hours: 320, category: "Development" },
      { id: "G-E03", code: "3.0", title: "Grievance Redressal Module",          type: "Epic",  hours: 200, category: "Development" },
      { id: "G-S01", code: "1.1", title: "Citizen Registration & eKYC",         type: "Story", hours: 60,  category: "Backend" },
      { id: "G-S02", code: "1.2", title: "Service Request Workflow",            type: "Story", hours: 80,  category: "Backend" },
      { id: "G-T01", code: "0.1", title: "Security Audit & Compliance Setup",   type: "Task",  hours: 80,  category: "Security" },
      { id: "G-T02", code: "0.2", title: "Load Testing & Performance Hardening",type: "Task",  hours: 60,  category: "Testing" },
    ],
    risks: [
      { description: "Government approval delays", impact: "High", probability: "Medium", mitigation: "Regular follow-up with nodal officer; buffer in timeline" },
      { description: "Data privacy compliance (IT Act)",  impact: "High", probability: "Low", mitigation: "Legal review and DPA documentation" },
    ],
    milestones: [
      { name: "Agreement Sign-off",     dueDate: "2026-07-05", deliverable: "Signed agreement" },
      { name: "Phase 1 — Citizen Portal", dueDate: "2026-10-15", deliverable: "Citizen portal live on staging" },
      { name: "Phase 2 — Admin Dashboard", dueDate: "2026-12-20", deliverable: "Admin module UAT" },
      { name: "Go Live",                dueDate: "2027-02-28", deliverable: "Full production launch" },
    ],
    status: "Won",
  },
  {
    id: "WP-003",
    name: "FinTrack Mobile Banking App",
    projectId: "PRJ-2026-0039",
    projectType: "Time & Material",
    client: "CapFirst Financial Services Ltd.",
    clientContact: {
      name: "Meera Nambiar",
      designation: "VP — Digital Products",
      email: "meera.nambiar@capfirst.in",
      phone: "+91 99001 55678",
      department: "Digital Banking",
    },
    spoc: "Rohit Verma",
    spocRole: "Business Development",
    totalCost: 1200000,
    currency: "INR",
    deliveryMonths: 3,
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    agreementSigned: true,
    agreementRef: "AGR-2026-CAP-0072",
    agreementDate: "2026-03-25",
    closedDate: "2026-03-20",
    dealSource: "CRM",
    salesRep: "Rohit Verma",
    notes: "React Native mobile app for retail banking customers. Already converted and in active development.",
    wbsItems: [
      { id: "F-E01", code: "1.0", title: "Core Banking Mobile App",             type: "Epic",  hours: 200, category: "Mobile" },
      { id: "F-S01", code: "1.1", title: "Account Dashboard & Transactions",    type: "Story", hours: 40,  category: "Mobile" },
      { id: "F-S02", code: "1.2", title: "Fund Transfer & Bill Payments",       type: "Story", hours: 48,  category: "Mobile" },
      { id: "F-T01", code: "0.1", title: "App Architecture & CI/CD",            type: "Task",  hours: 24,  category: "DevOps" },
    ],
    risks: [],
    milestones: [
      { name: "Alpha Release",  dueDate: "2026-05-15", deliverable: "Internal alpha build" },
      { name: "Beta Release",   dueDate: "2026-06-15", deliverable: "Beta on TestFlight" },
      { name: "App Store Launch", dueDate: "2026-06-30", deliverable: "Public launch" },
    ],
    status: "Converted",
    convertedDate: "2026-03-26",
    convertedSource: "CRM",
  },
  {
    id: "WP-004",
    name: "EduSmart Learning Management Platform",
    projectId: "PRJ-2026-0057",
    projectType: "Milestone-Based",
    client: "EduSmart Pvt. Ltd.",
    clientContact: {
      name: "Ananya Krishnan",
      designation: "Chief Product Officer",
      email: "ananya.k@edusmart.co.in",
      phone: "+91 80 4567 8901",
      department: "Product & Technology",
    },
    spoc: "Sunita Rao",
    spocRole: "Delivery Lead",
    totalCost: 2800000,
    currency: "INR",
    deliveryMonths: 6,
    startDate: "2026-08-01",
    endDate: "2027-01-31",
    agreementSigned: true,
    agreementRef: "AGR-2026-EDU-0018",
    agreementDate: "2026-06-15",
    closedDate: "2026-06-12",
    dealSource: "CRM",
    salesRep: "Sunita Rao",
    notes: "Full LMS platform with live classes, assessments, progress tracking, and AI-powered personalised learning paths.",
    wbsItems: [
      { id: "L-E01", code: "1.0", title: "Course Management System",            type: "Epic",  hours: 320, category: "Development" },
      { id: "L-E02", code: "2.0", title: "Assessment & Quiz Engine",            type: "Epic",  hours: 200, category: "Development" },
      { id: "L-E03", code: "3.0", title: "AI Personalisation Module",           type: "Epic",  hours: 160, category: "AI/ML" },
      { id: "L-S01", code: "1.1", title: "Live Class & Webinar Integration",    type: "Story", hours: 56,  category: "Backend" },
      { id: "L-S02", code: "2.1", title: "MCQ & Descriptive Question Banks",    type: "Story", hours: 40,  category: "Backend" },
      { id: "L-T01", code: "0.1", title: "Multi-tenant Architecture Setup",     type: "Task",  hours: 40,  category: "Architecture" },
      { id: "L-T02", code: "0.2", title: "Video CDN Integration (AWS CloudFront)", type: "Task", hours: 32, category: "Infrastructure" },
    ],
    risks: [
      { description: "AI model accuracy below threshold",   impact: "Medium", probability: "Medium", mitigation: "Use pre-trained models with fine-tuning; set accuracy KPIs" },
      { description: "Video streaming performance at scale", impact: "High",   probability: "Low",    mitigation: "CDN setup + load testing before go-live" },
    ],
    milestones: [
      { name: "Phase 1 — Core LMS",       dueDate: "2026-10-15", deliverable: "Course creation, enrolment, basic dashboard" },
      { name: "Phase 2 — Assessments",    dueDate: "2026-11-30", deliverable: "Quiz engine + grading" },
      { name: "Phase 3 — AI Features",    dueDate: "2027-01-15", deliverable: "Personalised learning paths" },
      { name: "Go Live",                  dueDate: "2027-01-31", deliverable: "Platform launch" },
    ],
    status: "Won",
  },
];

const typeColors: Record<string, string> = {
  "Fixed Price": "bg-indigo-100 text-indigo-700",
  "Time & Material": "bg-teal-100 text-teal-700",
  "Milestone-Based": "bg-purple-100 text-purple-700",
  Retainer: "bg-amber-100 text-amber-700",
  Hybrid: "bg-rose-100 text-rose-700",
};

const wbsTypeColor: Record<string, string> = {
  Epic: "bg-orange-100 text-orange-700",
  Story: "bg-blue-100 text-blue-700",
  Task: "bg-purple-100 text-purple-700",
  Bug: "bg-red-100 text-red-700",
};

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function WonProjectsPage() {
  const [projects, setProjects] = useState<WonProject[]>(INITIAL_PROJECTS);
  const [filterStatus, setFilterStatus] = useState<"All" | "Won" | "Converted">("All");
  const [filterSource, setFilterSource] = useState<"All" | "CRM" | "Government RFP">("All");
  const [agreementModal, setAgreementModal] = useState<WonProject | null>(null);
  const [contactModal, setContactModal] = useState<WonProject | null>(null);
  const [wbsModal, setWbsModal] = useState<WonProject | null>(null);
  const [convertModal, setConvertModal] = useState<WonProject | null>(null);
  const [convertSource, setConvertSource] = useState<"CRM" | "Government RFP">("CRM");
  const [converting, setConverting] = useState(false);
  const [convertDone, setConvertDone] = useState(false);

  // Load any previously converted state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pm_won_projects");
    if (saved) {
      try {
        const savedProjects: WonProject[] = JSON.parse(saved);
        setProjects(INITIAL_PROJECTS.map((p) => {
          const s = savedProjects.find((sp) => sp.id === p.id);
          return s ? { ...p, status: s.status, convertedDate: s.convertedDate, convertedSource: s.convertedSource } : p;
        }));
      } catch { /* ignore */ }
    }
  }, []);

  const filtered = projects.filter((p) => {
    if (filterStatus !== "All" && p.status !== filterStatus) return false;
    if (filterSource !== "All" && p.dealSource !== filterSource) return false;
    return true;
  });

  const totalWon = projects.filter((p) => p.status === "Won").length;
  const totalConverted = projects.filter((p) => p.status === "Converted").length;
  const totalValue = projects.reduce((a, p) => a + p.totalCost, 0);
  const wonValue = projects.filter((p) => p.status === "Won").reduce((a, p) => a + p.totalCost, 0);

  const openConvertModal = (p: WonProject) => {
    setConvertModal(p);
    setConvertSource(p.dealSource);
    setConvertDone(false);
    setConverting(false);
  };

  const handleConvert = () => {
    if (!convertModal) return;
    setConverting(true);

    // Build the pm_active_project payload (same shape as onboarding initiateProject)
    const projectData = {
      projectName: convertModal.name,
      projectId: convertModal.projectId,
      clientName: convertModal.client,
      clientIndustry: "",
      dealValue: convertModal.totalCost,
      budget: convertModal.totalCost,
      currency: "INR ₹",
      projectType: convertModal.projectType,
      startDate: convertModal.startDate,
      endDate: convertModal.endDate,
      description: convertModal.notes,
      salesRep: convertModal.salesRep,
      projectManager: convertModal.spoc,
      accountManager: convertModal.spoc,
      technicalLead: "",
      deliveryLead: convertModal.spoc,
      billingOwner: "",
      milestones: convertModal.milestones.map((m, i) => ({
        id: `M${i + 1}`,
        name: m.name,
        dueDate: m.dueDate,
        deliverable: m.deliverable,
        status: "Planned",
      })),
      risks: convertModal.risks.map((r, i) => ({
        id: `R${i + 1}`,
        description: r.description,
        impact: r.impact,
        probability: r.probability,
        mitigation: r.mitigation,
        owner: "Project Manager",
        status: "Open",
      })),
      billingItems: [],
      paymentMilestones: [],
      contacts: [
        {
          id: "C1",
          role: "Client Implementation Contact",
          name: convertModal.clientContact.name,
          designation: convertModal.clientContact.designation,
          department: convertModal.clientContact.department,
          email: convertModal.clientContact.email,
          phone: convertModal.clientContact.phone,
        },
      ],
      grandTotal: convertModal.totalCost,
      taxType: "GST 18%",
      inclusiveTax: false,
      wbsItems: convertModal.wbsItems,
      source: convertSource,
      wonProjectId: convertModal.id,
      initiatedAt: new Date().toISOString(),
    };

    localStorage.setItem("pm_active_project", JSON.stringify(projectData));
    localStorage.removeItem("pm_scope_seed_ts");

    // Mark as converted in state + localStorage
    setTimeout(() => {
      const updated = projects.map((p) =>
        p.id === convertModal.id
          ? { ...p, status: "Converted" as const, convertedDate: new Date().toISOString().slice(0, 10), convertedSource: convertSource }
          : p
      );
      setProjects(updated);
      localStorage.setItem("pm_won_projects", JSON.stringify(updated.map((p) => ({
        id: p.id, status: p.status, convertedDate: p.convertedDate, convertedSource: p.convertedSource,
      }))));
      setConverting(false);
      setConvertDone(true);
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Won Projects</h1>
          <p className="text-sm text-slate-500 mt-0.5">Deals closed and ready for onboarding — select a project to initiate delivery</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Synced from CRM · Last updated today
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Won",        value: String(projects.length), sub: "all sources",    color: "bg-indigo-500" },
          { label: "Awaiting Onboard", value: String(totalWon),        sub: "ready to start", color: "bg-amber-500"  },
          { label: "Converted",        value: String(totalConverted),   sub: "onboarded",      color: "bg-emerald-500"},
          { label: "Total Pipeline Value", value: fmt(wonValue),        sub: "won, not started", color: "bg-purple-500"},
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-3">
            <div className={`${card.color} w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0`}>
              {card.color.includes("indigo") ? "🏆" : card.color.includes("amber") ? "⏳" : card.color.includes("emerald") ? "✓" : "₹"}
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800">{card.value}</div>
              <div className="text-xs font-medium text-slate-600">{card.label}</div>
              <div className="text-xs text-slate-400">{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden text-xs">
          {(["All", "Won", "Converted"] as const).map((f) => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className={`px-4 py-2 font-medium transition-colors ${filterStatus === f ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden text-xs">
          {(["All", "CRM", "Government RFP"] as const).map((f) => (
            <button key={f} onClick={() => setFilterSource(f)}
              className={`px-4 py-2 font-medium transition-colors ${filterSource === f ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto text-xs text-slate-400">{filtered.length} projects · {fmt(totalValue)} total</div>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {filtered.map((project) => (
          <div key={project.id} className={`bg-white rounded-2xl shadow-sm border transition-all ${project.status === "Converted" ? "border-emerald-200" : "border-slate-200 hover:border-indigo-200"}`}>
            {/* Card header */}
            <div className="px-6 pt-5 pb-4 flex items-start gap-4">
              {/* Left: main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono text-slate-400">{project.id}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[project.projectType] ?? "bg-gray-100 text-gray-600"}`}>{project.projectType}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${project.dealSource === "CRM" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                    {project.dealSource === "CRM" ? "🔗 CRM" : "🏛 Gov RFP"}
                  </span>
                  {project.status === "Converted" ? (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">✓ Converted · {project.convertedSource}</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">⏳ Awaiting Onboard</span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-slate-800 truncate">{project.name}</h2>
                <div className="text-sm text-slate-500 mt-0.5">{project.client}</div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{project.notes}</p>
              </div>

              {/* Right: cost + delivery */}
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-slate-800">{fmt(project.totalCost)}</div>
                <div className="text-xs text-slate-400">Total Contract Value</div>
                <div className="text-sm text-slate-600 mt-1 font-medium">{project.deliveryMonths} month delivery</div>
                <div className="text-xs text-slate-400">{project.startDate} → {project.endDate}</div>
              </div>
            </div>

            {/* Details row */}
            <div className="px-6 pb-4 grid grid-cols-5 gap-4 border-t border-slate-50 pt-4">
              <div>
                <div className="text-xs text-slate-400 mb-0.5">SPOC (Internal)</div>
                <div className="text-sm font-medium text-slate-700">{project.spoc}</div>
                <div className="text-xs text-slate-400">{project.spocRole}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Client SPOC</div>
                <div className="text-sm font-medium text-slate-700">{project.clientContact.name}</div>
                <div className="text-xs text-slate-400">{project.clientContact.designation}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Agreement</div>
                {project.agreementSigned ? (
                  <div>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">✓ Signed</span>
                    <div className="text-xs text-slate-400 mt-0.5">{project.agreementDate}</div>
                  </div>
                ) : (
                  <div>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">⏳ Pending</span>
                    <div className="text-xs text-slate-400 mt-0.5">Ref: {project.agreementRef}</div>
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">WBS Items</div>
                <div className="text-sm font-medium text-slate-700">{project.wbsItems.length} items</div>
                <div className="text-xs text-slate-400">{project.wbsItems.reduce((a, w) => a + w.hours, 0)}h estimated</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Deal Closed</div>
                <div className="text-sm font-medium text-slate-700">{project.closedDate}</div>
                <div className="text-xs text-slate-400">via {project.salesRep}</div>
              </div>
            </div>

            {/* Action bar */}
            <div className="px-6 pb-5 flex items-center gap-2 border-t border-slate-50 pt-3">
              <button onClick={() => setAgreementModal(project)}
                className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                📄 View Agreement
              </button>
              <button onClick={() => setContactModal(project)}
                className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                👤 Client Info
              </button>
              <button onClick={() => setWbsModal(project)}
                className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                📋 WBS Preview ({project.wbsItems.length})
              </button>
              <div className="ml-auto">
                {project.status === "Converted" ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-600 font-medium">✓ Onboarded {project.convertedDate} · from {project.convertedSource}</span>
                    <a href="/scope" className="px-4 py-2 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors">
                      Go to Scope →
                    </a>
                  </div>
                ) : (
                  <button onClick={() => openConvertModal(project)}
                    className="px-5 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                    🚀 Onboard Project
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agreement Modal */}
      {agreementModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setAgreementModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="font-semibold text-slate-800">Agreement Details</div>
              <button onClick={() => setAgreementModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4 text-sm">
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                {[
                  ["Project", agreementModal.name],
                  ["Client", agreementModal.client],
                  ["Agreement Ref", agreementModal.agreementRef],
                  ["Agreement Date", agreementModal.agreementDate || "Pending"],
                  ["Status", agreementModal.agreementSigned ? "✓ Signed" : "⏳ Awaiting Signature"],
                  ["Total Contract Value", fmt(agreementModal.totalCost)],
                  ["Delivery Period", `${agreementModal.deliveryMonths} months`],
                  ["Source", agreementModal.dealSource],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500">{k}</span>
                    <span className="font-medium text-slate-700">{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Payment Milestones</div>
                <div className="space-y-1.5">
                  {agreementModal.milestones.map((m, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-slate-50 rounded-lg px-3 py-2">
                      <span className="text-slate-600 font-medium">{m.name}</span>
                      <span className="text-slate-400">{m.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">📄</div>
                <div className="text-sm font-medium text-slate-600">{agreementModal.agreementRef}.pdf</div>
                <div className="text-xs text-slate-400 mt-1">Click to download agreement document</div>
                <button className="mt-2 px-4 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Contact Modal */}
      {contactModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setContactModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="font-semibold text-slate-800">Client Contact Information</div>
              <button onClick={() => setContactModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xl flex items-center justify-center">
                  {contactModal.clientContact.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-lg">{contactModal.clientContact.name}</div>
                  <div className="text-sm text-slate-500">{contactModal.clientContact.designation}</div>
                  <div className="text-xs text-slate-400">{contactModal.clientContact.department} · {contactModal.client}</div>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">📧</span>
                  <div>
                    <div className="text-xs text-slate-400">Email</div>
                    <div className="font-medium text-slate-700">{contactModal.clientContact.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">📞</span>
                  <div>
                    <div className="text-xs text-slate-400">Phone</div>
                    <div className="font-medium text-slate-700">{contactModal.clientContact.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400">👤</span>
                  <div>
                    <div className="text-xs text-slate-400">Internal SPOC</div>
                    <div className="font-medium text-slate-700">{contactModal.spoc} · {contactModal.spocRole}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WBS Preview Modal */}
      {wbsModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setWbsModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <div className="font-semibold text-slate-800">WBS from CRM — {wbsModal.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{wbsModal.wbsItems.length} items · {wbsModal.wbsItems.reduce((a, w) => a + w.hours, 0)}h estimated</div>
              </div>
              <button onClick={() => setWbsModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="px-6 py-4">
              <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4">
                This WBS will be auto-imported into Scope & Backlog when you onboard this project.
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 border-b border-slate-100">
                    <th className="text-left pb-2">Code</th>
                    <th className="text-left pb-2">Title</th>
                    <th className="text-left pb-2">Type</th>
                    <th className="text-left pb-2">Category</th>
                    <th className="text-right pb-2">Est. Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {wbsModal.wbsItems.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-2 font-mono text-xs text-slate-400">{item.code}</td>
                      <td className="py-2 text-slate-700 font-medium">{item.title}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${wbsTypeColor[item.type] ?? "bg-gray-100"}`}>{item.type}</span>
                      </td>
                      <td className="py-2 text-xs text-slate-500">{item.category}</td>
                      <td className="py-2 text-right font-medium text-indigo-600">{item.hours}h</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200">
                    <td colSpan={4} className="pt-2 text-xs font-semibold text-slate-500">Total Estimated Hours</td>
                    <td className="pt-2 text-right font-bold text-slate-800">{wbsModal.wbsItems.reduce((a, w) => a + w.hours, 0)}h</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Convert / Onboard Modal */}
      {convertModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { if (!converting && !convertDone) setConvertModal(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="font-semibold text-slate-800">Onboard Project</div>
              {!converting && !convertDone && <button onClick={() => setConvertModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>}
            </div>

            {convertDone ? (
              <div className="px-6 py-8 text-center space-y-4">
                <div className="text-5xl">🎉</div>
                <div className="text-xl font-bold text-slate-800">Project Onboarded!</div>
                <div className="text-sm text-slate-500">
                  <strong>{convertModal.name}</strong> has been converted from <strong>{convertSource}</strong> and is now ready for Scope & Backlog setup.
                </div>
                <div className="text-xs text-slate-400">WBS items have been imported. Project data is ready in Scope.</div>
                <div className="flex justify-center gap-3 pt-2">
                  <button onClick={() => setConvertModal(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200">
                    Close
                  </button>
                  <a href="/scope"
                    className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">
                    Go to Scope & Backlog →
                  </a>
                </div>
              </div>
            ) : (
              <div className="px-6 py-5 space-y-5">
                {/* Project summary */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <div className="font-semibold text-indigo-800">{convertModal.name}</div>
                  <div className="text-sm text-indigo-600 mt-0.5">{convertModal.client}</div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-indigo-600">
                    <span>{fmt(convertModal.totalCost)}</span>
                    <span>·</span>
                    <span>{convertModal.deliveryMonths} months</span>
                    <span>·</span>
                    <span>{convertModal.wbsItems.length} WBS items</span>
                  </div>
                </div>

                {/* Source selection */}
                <div>
                  <div className="text-sm font-semibold text-slate-700 mb-3">Select Conversion Source</div>
                  <div className="grid grid-cols-2 gap-3">
                    {(["CRM", "Government RFP"] as const).map((src) => (
                      <button key={src} onClick={() => setConvertSource(src)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${convertSource === src ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"}`}>
                        <div className="text-lg mb-1">{src === "CRM" ? "🔗" : "🏛"}</div>
                        <div className={`text-sm font-semibold ${convertSource === src ? "text-indigo-700" : "text-slate-700"}`}>
                          Convert from {src}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {src === "CRM" ? "Sales pipeline deal — CRM data & WBS imported" : "Government tender — RFP documents & scope imported"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* What will be imported */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">What gets imported</div>
                  <ul className="space-y-1.5">
                    {[
                      `${convertModal.wbsItems.length} WBS items → Scope & Backlog`,
                      `${convertModal.milestones.length} milestones → Project timeline`,
                      `${convertModal.risks.length} risks → Risk Register`,
                      "Client contact details → Onboarding",
                      `${fmt(convertModal.totalCost)} budget → Project Cost`,
                    ].map((line, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="text-emerald-500">✓</span>{line}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={() => setConvertModal(null)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200">
                    Cancel
                  </button>
                  <button onClick={handleConvert} disabled={converting}
                    className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {converting ? (
                      <><span className="animate-spin text-base">⟳</span> Converting…</>
                    ) : (
                      <>🚀 Confirm Onboard</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
