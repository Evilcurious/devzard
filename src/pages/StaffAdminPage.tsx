import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, Shield, Users, Settings, Search, KeyRound, Trash2, CheckCircle2, XCircle,
  ShieldAlert, Building2, Briefcase, Save, Eye, Lock, Unlock, Filter, Mail, Phone,
  Calendar, Timer, Award, AlertTriangle, FileText, Megaphone, Clock, UserCog,
  ArrowLeft, ChevronDown, Plus, RotateCcw
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStaff } from "../context/StaffContext";
import type { HRNotice } from "../context/StaffContext";
import { useLanguage } from "../context/LanguageContext";
import { loadUsers, saveUsers, type User, type StaffRole, STAFF_ROLES, roleLabel, isCreator } from "../lib/users";
type HRNoticeType = HRNotice["type"];
import { cn } from "../utils/cn";
import { Link, useNavigate } from "react-router-dom";

type AdminTab = "overview" | "staff" | "attendance" | "announcements" | "hr" | "tickets" | "tasks" | "permissions";

export default function StaffAdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const staff = useStaff();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const flash = (ok: boolean, msg: string) => { setToast({ ok, msg }); setTimeout(() => setToast(null), 2500); };

  // gate: only staff roles + creator/admin/hr/it_ceo/bd_ceo can access admin
  const allowed = user && ["creator","admin","hr","it_ceo","bd_ceo"].includes(user.role);
  if (!user) {
    return <div className="min-h-screen bg-zinc-950 pt-32 text-center text-white">Please <Link to="/login" className="underline">login</Link> to access admin.</div>;
  }
  if (!allowed) {
    return (
      <section className="min-h-screen bg-zinc-950 pt-28 pb-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-10">
            <ShieldAlert className="mx-auto h-10 w-10 text-rose-400" />
            <h2 className="mt-4 text-2xl font-black text-white">Access Denied</h2>
            <p className="mt-2 text-sm text-rose-200">Your role <b>{user.role}</b> cannot open admin panel. Need IT CEO / BD CEO / HR / Creator.</p>
            <p className="mt-1 text-xs text-zinc-400">Contact Creator (evilcurious6@gmail.com) to upgrade your role.</p>
            <Link to="/staff" className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black">Back to Staff Portal</Link>
          </div>
        </div>
      </section>
    );
  }

  const creator = isCreator(user);
  const tabs: { id: AdminTab; label: string; icon: any; roles: string[] }[] = [
    { id: "overview", label: "Overview", icon: Eye, roles: ["creator","admin","hr","it_ceo","bd_ceo"] },
    { id: "staff", label: "Staff • Roles", icon: Users, roles: ["creator","admin","hr","it_ceo","bd_ceo"] },
    { id: "attendance", label: "Attendance", icon: Clock, roles: ["creator","admin","hr","it_ceo","bd_ceo"] },
    { id: "announcements", label: "Announcements", icon: Megaphone, roles: ["creator","admin","it_ceo","bd_ceo","hr"] },
    { id: "hr", label: "HR • Punishments", icon: ShieldAlert, roles: ["creator","admin","hr"] },
    { id: "tickets", label: "Leave Tickets", icon: FileText, roles: ["creator","admin","hr","it_ceo","bd_ceo"] },
    { id: "tasks", label: "Tasks • IT/BD", icon: Briefcase, roles: ["creator","admin","it_ceo","bd_ceo"] },
    { id: "permissions", label: "Permissions", icon: Lock, roles: ["creator","admin"] },
  ];
  const visibleTabs = tabs.filter(tab=> tab.roles.includes(user.role) || creator);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#08080a] pt-20 pb-16">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-20 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[80px]" />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="fixed right-6 top-24 z-50">
            <div className={cn("flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold", toast.ok?"border-emerald-400/30 bg-emerald-500/15 text-emerald-200":"border-rose-400/30 bg-rose-500/15 text-rose-200")}>
              {toast.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}{toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-3 py-1 text-[11px] font-black tracking-widest uppercase text-zinc-900">
              <Crown className="h-3.5 w-3.5" /> ADMIN PANEL • {user.role.toUpperCase()}
            </span>
            <h1 className="mt-3 font-display text-3xl font-black text-white sm:text-4xl">{t("admin.title")}</h1>
            <p className="mt-1 text-sm text-zinc-400">{t("admin.subtitle")} — Signed in as <b className="text-white">{user.email}</b> {creator ? "• Creator (full control)" : user.role==="it_ceo" ? `• ${t("admin.it_ceo_note")}` : user.role==="bd_ceo" ? `• ${t("admin.bd_ceo_note")}` : user.role==="hr" ? `• ${t("admin.hr_note")}` : ""}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/staff" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-black hover:bg-zinc-100"><ArrowLeft className="h-4 w-4" /> Staff Portal</Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white">View Site</Link>
          </div>
        </div>

        {/* role banner */}
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <div className={cn("rounded-2xl border p-4", creator?"border-amber-300 bg-amber-50": "border-white/10 bg-white")}>
            <Crown className="h-5 w-5 text-amber-600" /><p className="mt-1 text-xs font-black uppercase">Creator</p><p className="text-[11px] text-zinc-600">All permissions — can make anyone CEO/HR</p>
          </div>
          <div className={cn("rounded-2xl border p-4", user.role==="it_ceo"||creator?"border-sky-300 bg-sky-50 ring-2 ring-sky-200":"border-white/10 bg-white/5 text-white/60")}>
            <Building2 className="h-5 w-5 text-sky-600" /><p className="mt-1 text-xs font-black uppercase">IT CEO</p><p className="text-[11px] opacity-70">Controls IT team & IT tasks</p>
          </div>
          <div className={cn("rounded-2xl border p-4", user.role==="bd_ceo"||creator?"border-emerald-300 bg-emerald-50 ring-2 ring-emerald-200":"border-white/10 bg-white/5 text-white/60")}>
            <Briefcase className="h-5 w-5 text-emerald-600" /><p className="mt-1 text-xs font-black uppercase">BD CEO</p><p className="text-[11px] opacity-70">Controls BD team & BD tasks</p>
          </div>
          <div className={cn("rounded-2xl border p-4", user.role==="hr"||creator?"border-amber-300 bg-amber-50 ring-2 ring-amber-200":"border-white/10 bg-white/5 text-white/60")}>
            <Shield className="h-5 w-5 text-amber-600" /><p className="mt-1 text-xs font-black uppercase">HR Manager</p><p className="text-[11px] opacity-70">Punishments & leave approvals</p>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur">
          {visibleTabs.map(tb=>(
            <button key={tb.id} onClick={()=>setTab(tb.id)} className={cn("flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition", tab===tb.id?"bg-white text-black shadow":"text-zinc-400 hover:text-white hover:bg-white/10")}>
              <tb.icon className="h-4 w-4" /> {tb.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {tab==="overview" && <AdminOverview flash={flash} />}
              {tab==="staff" && <AdminStaffTab flash={flash} actor={user} />}
              {tab==="attendance" && <AdminAttendanceTab flash={flash} />}
              {tab==="announcements" && <AdminAnnouncementsTab flash={flash} actor={user} />}
              {tab==="hr" && <AdminHRTab flash={flash} actor={user} />}
              {tab==="tickets" && <AdminTicketsTab flash={flash} actor={user} />}
              {tab==="tasks" && <AdminTasksTab flash={flash} actor={user} />}
              {tab==="permissions" && <AdminPermissionsTab flash={flash} actor={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function AdminOverview({ flash }: { flash: (ok:boolean,m:string)=>void }) {
  const staff = useStaff();
  const users = loadUsers();
  const staffCount = users.filter(u=> ["creator","it_ceo","bd_ceo","hr","it_staff","bd_staff","staff","admin"].includes(u.role)).length;
  const itStaff = users.filter(u=> u.role==="it_staff" || u.department==="IT" || u.role==="it_ceo").length;
  const bdStaff = users.filter(u=> u.role==="bd_staff" || u.department==="BD" || u.role==="bd_ceo").length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white p-5"><p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Staff</p><p className="mt-1 font-display text-3xl font-black">{staffCount}</p><p className="text-xs text-zinc-500">Registered</p></div>
        <div className="rounded-3xl border border-sky-200 bg-sky-50 p-5"><p className="text-[10px] font-black uppercase tracking-widest text-sky-700">IT Team</p><p className="mt-1 font-display text-3xl font-black">{itStaff}</p><p className="text-xs text-sky-700/70">Members</p></div>
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5"><p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">BD Team</p><p className="mt-1 font-display text-3xl font-black">{bdStaff}</p><p className="text-xs text-emerald-700/70">Members</p></div>
        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-5 text-white"><p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Pending Tickets</p><p className="mt-1 font-display text-3xl font-black">{staff.tickets.filter(t=>t.status==="pending").length}</p><p className="text-xs text-zinc-400">Need action</p></div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white p-6">
          <h3 className="text-sm font-black uppercase tracking-widest">Recent Attendance</h3>
          <div className="mt-3 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden">
            {staff.attendance.slice(0,5).map(a=>(
              <div key={a.id} className="flex items-center justify-between px-4 py-2.5 text-sm"><span className="font-bold">{a.userName} • {a.date}</span><span className={cn("rounded-full px-2 py-1 text-[11px] font-bold uppercase", a.status==="present"?"bg-emerald-500 text-white": a.status==="late"?"bg-amber-400 text-black":"bg-zinc-900 text-white")}>{a.status}</span></div>
            ))}
            {staff.attendance.length===0 && <p className="px-4 py-8 text-center text-sm text-zinc-500">No attendance yet</p>}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white p-6">
          <h3 className="text-sm font-black uppercase tracking-widest">Recent Tasks</h3>
          <div className="mt-3 space-y-2">
            {staff.tasks.slice(0,4).map(t=>(
              <div key={t.id} className="rounded-xl border border-zinc-200 px-3 py-2 flex items-center justify-between"><div><p className="text-sm font-bold">{t.title}</p><p className="text-xs text-zinc-500">{t.department} • {t.priority} • {t.status}</p></div><span className="text-xs text-zinc-500">{t.dueDate}</span></div>
            ))}
            {staff.tasks.length===0 && <p className="text-sm text-zinc-500">No tasks</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminStaffTab({ flash, actor }: { flash: (ok:boolean,m:string)=>void; actor: User }) {
  const [users, setUsers] = useState<User[]>(()=>loadUsers());
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const refresh = () => setUsers(loadUsers());
  const filtered = useMemo(()=>{
    let d = users;
    if (q) d = d.filter(u=> u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()) || (u.jobTitle||"").toLowerCase().includes(q.toLowerCase()));
    if (roleFilter!=="all") d = d.filter(u=> u.role===roleFilter);
    return d;
  }, [users,q,roleFilter]);

  const setRole = (userId: string, newRole: StaffRole) => {
    const current = users.find(u=>u.id===userId);
    if (!current) return;
    // permission check
    if (!isCreator(actor) && newRole==="creator") { flash(false, "Only Creator can make another Creator"); return; }
    if (!isCreator(actor) && (newRole==="hr"||newRole==="it_ceo"||newRole==="bd_ceo")) {
      // optional restriction: only creator can make these? But allow HR? We'll let creator only for now
      flash(false, "Only Creator can assign CEO/HR roles — ask evilcurious6@gmail.com");
      return;
    }
    const updated = users.map(u=> u.id===userId ? { ...u, role: newRole, department: newRole==="it_staff"||newRole==="it_ceo" ? "IT" as const : newRole==="bd_staff"||newRole==="bd_ceo" ? "BD" as const : newRole==="hr"?"HR" as const : u.department } : u);
    saveUsers(updated);
    refresh();
    flash(true, `${current.name} is now ${roleLabel(newRole)}`);
  };

  const toggleSuspend = (id: string) => {
    const next = users.map(u=> u.id===id ? { ...u, suspended: !u.suspended } : u);
    saveUsers(next); refresh(); flash(true, "Suspension toggled");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white p-6">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest">Staff Management • {filtered.length} users</h3>
          <div className="flex gap-2">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" /><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name/email" className="rounded-full border border-zinc-200 py-2 pl-9 pr-4 text-sm" /></div>
            <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="rounded-full border border-zinc-200 px-3 py-2 text-sm"><option value="all">All roles</option>{STAFF_ROLES.map(r=> <option key={r.value} value={r.value}>{r.label}</option>)}</select>
          </div>
        </div>
        <p className="mt-2 text-xs text-zinc-500">Creator • {STAFF_ROLES.find(r=>r.value==="creator")?.desc} — can make anyone CEO/HR. IT CEO/BD CEO need Creator approval.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="text-[10px] font-black uppercase tracking-widest text-zinc-500"><tr><th className="py-2">Staff</th><th>Role</th><th>Department</th><th>Contact</th><th>Joined</th><th className="text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(u=>(
                <tr key={u.id} className={cn(u.suspended?"bg-rose-50":"")}>
                  <td className="py-3"><div className="flex items-center gap-2.5"><span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-black text-white", u.avatarColor)}>{u.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}</span><div><p className="font-bold text-zinc-900">{u.name} {u.suspended && <span className="ml-1 rounded bg-rose-600 px-1 py-0.5 text-[10px] text-white">SUSPENDED</span>}</p><p className="text-xs text-zinc-500">{u.jobTitle || "—"} • {u.staffId || u.id.slice(0,6)}</p></div></div></td>
                  <td>
                    <select value={u.role} onChange={e=>setRole(u.id, e.target.value as StaffRole)} className="rounded-full border border-zinc-300 bg-white px-2.5 py-1 text-xs font-bold">
                      {STAFF_ROLES.map(r=> <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    <p className="mt-1 text-[11px] text-zinc-500">{roleLabel(u.role as StaffRole)}</p>
                  </td>
                  <td><span className="rounded-full bg-zinc-900 px-2 py-1 text-[11px] font-bold text-white">{u.department || "ALL"}</span></td>
                  <td><p className="text-xs font-mono">{u.email}</p><p className="text-xs text-zinc-500">{u.phone || "—"}</p></td>
                  <td className="text-xs text-zinc-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={()=>toggleSuspend(u.id)} className={cn("rounded-full border px-2.5 py-1 text-xs font-bold", u.suspended?"bg-emerald-500 text-white":"bg-amber-500 text-black")}>{u.suspended?"Unblock":"Suspend"}</button>
                      <button onClick={()=>{ if(confirm(`Delete ${u.name}?`)) { saveUsers(users.filter(x=>x.id!==u.id)); refresh(); flash(true,"User deleted"); }}} className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-black text-amber-900">How roles work</p>
        <ul className="mt-2 grid gap-1 text-xs text-amber-800 sm:grid-cols-2">
          <li>• <b>Creator (you)</b> = full control, can make anyone IT CEO / BD CEO / HR</li>
          <li>• <b>IT CEO</b> = sees only IT attendance + assigns IT tasks</li>
          <li>• <b>BD CEO</b> = sees only BD attendance + assigns BD tasks</li>
          <li>• <b>HR</b> = punishments, policy, approve/reject all tickets</li>
          <li>• <b>Staff</b> = check in/out, apply tickets, see tasks</li>
          <li>• Login with email + pass (same as site). Role decides panel access.</li>
        </ul>
      </div>
    </div>
  );
}

function AdminAttendanceTab({ flash }: { flash:(ok:boolean,m:string)=>void }) {
  const staff = useStaff();
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const filtered = useMemo(()=>{
    let d = staff.attendance;
    if (search) d = d.filter(a=> a.userName.toLowerCase().includes(search.toLowerCase()) || a.date.includes(search));
    if (dept!=="all") d = d.filter(a=> a.department===dept);
    if (status!=="all") d = d.filter(a=> a.status===status);
    return d.slice(0,200);
  }, [staff.attendance, search, dept, status]);
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white p-6">
        <div className="flex flex-wrap gap-2 items-center">
          <h3 className="text-sm font-black uppercase tracking-widest">Attendance Control • {filtered.length}</h3>
          <div className="ml-auto flex gap-2">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name/date" className="rounded-full border border-zinc-200 py-2 pl-9 pr-4 text-sm" /></div>
            <select value={dept} onChange={e=>setDept(e.target.value)} className="rounded-full border border-zinc-200 px-3 py-2 text-sm"><option value="all">All Depts</option><option value="IT">IT</option><option value="BD">BD</option><option value="HR">HR</option><option value="ALL">ALL</option></select>
            <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-full border border-zinc-200 px-3 py-2 text-sm"><option value="all">All status</option><option value="present">Present</option><option value="late">Late</option><option value="leave">Leave</option><option value="absent">Absent</option></select>
          </div>
        </div>
        <div className="mt-4 max-h-[500px] overflow-auto rounded-2xl border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-500"><tr><th className="px-3 py-2">Date</th><th className="px-3 py-2">Staff</th><th className="px-3 py-2">In/Out</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Hours</th><th className="px-3 py-2">Note</th><th className="px-3 py-2">Actions</th></tr></thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(a=>(
                <tr key={a.id}><td className="px-3 py-2 font-mono text-xs">{a.date}</td><td className="px-3 py-2"><p className="font-bold">{a.userName}</p><p className="text-[11px] text-zinc-500">{a.department} • {a.userEmail}</p></td><td className="px-3 py-2 font-mono text-xs">{a.checkIn||"--:--"} → {a.checkOut||"--:--"}</td><td className="px-3 py-2"><select value={a.status} onChange={e=>staff.updateAttendance(a.id, { status: e.target.value as any })} className="rounded-full border px-2 py-1 text-xs font-bold"><option value="present">present</option><option value="late">late</option><option value="leave">leave</option><option value="absent">absent</option><option value="half_day">half_day</option></select></td><td className="px-3 py-2 font-bold">{a.hours ?? "-"}</td><td className="px-3 py-2 text-xs">{a.note || "—"}</td><td className="px-3 py-2"><button onClick={()=>staff.deleteAttendance(a.id)} className="rounded-full border border-rose-200 bg-rose-50 p-1.5 text-rose-600"><Trash2 className="h-3 w-3" /></button></td></tr>
              ))}
              {filtered.length===0 && <tr><td colSpan={7} className="py-10 text-center text-sm text-zinc-500">No records</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminAnnouncementsTab({ flash, actor }: {flash:(ok:boolean,m:string)=>void, actor: User}) {
  const staff = useStaff();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [vis, setVis] = useState<"ALL"|"IT"|"BD"|"HR">("ALL");
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white p-6">
        <h3 className="text-sm font-black uppercase tracking-widest">Post Company Announcement</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_150px]">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
          <select value={vis} onChange={e=>setVis(e.target.value as any)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"><option value="ALL">All Staff</option><option value="IT">IT Channel</option><option value="BD">BD Channel</option><option value="HR">HR Channel</option></select>
        </div>
        <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Announcement body..." rows={3} className="mt-3 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
        <button onClick={()=>{ if(!title.trim()||!body.trim()) return flash(false,"Need title & body"); staff.addAnnouncement({ authorId:actor.id, authorName:actor.name, authorRole:actor.role, title:title.trim(), body:body.trim(), visibility: vis }); setTitle(""); setBody(""); flash(true,"Announcement published to "+vis)}} className="mt-3 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white">Publish Announcement</button>
      </div>
      <div className="grid gap-3">
        {staff.announcements.map(a=>(
          <div key={a.id} className="rounded-3xl border border-zinc-200 bg-white p-5 flex items-start justify-between gap-3">
            <div><p className="text-xs font-bold uppercase text-zinc-500">{a.visibility} • {new Date(a.createdAt).toLocaleString()}</p><p className="font-bold text-zinc-900">{a.title}</p><p className="text-sm text-zinc-600 whitespace-pre-wrap">{a.body}</p><p className="text-xs text-zinc-500 mt-1">by {a.authorName} ({a.authorRole})</p></div>
            <button onClick={()=>staff.deleteAnnouncement(a.id)} className="rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminHRTab({ flash, actor }: {flash:(ok:boolean,m:string)=>void, actor:User}) {
  const staff = useStaff();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<HRNoticeType>("notice");
  const [target, setTarget] = useState("");
  const [severity, setSeverity] = useState<"low"|"medium"|"high">("medium");
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-black text-amber-900">HR Panel — You ({actor.role}) can punish, warn, award, change policy. All staff see it instantly.</p></div>
      <div className="rounded-3xl border border-white/10 bg-white p-6">
        <h3 className="text-sm font-black uppercase tracking-widest">Create HR Notice</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title — e.g. Final Warning to Ali" className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
          <input value={target} onChange={e=>setTarget(e.target.value)} placeholder="Target person (optional)" className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
        </div>
        <div className="mt-3 flex gap-2">
          <select value={type} onChange={e=>setType(e.target.value as any)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"><option value="punishment">Punishment</option><option value="warning">Warning</option><option value="policy">Policy Change</option><option value="award">Award</option><option value="notice">Notice</option></select>
          <select value={severity} onChange={e=>setSeverity(e.target.value as any)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
          <button onClick={()=>{ if(!title.trim()||!body.trim()) return flash(false,"Need title & body"); staff.addHRNotice({ authorId:actor.id, authorName:actor.name, type, title:title.trim(), body:body.trim(), targetName: target.trim()||undefined, severity }); setTitle(""); setBody(""); flash(true,"HR notice posted")}} className="ml-auto rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white">Post HR Notice</button>
        </div>
        <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Details..." rows={3} className="mt-3 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
      </div>
      <div className="grid gap-3">
        {staff.hrNotices.map(h=>(
          <div key={h.id} className={cn("rounded-3xl border p-5", h.type==="punishment"?"border-rose-200 bg-rose-50": h.type==="warning"?"border-amber-200 bg-amber-50": h.type==="award"?"border-emerald-200 bg-emerald-50":"border-zinc-200 bg-white")}>
            <div className="flex items-center justify-between"><span className="rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-bold text-white uppercase">{h.type} • {h.severity}</span><button onClick={()=>staff.deleteHRNotice(h.id)} className="rounded-full bg-white border p-1.5 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div>
            <p className="mt-2 font-bold">{h.title} {h.targetName && <span className="text-rose-600">→ {h.targetName}</span>}</p>
            <p className="text-sm text-zinc-700 whitespace-pre-wrap">{h.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminTicketsTab({ flash, actor }: {flash:(ok:boolean,m:string)=>void, actor:User}) {
  const staff = useStaff();
  const [filter, setFilter] = useState<string>("pending");
  const list = staff.tickets.filter(t=> filter==="all"?true:t.status===filter);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["all","pending","approved","rejected"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} className={cn("rounded-full px-4 py-2 text-sm font-bold border capitalize", filter===s?"bg-white text-black":"bg-white/10 text-white border-white/20")}>{s} ({staff.tickets.filter(t=> filter==="all"?true:t.status===s).length})</button>
        ))}
      </div>
      <div className="grid gap-3">
        {list.map(tk=>(
          <div key={tk.id} className="rounded-3xl border border-white/10 bg-white p-5">
            <div className="flex flex-wrap gap-2 items-center"><span className="rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-bold text-white uppercase">{tk.type} • {tk.days}d</span><span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold uppercase", tk.status==="pending"?"bg-amber-100 text-amber-800 border": tk.status==="approved"?"bg-emerald-500 text-white":"bg-rose-500 text-white")}>{tk.status}</span><span className="text-xs text-zinc-500">{tk.fromDate} → {tk.toDate} • {tk.userName} ({tk.department})</span></div>
            <p className="mt-2 text-sm text-zinc-700">{tk.reason}</p>
            {tk.status==="pending" ? (
              <div className="mt-3 flex gap-2">
                <button onClick={()=>{ staff.updateTicketStatus(tk.id, "approved", actor.name, "Approved — enjoy your leave"); flash(true,"Approved")}} className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white">Approve</button>
                <button onClick={()=>{ staff.updateTicketStatus(tk.id, "rejected", actor.name, "Rejected — contact HR"); flash(false,"Rejected")}} className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-bold text-white">Reject</button>
              </div>
            ) : <p className="mt-2 text-xs text-zinc-500">Reviewed by {tk.reviewedBy} • {tk.reviewNote}</p>}
          </div>
        ))}
        {list.length===0 && <p className="text-center text-sm text-zinc-400 py-10">No tickets in {filter}</p>}
      </div>
    </div>
  );
}

function AdminTasksTab({ flash, actor }: {flash:(ok:boolean,m:string)=>void, actor:User}) {
  const staff = useStaff();
  const [teamFilter, setTeamFilter] = useState<"ALL"|"IT"|"BD">("ALL");
  const list = teamFilter==="ALL" ? staff.tasks : staff.tasksForTeam(teamFilter as "IT"|"BD");
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState<"IT"|"BD">("IT");
  const [assignee, setAssignee] = useState("");
  const [due, setDue] = useState(new Date(Date.now()+86400000*3).toISOString().slice(0,10));
  const users = loadUsers();
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white p-6">
        <h3 className="text-sm font-black uppercase tracking-widest">Assign Work (CEO → Staff)</h3>
        <p className="text-xs text-zinc-500">Creator/IT CEO → IT team, Creator/BD CEO → BD team. Choose team section: 1st IT, 2nd BD.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
          <select value={dept} onChange={e=>setDept(e.target.value as any)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"><option value="IT">IT Team (1st section)</option><option value="BD">BD Team (2nd section)</option></select>
          <select value={assignee} onChange={e=>setAssignee(e.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"><option value="">Select staff</option><option value={dept+" Team — Pool"}>{dept} Team — Pool</option>{users.filter(u=> dept==="IT"? (u.department==="IT"||u.role.includes("it")) : (u.department==="BD"||u.role.includes("bd"))).map(u=> <option key={u.id} value={u.name}>{u.name} • {u.role}</option>)}</select>
        </div>
        <div className="mt-3 flex gap-2">
          <input type="date" value={due} onChange={e=>setDue(e.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm" />
          <button onClick={()=>{ if(!title.trim()||!assignee) return flash(false,"Need title & assignee"); const person = users.find(u=>u.name===assignee); staff.createTask({ title:title.trim(), description:`Assigned via admin by ${actor.name}`, department:dept, assignerId:actor.id, assignerName:actor.name, assigneeId: person?.id || "", assigneeName:assignee, priority:"high", dueDate:due}); setTitle(""); flash(true,`Assigned to ${assignee} in ${dept}`)}} className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white">Assign Work</button>
        </div>
      </div>
      <div className="flex gap-2"><button onClick={()=>setTeamFilter("ALL")} className={cn("rounded-full px-4 py-2 text-sm font-bold border", teamFilter==="ALL"?"bg-white text-black":"bg-white/10 text-white border-white/20")}>All ({staff.tasks.length})</button><button onClick={()=>setTeamFilter("IT")} className={cn("rounded-full px-4 py-2 text-sm font-bold border", teamFilter==="IT"?"bg-sky-500 text-white border-sky-500":"bg-white/10 text-white border-white/20")}>IT Team ({staff.tasksForTeam("IT").length})</button><button onClick={()=>setTeamFilter("BD")} className={cn("rounded-full px-4 py-2 text-sm font-bold border", teamFilter==="BD"?"bg-emerald-500 text-white border-emerald-500":"bg-white/10 text-white border-white/20")}>BD Team ({staff.tasksForTeam("BD").length})</button></div>
      <div className="grid gap-3 sm:grid-cols-2">
        {list.map(t=>(
          <div key={t.id} className="rounded-3xl border border-white/10 bg-white p-5">
            <div className="flex items-center gap-2"><span className={cn("rounded-full px-2 py-1 text-[10px] font-black uppercase", t.department==="IT"?"bg-sky-500 text-white":"bg-emerald-500 text-white")}>{t.department}</span><span className={cn("rounded-full px-2 py-1 text-[10px] font-bold uppercase border", t.status==="todo"?"bg-zinc-100": t.status==="done"?"bg-emerald-500 text-white":"bg-amber-400")}>{t.status}</span><span className="text-xs text-zinc-500">due {t.dueDate}</span></div>
            <p className="mt-2 font-bold">{t.title}</p>
            <p className="text-xs text-zinc-600">{t.description}</p>
            <p className="mt-2 text-xs">→ {t.assigneeName} • by {t.assignerName}</p>
            <div className="mt-2 flex gap-1"><button onClick={()=>staff.deleteTask(t.id)} className="text-xs text-rose-600">Delete</button><span className="text-zinc-300">•</span><select value={t.status} onChange={e=>staff.updateTaskStatus(t.id, e.target.value as any)} className="text-xs rounded-full border px-2 py-1"><option value="todo">todo</option><option value="in_progress">in_progress</option><option value="review">review</option><option value="done">done</option></select></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPermissionsTab({ flash, actor }: {flash:(ok:boolean,m:string)=>void, actor:User}) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white p-6">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest"><Lock className="h-4 w-4" /> Permissions Matrix</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] font-black uppercase tracking-widest text-zinc-500"><tr><th className="py-2">Feature</th><th className="py-2">Creator</th><th className="py-2">IT CEO</th><th className="py-2">BD CEO</th><th className="py-2">HR</th><th className="py-2">Staff</th></tr></thead>
            <tbody className="divide-y divide-zinc-100">
              {[
                ["Attendance — view all", "✓", "IT only", "BD only", "✓", "own only"],
                ["Mark attendance", "✓", "✓", "✓", "✓", "✓"],
                ["Announcements — post all", "✓", "IT", "BD", "—", "—"],
                ["HR Punishments", "✓", "—", "—", "✓", "read"],
                ["Leave — approve", "✓", "IT tickets", "BD tickets", "✓ all", "—"],
                ["Assign tasks — IT (1st)", "✓", "✓", "—", "—", "—"],
                ["Assign tasks — BD (2nd)", "✓", "—", "✓", "—", "—"],
                ["Manage roles", "✓", "—", "—", "—", "—"],
                ["Admin panel", "✓ all", "IT+B/D+T", "BD+B/D+T", "HR+T", "—"],
              ].map(([feat, a,b,c,d,e])=>(
                <tr key={feat}><td className="py-2 font-bold">{feat}</td><td className="py-2 text-emerald-600 font-bold">{a}</td><td className="py-2">{b}</td><td className="py-2">{c}</td><td className="py-2">{d}</td><td className="py-2">{e}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-2xl bg-zinc-900 p-4 text-white">
          <p className="text-sm font-black">How to assign permissions</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-300">1) Go to Staff • Roles tab → change anyone’s role dropdown. <b>Only Creator (you — {actor.email}) can make IT CEO / BD CEO / HR</b>. 2) Login = email + pass same as site. 3) When logged in, user automatically sees only their allowed tabs. 4) Creator sees all 8 tabs. IT CEO sees Overview, Staff (read), Attendance (IT), Announcements (IT), Tickets (IT), Tasks (IT). BD CEO same for BD. HR sees HR + Attendance + Tickets.</p>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 text-white">
        <p className="text-sm font-black">Blackish & White Dark Toggle</p>
        <p className="text-xs text-zinc-400 mt-1">Theme is blackish (#050507 / #0a0a0a) + white cards. Use navbar Moon/Sun to toggle global dark/white mode — it’s saved and applies to staff portal too. Language switcher toggles English/Urdu for all members.</p>
      </div>
    </div>
  );
}
