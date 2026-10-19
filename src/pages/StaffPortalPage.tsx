import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Calendar, Megaphone, ShieldAlert, Timer, Users, CheckCircle2, XCircle,
  LogIn, LogOut, ClipboardList, Briefcase, UserCheck, AlertTriangle, Award,
  Filter, Search, Plus, Send, Trash2, Pin, CalendarRange, FileText, ChevronDown,
  Activity, Building2, Crown, Shield, Eye, MessageSquare, Flag
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStaff, type AttendanceRecord, type HRNotice, type TaskPriority, type TaskStatus } from "../context/StaffContext";
import type { LeaveType } from "../context/StaffContext";
import { useLanguage } from "../context/LanguageContext";
import { loadUsers, type User } from "../lib/users";
import type { Department, StaffRole } from "../lib/users";
import { Link } from "react-router-dom";
import { cn } from "../utils/cn";

type Tab = "overview" | "attendance" | "announcements" | "hr" | "tickets" | "it" | "bd";

const roleBadge: Record<string, string> = {
  creator: "bg-zinc-900 text-white border-zinc-700",
  it_ceo: "bg-sky-600 text-white border-sky-500",
  bd_ceo: "bg-emerald-600 text-white border-emerald-500",
  hr: "bg-amber-500 text-black border-amber-400",
  it_staff: "bg-zinc-800 text-zinc-100 border-zinc-700",
  bd_staff: "bg-zinc-800 text-zinc-100 border-zinc-700",
  staff: "bg-zinc-100 text-zinc-900 border-zinc-200",
};

