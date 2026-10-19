import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { uid, type User } from "../lib/users";
import { localGet, localSet } from "../lib/db";

// ===================== Types =====================

export type AttendanceStatus = "present" | "absent" | "late" | "leave" | "half_day";
export type AttendanceRecord = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:mm
  checkOut?: string;
  status: AttendanceStatus;
  hours?: number;
  note?: string;
  createdAt: string;
};

export type Announcement = {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  title: string;
  body: string;
  visibility: "ALL" | "IT" | "BD" | "HR";
  pinned?: boolean;
  createdAt: string;
};

export type HRNoticeType = "punishment" | "award" | "policy" | "notice" | "warning";
export type HRNotice = {
  id: string;
  authorId: string;
  authorName: string;
  type: HRNoticeType;
  title: string;
  body: string;
  targetUserId?: string;
  targetName?: string;
  severity?: "low" | "medium" | "high";
  department?: string;
  createdAt: string;
};

export type LeaveType = "sick" | "casual" | "annual" | "emergency" | "half_day" | "wfh";
export type TicketStatus = "pending" | "approved" | "rejected" | "cancelled";
export type Ticket = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: string;
  type: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: TicketStatus;
  reviewedBy?: string;
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "review" | "done" | "cancelled";
export type Task = {
  id: string;
  title: string;
  description: string;
  department: "IT" | "BD";
  assignerId: string;
  assignerName: string;
  assigneeId: string;
  assigneeName: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

// ===================== Keys =====================

const ATT_KEY = "devzard_attendance";
const ANN_KEY = "devzard_announcements";
const HR_KEY = "devzard_hr_notices";
const TICKET_KEY = "devzard_tickets";
const TASK_KEY = "devzard_tasks";

// ===================== Helpers =====================

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function calcHours(checkIn?: string, checkOut?: string): number | undefined {
  if (!checkIn || !checkOut) return undefined;
  const [h1, m1] = checkIn.split(":").map(Number);
  const [h2, m2] = checkOut.split(":").map(Number);
  const diff = h2 * 60 + m2 - (h1 * 60 + m1);
  if (diff <= 0) return 0;
  return Math.round((diff / 60) * 10) / 10;
}
function load<T>(key: string, fallback: T): T {
  return localGet<T>(key, fallback);
}
function save<T>(key: string, v: T) {
  localSet(key, v);
}

// ===================== Context =====================

type StaffContextType = {
  // attendance
  attendance: AttendanceRecord[];
  checkIn: (user: User) => { ok: boolean; msg: string };
  checkOut: (user: User) => { ok: boolean; msg: string };
  markAttendance: (user: User, date: string, status: AttendanceStatus, note?: string) => void;
  updateAttendance: (id: string, patch: Partial<AttendanceRecord>) => void;
  deleteAttendance: (id: string) => void;
  myAttendance: (userId: string) => AttendanceRecord[];
  todayAttendance: () => AttendanceRecord[];

  // announcements
  announcements: Announcement[];
  addAnnouncement: (a: Omit<Announcement, "id" | "createdAt">) => void;
  deleteAnnouncement: (id: string) => void;
  pinAnnouncement: (id: string) => void;

  // HR
  hrNotices: HRNotice[];
  addHRNotice: (n: Omit<HRNotice, "id" | "createdAt">) => void;
  deleteHRNotice: (id: string) => void;

  // tickets
  tickets: Ticket[];
  createTicket: (t: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status" | "days">) => Ticket;
  updateTicketStatus: (id: string, status: TicketStatus, reviewerName?: string, note?: string) => void;
  deleteTicket: (id: string) => void;
  myTickets: (userId: string) => Ticket[];

  // tasks
  tasks: Task[];
  createTask: (t: Omit<Task, "id" | "createdAt" | "updatedAt" | "status">) => Task;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  tasksForTeam: (dept: "IT" | "BD") => Task[];
  myTasks: (userId: string) => Task[];
  tasksAssignedBy: (userId: string) => Task[];
};

const StaffContext = createContext<StaffContextType | null>(null);

export function StaffProvider({ children }: { children: ReactNode }) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => load(ATT_KEY, [] as AttendanceRecord[]));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    load(ANN_KEY, [
      {
        id: "ann-1",
        authorId: "creator",
        authorName: "DEVZARD HQ",
        authorRole: "creator",
        title: "Welcome to DEVZARD Staff Portal 🎉",
        body: "This is the company-wide announcement channel. All staff receive updates here. HR will post policy changes and CEO will assign work in team sections.",
        visibility: "ALL",
        pinned: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "ann-2",
        authorId: "creator",
        authorName: "IT CEO",
        authorRole: "it_ceo",
        title: "IT Sprint Kickoff — Q4 Roadmap",
        body: "IT team: sprint planning Monday 10AM. Bring your task updates. BD team sync at 2PM.",
        visibility: "IT",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ] as Announcement[])
  );
  const [hrNotices, setHrNotices] = useState<HRNotice[]>(() =>
    load(HR_KEY, [
      {
        id: "hr-1",
        authorId: "hr",
        authorName: "HR Department",
        type: "policy",
        title: "Updated Leave Policy — Effective Jan 2025",
        body: "All leave requests must be submitted 3 days in advance except emergencies. Late check-ins after 10:15 AM will be marked late.",
        severity: "medium",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ] as HRNotice[])
  );
  const [tickets, setTickets] = useState<Ticket[]>(() => load(TICKET_KEY, [] as Ticket[]));
  const [tasks, setTasks] = useState<Task[]>(() =>
    load(TASK_KEY, [
      {
        id: "task-it-1",
        title: "Redesign DEVZARD landing hero",
        description: "Update hero to blackish/white theme with dark toggle. Use Tailwind v4.",
        department: "IT",
        assignerId: "creator",
        assignerName: "Creator (DEVZARD)",
        assigneeId: "",
        assigneeName: "IT Team — Pool",
        priority: "high",
        status: "todo",
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "task-bd-1",
        title: "Client outreach — Q4 BD campaign",
        description: "Reach 50 new leads this week. Update CRM daily. Target UAE + PK markets.",
        department: "BD",
        assignerId: "creator",
        assignerName: "Creator (DEVZARD)",
        assigneeId: "",
        assigneeName: "BD Team — Pool",
        priority: "urgent",
        status: "in_progress",
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ] as Task[])
  );

  // persist
  useEffect(() => save(ATT_KEY, attendance), [attendance]);
  useEffect(() => save(ANN_KEY, announcements), [announcements]);
  useEffect(() => save(HR_KEY, hrNotices), [hrNotices]);
  useEffect(() => save(TICKET_KEY, tickets), [tickets]);
  useEffect(() => save(TASK_KEY, tasks), [tasks]);

  // ---- Attendance ----
  const checkIn = (user: User) => {
    const date = todayISO();
    const existing = attendance.find((a) => a.userId === user.id && a.date === date);
    if (existing?.checkIn) return { ok: false, msg: "Already checked in today" };
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const isLate = now.getHours() > 10 || (now.getHours() === 10 && now.getMinutes() > 15);
    if (existing) {
      setAttendance((prev) =>
        prev.map((a) =>
          a.id === existing.id
            ? { ...a, checkIn: time, status: (isLate ? "late" : "present") as AttendanceStatus, hours: calcHours(time, a.checkOut) }
            : a
        )
      );
    } else {
      const rec: AttendanceRecord = {
        id: uid("att"),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        department: user.department || "ALL",
        date,
        checkIn: time,
        status: isLate ? "late" : "present",
        createdAt: new Date().toISOString(),
      };
      setAttendance((prev) => [rec, ...prev]);
    }
    return { ok: true, msg: isLate ? "Checked in (marked late)" : "Checked in — have a great day!" };
  };

  const checkOut = (user: User) => {
    const date = todayISO();
    const existing = attendance.find((a) => a.userId === user.id && a.date === date);
    if (!existing?.checkIn) return { ok: false, msg: "Please check in first" };
    if (existing.checkOut) return { ok: false, msg: "Already checked out" };
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setAttendance((prev) =>
      prev.map((a) => (a.id === existing.id ? { ...a, checkOut: time, hours: calcHours(a.checkIn, time) } : a))
    );
    return { ok: true, msg: "Checked out — see you tomorrow!" };
  };

  const markAttendance = (user: User, date: string, status: AttendanceStatus, note?: string) => {
    const existing = attendance.find((a) => a.userId === user.id && a.date === date);
    if (existing) {
      setAttendance((prev) => prev.map((a) => (a.id === existing.id ? { ...a, status, note } : a)));
    } else {
      const rec: AttendanceRecord = {
        id: uid("att"),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        department: user.department || "ALL",
        date,
        status,
        note,
        createdAt: new Date().toISOString(),
      };
      setAttendance((prev) => [rec, ...prev]);
    }
  };

  const updateAttendance = (id: string, patch: Partial<AttendanceRecord>) =>
    setAttendance((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch, hours: calcHours(patch.checkIn ?? a.checkIn, patch.checkOut ?? a.checkOut) ?? a.hours } : a)));

  const deleteAttendance = (id: string) => setAttendance((prev) => prev.filter((a) => a.id !== id));
  const myAttendance = (userId: string) => attendance.filter((a) => a.userId === userId).sort((a, b) => (b.date > a.date ? 1 : -1));
  const todayAttendance = () => {
    const t = todayISO();
    return attendance.filter((a) => a.date === t);
  };

  // ---- Announcements ----
  const addAnnouncement = (a: Omit<Announcement, "id" | "createdAt">) => {
    const rec: Announcement = { ...a, id: uid("ann"), createdAt: new Date().toISOString() };
    setAnnouncements((prev) => [rec, ...prev]);
  };
  const deleteAnnouncement = (id: string) => setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  const pinAnnouncement = (id: string) =>
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)));

  // ---- HR ----
  const addHRNotice = (n: Omit<HRNotice, "id" | "createdAt">) => {
    const rec: HRNotice = { ...n, id: uid("hr"), createdAt: new Date().toISOString() };
    setHrNotices((prev) => [rec, ...prev]);
  };
  const deleteHRNotice = (id: string) => setHrNotices((prev) => prev.filter((a) => a.id !== id));

  // ---- Tickets ----
  const createTicket = (t: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status" | "days">) => {
    const from = new Date(t.fromDate);
    const to = new Date(t.toDate);
    const diff = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
    const rec: Ticket = {
      ...t,
      id: uid("tkt"),
      days: diff,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets((prev) => [rec, ...prev]);
    return rec;
  };
  const updateTicketStatus = (id: string, status: TicketStatus, reviewerName?: string, note?: string) =>
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status, reviewedBy: reviewerName, reviewNote: note, updatedAt: new Date().toISOString() } : t)));
  const deleteTicket = (id: string) => setTickets((prev) => prev.filter((t) => t.id !== id));
  const myTickets = (userId: string) => tickets.filter((t) => t.userId === userId);

  // ---- Tasks ----
  const createTask = (t: Omit<Task, "id" | "createdAt" | "updatedAt" | "status">) => {
    const rec: Task = { ...t, id: uid("task"), status: "todo", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setTasks((prev) => [rec, ...prev]);
    return rec;
  };
  const updateTaskStatus = (id: string, status: TaskStatus) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t)));
  const updateTask = (id: string, patch: Partial<Task>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t)));
  const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const tasksForTeam = (dept: "IT" | "BD") => tasks.filter((t) => t.department === dept);
  const myTasks = (userId: string) => tasks.filter((t) => t.assigneeId === userId);
  const tasksAssignedBy = (userId: string) => tasks.filter((t) => t.assignerId === userId);

  return (
    <StaffContext.Provider
      value={{
        attendance,
        checkIn,
        checkOut,
        markAttendance,
        updateAttendance,
        deleteAttendance,
        myAttendance,
        todayAttendance,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        pinAnnouncement,
        hrNotices,
        addHRNotice,
        deleteHRNotice,
        tickets,
        createTicket,
        updateTicketStatus,
        deleteTicket,
        myTickets,
        tasks,
        createTask,
        updateTaskStatus,
        updateTask,
        deleteTask,
        tasksForTeam,
        myTasks,
        tasksAssignedBy,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error("useStaff must be used inside StaffProvider");
  return ctx;
}