export default function StaffPortalPage() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const staff = useStaff();
  const [tab, setTab] = useState<Tab>("overview");
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const flash = (ok: boolean, msg: string) => {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 2800);
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const myAtt = user ? staff.myAttendance(user.id) : [];
  const todayRec = myAtt.find((a) => a.date === todayStr);

  // stats
  const presentToday = staff.todayAttendance().filter((a) => a.status === "present" || a.status === "late").length;
  const onLeave = staff.todayAttendance().filter((a) => a.status === "leave").length;
  const pendingTickets = staff.tickets.filter((tk) => tk.status === "pending").length;

  const tabs: { id: Tab; label: string; icon: any; en: string; ur: string }[] = [
    { id: "overview", label: "Overview", icon: Activity, en: "Overview", ur: "جائزہ" },
    { id: "attendance", label: "Attendance", icon: Clock, en: "Attendance", ur: "حاضری" },
    { id: "announcements", label: "Announcements", icon: Megaphone, en: "Announcements", ur: "اعلانات" },
    { id: "hr", label: "HR Channel", icon: ShieldAlert, en: "HR Channel", ur: "ایچ آر چینل" },
    { id: "tickets", label: "Leave Tickets", icon: ClipboardList, en: "Leave Tickets", ur: "چھٹی ٹکٹ" },
    { id: "it", label: "IT Team Work", icon: Building2, en: "IT Team", ur: "آئی ٹی ٹیم" },
    { id: "bd", label: "BD Team Work", icon: Briefcase, en: "BD Team", ur: "بی ڈی ٹیم" },
  ];

  if (!user) {
    return (
      <section className="min-h-screen bg-zinc-950 pt-28 pb-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10">
            <Shield className="mx-auto h-12 w-12 text-zinc-400" />
            <h2 className="mt-4 text-2xl font-bold text-white">Staff Portal — Login Required</h2>
            <p className="mt-2 text-sm text-zinc-400">Please sign in to access DEVZARD staff workspace.</p>
            <Link to="/login" className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-black">Sign in</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050507] pt-20 pb-20">
      {/* blackish grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[80px]" />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="fixed right-6 top-24 z-50">
            <div className={cn("flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold backdrop-blur", toast.ok ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-200" : "border-rose-500/30 bg-rose-500/15 text-rose-200")}>
              {toast.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}{toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-bold tracking-widest text-zinc-300 uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> DEVZARD • STAFF WORKSPACE
            </span>
            <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">{t("staff.title")}</h1>
            <p className="mt-1 text-sm text-zinc-400">{t("staff.subtitle")} — {lang === "ur" ? "اردو / انگریزی" : "English / Urdu"} • {new Date().toLocaleDateString(lang === "ur" ? "ur-PK" : "en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-bold text-zinc-900">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-black text-white">{user.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}</span>
                {user.name} • {user.jobTitle || "Staff"} • {user.staffId || user.id.slice(0,6)}
              </span>
              <span className={cn("inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider", roleBadge[user.role] || "bg-white text-black")}>
                {user.role} {user.department ? `• ${user.department}` : ""}
              </span>
              <Link to="/staff/admin" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white hover:bg-white hover:text-black transition">
                <Crown className="h-3.5 w-3.5" /> {t("nav.admin")}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-2xl border border-white/10 bg-white p-3 text-zinc-900 shadow-xl">
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Today's Shift</p>
              <p className="font-mono text-sm font-bold">{todayStr} • {todayRec ? `${todayRec.checkIn || "--:--"} → ${todayRec.checkOut || "---"}` : "Not checked in"}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => { const r = staff.checkIn(user); flash(r.ok, r.msg); }} className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-black"><LogIn className="h-3.5 w-3.5" /> {t("staff.checkin")}</button>
                <button onClick={() => { const r = staff.checkOut(user); flash(r.ok, r.msg); }} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900"><LogOut className="h-3.5 w-3.5" /> {t("staff.checkout")}</button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* stats strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white p-4">
            <div className="flex items-center justify-between"><Users className="h-4 w-4 text-zinc-900" /><span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{t("staff.total_staff")}</span></div>
            <p className="mt-2 font-display text-2xl font-black text-zinc-900">{loadUsers().filter(u=> ["creator","it_ceo","bd_ceo","hr","it_staff","bd_staff","staff","admin"].includes(u.role)).length}</p>
            <p className="text-xs text-zinc-500">Registered staff</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white p-4">
            <div className="flex items-center justify-between"><UserCheck className="h-4 w-4 text-emerald-600" /><span className="text-[10px] font-bold tracking-widest text-emerald-700 uppercase">{t("staff.present_today")}</span></div>
            <p className="mt-2 font-display text-2xl font-black text-zinc-900">{presentToday}</p>
            <p className="text-xs text-zinc-500">Checked in today</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center justify-between"><AlertTriangle className="h-4 w-4 text-amber-600" /><span className="text-[10px] font-bold tracking-widest text-amber-700 uppercase">{t("staff.on_leave")}</span></div>
            <p className="mt-2 font-display text-2xl font-black text-zinc-900">{onLeave}</p>
            <p className="text-xs text-zinc-600">On leave</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-4 text-white">
            <div className="flex items-center justify-between"><FileText className="h-4 w-4 text-white" /><span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Pending Tickets</span></div>
            <p className="mt-2 font-display text-2xl font-black">{pendingTickets}</p>
            <p className="text-xs text-zinc-400">Need review</p>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur">
          {tabs.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)} className={cn("flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition", tab === tb.id ? "bg-white text-zinc-900 shadow" : "text-zinc-400 hover:text-white hover:bg-white/10")}>
              <tb.icon className="h-4 w-4" /> {lang === "ur" ? tb.ur : tb.en}
            </button>
          ))}
        </div>

        {/* content */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {tab === "overview" && <OverviewTab user={user} flash={flash} />}
              {tab === "attendance" && <AttendanceTab user={user} flash={flash} />}
              {tab === "announcements" && <AnnouncementsTab user={user} flash={flash} />}
              {tab === "hr" && <HRTab user={user} flash={flash} />}
              {tab === "tickets" && <TicketsTab user={user} flash={flash} />}
              {tab === "it" && <TeamWorkTab team="IT" user={user} flash={flash} />}
              {tab === "bd" && <TeamWorkTab team="BD" user={user} flash={flash} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function OverviewTab({ user, flash }: { user: User; flash: (ok: boolean, m: string) => void }) {
  const staff = useStaff();
  const myTasks = user ? staff.myTasks(user.id) : [];
  const myTickets = user ? staff.myTickets(user.id) : [];
  const recentAnn = staff.announcements.slice(0, 3);
  const recentHR = staff.hrNotices.slice(0, 2);
  const today = new Date().toISOString().slice(0,10);
  const myToday = staff.myAttendance(user.id).find(a=>a.date===today);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white p-6">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-900"><Clock className="h-4 w-4" /> Your Attendance</h3>
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-bold text-zinc-500 uppercase">Today • {today}</p>
            {myToday ? (
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">Check In</span><span className="font-mono font-bold">{myToday.checkIn || "--:--"}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Check Out</span><span className="font-mono font-bold">{myToday.checkOut || "--:--"}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Status</span><span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold uppercase", myToday.status==="present"?"bg-emerald-500 text-white": myToday.status==="late"?"bg-amber-500 text-black": "bg-zinc-900 text-white")}>{myToday.status}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Hours</span><span className="font-bold">{myToday.hours ?? 0}h</span></div>
              </div>
            ) : <p className="mt-2 text-sm text-zinc-500">No record — tap Check In above.</p>}
          </div>
          <p className="mt-3 text-xs text-zinc-500">Late after 10:15 AM is auto-marked late.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white p-6">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-900"><ClipboardList className="h-4 w-4" /> Your Leave Tickets</h3>
          <div className="mt-4 space-y-2">
            {myTickets.slice(0,3).length===0? <p className="text-sm text-zinc-500">No tickets — apply for leave from Tickets tab.</p> : myTickets.slice(0,3).map(tk=>(
              <div key={tk.id} className="flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2">
                <div><p className="text-sm font-bold text-zinc-900">{tk.type} • {tk.days}d</p><p className="text-[11px] text-zinc-500">{tk.fromDate} → {tk.toDate}</p></div>
                <span className={cn("rounded-full px-2 py-1 text-[10px] font-bold uppercase", tk.status==="pending"?"bg-amber-100 text-amber-800": tk.status==="approved"?"bg-emerald-500 text-white":"bg-rose-500 text-white")}>{tk.status}</span>
              </div>
            ))}
            <button onClick={()=>flash(true, "Go to Tickets tab to create a new leave request")} className="w-full rounded-xl border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-bold text-white">Apply for Leave →</button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900 p-6 text-white">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white"><Briefcase className="h-4 w-4" /> My Tasks</h3>
          <div className="mt-4 space-y-2">
            {myTasks.slice(0,4).length===0? <p className="text-sm text-zinc-400">No tasks assigned yet. Check IT/BD Team tabs for pool tasks.</p> : myTasks.slice(0,4).map(ts=>(
              <div key={ts.id} className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2">
                <p className="text-sm font-bold">{ts.title}</p>
                <p className="text-[11px] text-zinc-400">{ts.department} • {ts.priority} • due {ts.dueDate}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", ts.status==="todo"?"bg-white text-black": ts.status==="in_progress"?"bg-sky-500 text-white": ts.status==="done"?"bg-emerald-500 text-white":"bg-amber-500 text-black")}>{ts.status.replace("_"," ")}</span>
                  <button onClick={()=>{ staff.updateTaskStatus(ts.id, ts.status==="todo"?"in_progress": ts.status==="in_progress"?"review":"done"); flash(true, "Task status updated")}} className="ml-auto text-[11px] font-bold text-sky-300 hover:text-white">Advance →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white p-6">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-900"><Megaphone className="h-4 w-4" /> Latest Announcements</h3>
          <div className="mt-4 space-y-3">
            {recentAnn.map(a=>(
              <div key={a.id} className="rounded-2xl border border-zinc-200 p-4">
                <div className="flex items-center gap-2"><span className="rounded-full bg-zinc-900 px-2 py-1 text-[10px] font-bold text-white uppercase">{a.visibility}</span>{a.pinned && <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600"><Pin className="h-3 w-3" />Pinned</span>}</div>
                <p className="mt-2 text-sm font-bold text-zinc-900">{a.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600 line-clamp-2">{a.body}</p>
                <p className="mt-2 text-[11px] text-zinc-400">by {a.authorName} • {new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white p-6">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-900"><ShieldAlert className="h-4 w-4" /> HR Notices</h3>
          <div className="mt-4 space-y-3">
            {recentHR.map(h=>(
              <div key={h.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2"><span className={cn("rounded-full px-2 py-1 text-[10px] font-bold uppercase", h.type==="punishment"?"bg-rose-600 text-white": h.type==="award"?"bg-emerald-600 text-white":"bg-zinc-900 text-white")}>{h.type}</span><span className="text-xs text-zinc-500">{new Date(h.createdAt).toLocaleDateString()}</span></div>
                <p className="mt-2 text-sm font-bold text-zinc-900">{h.title}</p>
                <p className="mt-1 text-xs text-zinc-700 line-clamp-3">{h.body}</p>
              </div>
            ))}
            {recentHR.length===0 && <p className="text-sm text-zinc-500">No HR notices.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceTab({ user, flash }: { user: User; flash: (ok:boolean,m:string)=>void }) {
  const staff = useStaff();
  const all = user ? staff.myAttendance(user.id) : [];
  const isAdmin = ["creator","admin","hr","it_ceo","bd_ceo"].includes(user.role);
  const [view, setView] = useState<"me"|"all">("me");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [manualDate, setManualDate] = useState(new Date().toISOString().slice(0,10));
  const [manualStatus, setManualStatus] = useState<AttendanceRecord["status"]>("present");
  const [manualNote, setManualNote] = useState("");

  const list = useMemo(()=>{
    let data = view==="all" ? staff.attendance : all;
    if (statusFilter!=="all") data = data.filter(a=>a.status===statusFilter);
    if (search) data = data.filter(a=> a.userName.toLowerCase().includes(search.toLowerCase()) || a.date.includes(search));
    return data.slice(0,120);
  }, [view, statusFilter, search, staff.attendance, all]);

  const totalPresent = all.filter(a=>a.status==="present"||a.status==="late").length;
  const totalHours = all.reduce((s,a)=> s + (a.hours||0),0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={()=>setView("me")} className={cn("rounded-full px-4 py-2 text-sm font-bold", view==="me"?"bg-white text-black":"bg-white/10 text-white border border-white/20")}>My Attendance</button>
        {isAdmin && <button onClick={()=>setView("all")} className={cn("rounded-full px-4 py-2 text-sm font-bold", view==="all"?"bg-white text-black":"bg-white/10 text-white border border-white/20")}>All Staff ({staff.attendance.length})</button>}
        <div className="ml-auto flex gap-2">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or date" className="rounded-full border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-zinc-900" /></div>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm">
            <option value="all">All status</option><option value="present">Present</option><option value="late">Late</option><option value="leave">Leave</option><option value="absent">Absent</option><option value="half_day">Half Day</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Quick Mark</h3>
          <div className="mt-3 space-y-3">
            <input type="date" value={manualDate} onChange={e=>setManualDate(e.target.value)} className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" />
            <select value={manualStatus} onChange={e=>setManualStatus(e.target.value as any)} className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm">
              <option value="present">Present</option><option value="late">Late</option><option value="leave">Leave</option><option value="absent">Absent</option><option value="half_day">Half Day</option>
            </select>
            <input value={manualNote} onChange={e=>setManualNote(e.target.value)} placeholder="Note (optional)" className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" />
            <button onClick={()=>{ staff.markAttendance(user, manualDate, manualStatus, manualNote); flash(true, `Attendance marked ${manualStatus} for ${manualDate}`); setManualNote("")}} className="w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white">Mark / Update</button>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="flex-1 rounded-2xl bg-zinc-50 p-3 text-center"><p className="text-[10px] font-bold uppercase text-zinc-500">Days Present</p><p className="text-xl font-black">{totalPresent}</p></div>
            <div className="flex-1 rounded-2xl bg-zinc-50 p-3 text-center"><p className="text-[10px] font-bold uppercase text-zinc-500">Total Hours</p><p className="text-xl font-black">{totalHours.toFixed(1)}h</p></div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">{view==="me"?"My Records":"All Records"} • {list.length}</h3>
            <span className="flex items-center gap-1 text-xs text-zinc-500"><Calendar className="h-3.5 w-3.5" /> {new Date().toLocaleDateString()}</span>
          </div>
          <div className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-zinc-200">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-500"><tr><th className="px-3 py-2">Date</th><th className="px-3 py-2">Staff</th><th className="px-3 py-2">In / Out</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Hours</th></tr></thead>
              <tbody className="divide-y divide-zinc-100">
                {list.map(a=>(
                  <tr key={a.id} className="hover:bg-zinc-50">
                    <td className="px-3 py-2 font-mono text-xs">{a.date}</td>
                    <td className="px-3 py-2"><p className="font-bold text-zinc-900">{a.userName}</p><p className="text-[11px] text-zinc-500">{a.department}</p></td>
                    <td className="px-3 py-2 font-mono text-xs">{a.checkIn || "--:--"} → {a.checkOut || "--:--"}</td>
                    <td className="px-3 py-2"><span className={cn("rounded-full px-2 py-1 text-[10px] font-bold uppercase", a.status==="present"?"bg-emerald-500 text-white": a.status==="late"?"bg-amber-400 text-black": a.status==="leave"?"bg-sky-500 text-white": a.status==="absent"?"bg-rose-500 text-white":"bg-zinc-900 text-white")}>{a.status}</span></td>
                    <td className="px-3 py-2 font-bold">{a.hours ?? "-"}</td>
                  </tr>
                ))}
                {list.length===0 && <tr><td colSpan={5} className="px-3 py-10 text-center text-sm text-zinc-500">No records</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnnouncementsTab({ user, flash }: {user:User, flash:(ok:boolean,m:string)=>void}) {
  const staff = useStaff();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [visibility, setVisibility] = useState<"ALL"|"IT"|"BD"|"HR">("ALL");
  const [filterVis, setFilterVis] = useState<string>("ALL");
  const canPost = ["creator","admin","it_ceo","bd_ceo","hr"].includes(user.role);
  const filtered = staff.announcements.filter(a=> filterVis==="ALL" ? true : a.visibility===filterVis || a.visibility==="ALL").sort((a,b)=> (b.pinned?1:0)-(a.pinned?1:0));

  return (
    <div className="space-y-4">
      {canPost && (
        <div className="rounded-3xl border border-white/10 bg-white p-6">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-900"><Megaphone className="h-4 w-4" /> Post Announcement • Visible to {visibility}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_160px]">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title — e.g. Holiday Notice" className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-zinc-900" />
            <select value={visibility} onChange={e=>setVisibility(e.target.value as any)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"><option value="ALL">All Staff</option><option value="IT">IT Only</option><option value="BD">BD Only</option><option value="HR">HR Only</option></select>
          </div>
          <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Write announcement details..." rows={3} className="mt-3 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-zinc-900" />
          <button onClick={()=>{ if(!title.trim()||!body.trim()) return flash(false, "Title and body required"); staff.addAnnouncement({ authorId:user.id, authorName:user.name, authorRole:user.role, title:title.trim(), body:body.trim(), visibility }); setTitle(""); setBody(""); flash(true, "Announcement posted to "+visibility)}} className="mt-3 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white"><Send className="h-4 w-4" /> Publish</button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Filter:</span>
        {["ALL","IT","BD","HR"].map(v=>(
          <button key={v} onClick={()=>setFilterVis(v)} className={cn("rounded-full px-3 py-1.5 text-xs font-bold border", filterVis===v?"bg-white text-black border-white":"bg-white/10 text-white border-white/20")}>{v==="ALL"?"All Channels": v}</button>
        ))}
        <span className="ml-auto text-xs text-zinc-400">{filtered.length} posts</span>
      </div>
      <div className="grid gap-3">
        {filtered.map(a=>(
          <div key={a.id} className={cn("rounded-3xl border p-5", a.pinned ? "border-amber-200 bg-amber-50" : "border-white/10 bg-white")}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-bold text-white uppercase">{a.visibility} Channel</span>
              {a.pinned && <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-black"><Pin className="h-3 w-3" /> Pinned</span>}
              <span className="text-xs text-zinc-500">by {a.authorName} • {a.authorRole} • {new Date(a.createdAt).toLocaleString()}</span>
              <div className="ml-auto flex gap-1">
                <button onClick={()=>staff.pinAnnouncement(a.id)} className="rounded-full border border-zinc-200 bg-white p-1.5 hover:bg-zinc-50"><Pin className="h-3.5 w-3.5" /></button>
                { (a.authorId===user.id || ["creator","admin"].includes(user.role)) && <button onClick={()=>staff.deleteAnnouncement(a.id)} className="rounded-full border border-rose-200 bg-rose-50 p-1.5 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>}
              </div>
            </div>
            <h4 className="mt-3 font-display text-lg font-black text-zinc-900">{a.title}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 whitespace-pre-wrap">{a.body}</p>
          </div>
        ))}
        {filtered.length===0 && <p className="py-10 text-center text-sm text-zinc-500">No announcements in this channel</p>}
      </div>
    </div>
  );
}

function HRTab({ user, flash }: {user:User, flash:(ok:boolean,m:string)=>void}) {
  const staff = useStaff();
  const canPost = ["creator","admin","hr"].includes(user.role);
  const [type, setType] = useState<HRNotice["type"]>("notice");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [severity, setSeverity] = useState<HRNotice["severity"]>("medium");
  const [targetName, setTargetName] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const list = staff.hrNotices.filter(h=> filterType==="all" ? true : h.type===filterType);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div><p className="text-sm font-black text-amber-900">HR Channel — Punishments, Awards & Policy Changes</p><p className="text-xs text-amber-800">Only HR & Creator can post. All staff can read. Targets are notified.</p></div>
      </div>
      {canPost && (
        <div className="rounded-3xl border border-white/10 bg-white p-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">Post HR Notice</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title — e.g. Warning: Late Arrivals" className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
            <input value={targetName} onChange={e=>setTargetName(e.target.value)} placeholder="Target staff name (optional)" className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <select value={type} onChange={e=>setType(e.target.value as any)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"><option value="punishment">Punishment</option><option value="warning">Warning</option><option value="award">Award</option><option value="policy">Policy Change</option><option value="notice">Notice</option></select>
            <select value={severity} onChange={e=>setSeverity(e.target.value as any)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"><option value="low">Low severity</option><option value="medium">Medium</option><option value="high">High</option></select>
            <button onClick={()=>{ if(!title.trim()||!body.trim()) return flash(false,"Title & body required"); staff.addHRNotice({ authorId:user.id, authorName:user.name, type, title:title.trim(), body:body.trim(), severity, targetName: targetName.trim() || undefined }); setTitle(""); setBody(""); setTargetName(""); flash(true,"HR notice published")}} className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white">Publish HR Notice</button>
          </div>
          <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Details — what happened, what changes..." rows={3} className="mt-3 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Type:</span>
        {["all","punishment","warning","award","policy","notice"].map(k=>(
          <button key={k} onClick={()=>setFilterType(k)} className={cn("rounded-full px-3 py-1.5 text-xs font-bold border capitalize", filterType===k?"bg-white text-black":"bg-white/10 text-white border-white/20")}>{k}</button>
        ))}
      </div>
      <div className="grid gap-3">
        {list.map(h=>(
          <div key={h.id} className={cn("rounded-3xl border p-5", h.type==="punishment"?"border-rose-200 bg-rose-50": h.type==="award"?"border-emerald-200 bg-emerald-50": h.type==="warning"?"border-amber-200 bg-amber-50":"border-zinc-200 bg-white")}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-black uppercase", h.type==="punishment"?"bg-rose-600 text-white": h.type==="award"?"bg-emerald-600 text-white": h.type==="warning"?"bg-amber-500 text-black":"bg-zinc-900 text-white")}>{h.type}</span>
              {h.severity && <span className="rounded-full bg-white px-2 py-1 text-[11px] font-bold border">severity: {h.severity}</span>}
              {h.targetName && <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-bold text-white">Target: {h.targetName}</span>}
              <span className="text-xs text-zinc-500">{new Date(h.createdAt).toLocaleString()}</span>
              {canPost && <button onClick={()=>staff.deleteHRNotice(h.id)} className="ml-auto rounded-full bg-white p-1.5 border text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>}
            </div>
            <h4 className="mt-3 font-bold text-zinc-900">{h.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">{h.body}</p>
            <p className="mt-2 text-xs text-zinc-500">Posted by {h.authorName}</p>
          </div>
        ))}
        {list.length===0 && <p className="text-center text-sm text-zinc-400 py-10">No HR notices yet</p>}
      </div>
    </div>
  );
}

function TicketsTab({ user, flash }: {user:User, flash:(ok:boolean,m:string)=>void}) {
  const staff = useStaff();
  const [filter, setFilter] = useState<string>("all");
  const [type, setType] = useState<LeaveType>("casual");
  const [from, setFrom] = useState(new Date().toISOString().slice(0,10));
  const [to, setTo] = useState(new Date().toISOString().slice(0,10));
  const [reason, setReason] = useState("");
  const [view, setView] = useState<"me"|"all">("me");
  const canReview = ["creator","admin","hr","it_ceo","bd_ceo"].includes(user.role);
  const list = useMemo(()=>{
    let data = view==="all" ? staff.tickets : staff.myTickets(user.id);
    if (filter!=="all") data = data.filter(t=>t.status===filter);
    return data.sort((a,b)=> new Date(b.createdAt).getTime()- new Date(a.createdAt).getTime());
  }, [view, filter, staff.tickets, user.id]);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white p-6">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-900"><ClipboardList className="h-4 w-4" /> Apply for Leave (Off Ticket)</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <select value={type} onChange={e=>setType(e.target.value as any)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"><option value="casual">Casual</option><option value="sick">Sick</option><option value="annual">Annual</option><option value="emergency">Emergency</option><option value="half_day">Half Day</option><option value="wfh">WFH</option></select>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm" />
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm" />
          <button onClick={()=>{ if(!reason.trim()) return flash(false,"Reason required"); staff.createTicket({ userId:user.id, userName:user.name, userEmail:user.email, department: user.department || "ALL", type, fromDate:from, toDate:to, reason:reason.trim()}); setReason(""); flash(true, "Leave ticket submitted — pending HR review")}} className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white">Submit Ticket</button>
        </div>
        <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="Reason for leave..." rows={2} className="mt-3 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
        <p className="mt-2 text-xs text-zinc-500">HR / IT CEO / BD CEO / Creator can approve. You’ll be notified on status change.</p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={()=>setView("me")} className={cn("rounded-full px-4 py-2 text-sm font-bold", view==="me"?"bg-white text-black":"bg-white/10 text-white border border-white/20")}>My Tickets ({staff.myTickets(user.id).length})</button>
        {canReview && <button onClick={()=>setView("all")} className={cn("rounded-full px-4 py-2 text-sm font-bold", view==="all"?"bg-white text-black":"bg-white/10 text-white border border-white/20")}>All Tickets ({staff.tickets.length})</button>}
        <div className="ml-auto flex gap-1">
          {["all","pending","approved","rejected"].map(s=>(
            <button key={s} onClick={()=>setFilter(s)} className={cn("rounded-full px-3 py-1.5 text-xs font-bold border capitalize", filter===s?"bg-white text-black":"bg-white/10 text-white border-white/20")}>{s}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {list.map(tk=>(
          <div key={tk.id} className="rounded-3xl border border-white/10 bg-white p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold uppercase", tk.type==="sick"?"bg-sky-500 text-white": tk.type==="emergency"?"bg-rose-600 text-white":"bg-zinc-900 text-white")}>{tk.type} • {tk.days} day(s)</span>
              <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold uppercase", tk.status==="pending"?"bg-amber-100 text-amber-800 border border-amber-200": tk.status==="approved"?"bg-emerald-500 text-white":"bg-rose-500 text-white")}>{tk.status}</span>
              <span className="text-xs text-zinc-500">{tk.fromDate} → {tk.toDate} • by {tk.userName} ({tk.department})</span>
              <span className="text-xs text-zinc-500">• {new Date(tk.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-2 text-sm text-zinc-700 whitespace-pre-wrap">{tk.reason}</p>
            {tk.reviewNote && <p className="mt-2 rounded-xl bg-zinc-50 px-3 py-2 text-xs text-zinc-600">Review: {tk.reviewNote} — by {tk.reviewedBy}</p>}
            {canReview && tk.status==="pending" && (
              <div className="mt-3 flex gap-2">
                <button onClick={()=>{ staff.updateTicketStatus(tk.id, "approved", user.name, "Approved ✓"); flash(true, "Ticket approved")}} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white"><CheckCircle2 className="h-3.5 w-3.5" /> Approve</button>
                <button onClick={()=>{ staff.updateTicketStatus(tk.id, "rejected", user.name, "Rejected — contact HR"); flash(false, "Ticket rejected")}} className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-1.5 text-xs font-bold text-white"><XCircle className="h-3.5 w-3.5" /> Reject</button>
              </div>
            )}
            {(tk.userId===user.id || ["creator","admin"].includes(user.role)) && <button onClick={()=>staff.deleteTicket(tk.id)} className="mt-2 text-xs text-rose-600 hover:underline">Delete ticket</button>}
          </div>
        ))}
        {list.length===0 && <p className="text-center text-sm text-zinc-400 py-10">No tickets</p>}
      </div>
    </div>
  );
}

function TeamWorkTab({ team, user, flash }: {team:"IT"|"BD", user:User, flash:(ok:boolean,m:string)=>void}) {
  const staff = useStaff();
  const allTasks = staff.tasksForTeam(team);
  const canAssign = team==="IT" ? ["creator","admin","it_ceo"].includes(user.role) : ["creator","admin","bd_ceo"].includes(user.role);
  // also creator can assign to both
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [prioFilter, setPrioFilter] = useState<string>("all");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [assigneeName, setAssigneeName] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [due, setDue] = useState(new Date(Date.now()+86400000*3).toISOString().slice(0,10));

  const staffUsers = loadUsers().filter(u=> {
    if (team==="IT") return u.role==="it_staff" || u.department==="IT" || u.role==="it_ceo";
    return u.role==="bd_staff" || u.department==="BD" || u.role==="bd_ceo";
  });

  const filtered = allTasks.filter(t=>{
    if (statusFilter!=="all" && t.status!==statusFilter) return false;
    if (prioFilter!=="all" && t.priority!==prioFilter) return false;
    if (q && !t.title.toLowerCase().includes(q.toLowerCase()) && !t.assigneeName.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className={cn("rounded-3xl border p-6", team==="IT"?"border-sky-200 bg-sky-50":"border-emerald-200 bg-emerald-50")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest"><Building2 className="h-4 w-4" /> {team} Team — Work Assignments</h3>
          <span className="text-xs font-bold">{allTasks.length} tasks • {allTasks.filter(t=>t.status!=="done"&&t.status!=="cancelled").length} active</span>
        </div>
        <p className="mt-1 text-xs text-zinc-600">{team==="IT" ? "IT CEO assigns work to IT staff. All IT staff see tasks here." : "BD CEO assigns work to BD staff. All BD staff see tasks here."} Creator can assign to both teams.</p>
      </div>

      {canAssign && (
        <div className="rounded-3xl border border-white/10 bg-white p-6">
          <h4 className="text-sm font-black uppercase tracking-widest text-zinc-900">Assign New Work — {team} Team</h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder={`Task title — e.g. ${team==="IT"?"Fix homepage bug":"Call 20 leads today"}`} className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
            <div className="flex gap-2">
              <select value={assigneeName} onChange={e=>setAssigneeName(e.target.value)} className="flex-1 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm">
                <option value="">Select assignee — pool or person</option>
                <option value={`${team} Team — Pool`}>{team} Team — Pool (everyone)</option>
                {staffUsers.map(u=> <option key={u.id} value={u.name}>{u.name} • {u.role}</option>)}
              </select>
              <select value={priority} onChange={e=>setPriority(e.target.value as any)} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select>
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_160px_140px]">
            <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description — what needs to be done?" className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm" />
            <input type="date" value={due} onChange={e=>setDue(e.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm" />
            <button onClick={()=>{ if(!title.trim()) return flash(false,"Title required"); if(!assigneeName) return flash(false,"Pick an assignee"); const target = loadUsers().find(u=>u.name===assigneeName); staff.createTask({ title:title.trim(), description: desc.trim() || "No description", department: team, assignerId:user.id, assignerName:user.name, assigneeId: target?.id || "", assigneeName, priority, dueDate:due }); setTitle(""); setDesc(""); flash(true, `Task assigned to ${assigneeName} in ${team}`)}} className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white">Assign</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" /><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tasks or assignee" className="w-full rounded-full border border-white/20 bg-white/10 py-2 pl-9 pr-4 text-sm text-white placeholder-zinc-400 outline-none focus:bg-white focus:text-black" /></div>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"><option className="text-black" value="all">All status</option><option className="text-black" value="todo">Todo</option><option className="text-black" value="in_progress">In Progress</option><option className="text-black" value="review">Review</option><option className="text-black" value="done">Done</option></select>
        <select value={prioFilter} onChange={e=>setPrioFilter(e.target.value)} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"><option className="text-black" value="all">All priority</option><option className="text-black" value="urgent">Urgent</option><option className="text-black" value="high">High</option><option className="text-black" value="medium">Medium</option><option className="text-black" value="low">Low</option></select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map(t=>(
          <div key={t.id} className="rounded-3xl border border-white/10 bg-white p-5 flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-black uppercase", t.priority==="urgent"?"bg-rose-600 text-white": t.priority==="high"?"bg-amber-500 text-black": t.priority==="medium"?"bg-zinc-900 text-white":"bg-zinc-100 text-zinc-700 border")}>{t.priority}</span>
              <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold uppercase border", t.status==="todo"?"bg-zinc-100 text-zinc-700": t.status==="in_progress"?"bg-sky-500 text-white border-sky-500": t.status==="review"?"bg-amber-400 text-black border-amber-400": t.status==="done"?"bg-emerald-500 text-white border-emerald-500":"bg-zinc-900 text-white")}>{t.status.replace("_"," ")}</span>
              <span className="text-xs text-zinc-500">due {t.dueDate}</span>
            </div>
            <h4 className="mt-3 font-bold text-zinc-900 line-clamp-2">{t.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600 line-clamp-3">{t.description}</p>
            <div className="mt-3 rounded-xl bg-zinc-50 px-3 py-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Assigned</p>
              <p className="text-sm font-bold text-zinc-900">{t.assigneeName}</p>
              <p className="text-xs text-zinc-500">by {t.assignerName} • {new Date(t.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              { (["todo","in_progress","review","done"] as TaskStatus[]).map(s=>(
                <button key={s} onClick={()=>{ staff.updateTaskStatus(t.id, s); flash(true, `Task moved to ${s}`)}} className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold border", t.status===s?"bg-zinc-900 text-white border-zinc-900":"bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50")}>{s.replace("_"," ")}</button>
              ))}
            </div>
            {canAssign && <button onClick={()=>staff.deleteTask(t.id)} className="mt-2 text-xs text-rose-600 hover:underline">Delete task</button>}
          </div>
        ))}
        {filtered.length===0 && <div className="sm:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-zinc-400">No tasks match filters — create one above if you’re CEO/Creator</div>}
      </div>
    </div>
  );
}
