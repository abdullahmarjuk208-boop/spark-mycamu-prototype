"use client";

import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import "./styles.css";

type Screen =
  | "institution"
  | "login"
  | "home"
  | "courses"
  | "course"
  | "tasks"
  | "inbox"
  | "announcement"
  | "assignment"
  | "upload"
  | "review"
  | "confirm"
  | "success"
  | "record"
  | "attendance"
  | "results"
  | "schedule"
  | "services";

type UploadState = "idle" | "uploading" | "valid" | "error";
type IconName =
  | "home"
  | "book"
  | "task"
  | "inbox"
  | "search"
  | "bell"
  | "user"
  | "arrow"
  | "clock"
  | "calendar"
  | "file"
  | "upload"
  | "check"
  | "warning"
  | "download"
  | "chevron"
  | "close"
  | "eye"
  | "shield"
  | "help";

const taskData = [
  {
    title: "UX Assignment - Part 4",
    course: "BIT2323 · User Experience Design",
    due: "Today, 11:59 PM",
    status: "Ready to continue",
    urgency: "critical",
  },
  {
    title: "Database quiz",
    course: "BIT2124 · Database Management",
    due: "Tomorrow, 9:00 AM",
    status: "Not started",
    urgency: "soon",
  },
  {
    title: "AI lab report",
    course: "BIT2213 · Artificial Intelligence",
    due: "Friday, 5:00 PM",
    status: "Draft saved",
    urgency: "normal",
  },
];

const courses = [
  { code: "BIT2323", name: "User Experience Design", detail: "2 new items", tone: "teal" },
  { code: "BIT2124", name: "Database Management", detail: "1 task due", tone: "blue" },
  { code: "BIT2213", name: "Artificial Intelligence", detail: "No urgent items", tone: "violet" },
  { code: "BIT2113", name: "Project Management", detail: "Next class Thursday", tone: "amber" },
];

const academicCourses = [
  { code: "BIT2323", name: "User Experience Design", lecturer: "Dr. Aisha Rahman", attendance: 92, grade: "A-", progress: 76, next: "Studio · Wed 10:00 AM" },
  { code: "BIT2124", name: "Database Management", lecturer: "Mr. Daniel Lee", attendance: 88, grade: "B+", progress: 68, next: "Lab · Thu 2:00 PM" },
  { code: "BIT2213", name: "Artificial Intelligence", lecturer: "Dr. Kavitha Nair", attendance: 95, grade: "A", progress: 81, next: "Lecture · Fri 9:00 AM" },
  { code: "BIT2113", name: "Project Management", lecturer: "Ms. Farah Lim", attendance: 84, grade: "B", progress: 62, next: "Tutorial · Fri 3:00 PM" },
  { code: "BIT2133", name: "Software Testing", lecturer: "Mr. Amir Hakim", attendance: 90, grade: "A-", progress: 72, next: "Lab · Mon 11:00 AM" },
];

const todaySchedule = [
  { time: "10:00", end: "12:00", code: "BIT2323", title: "UX Design Studio", room: "Block A · Lab 6", status: "Next" },
  { time: "14:00", end: "16:00", code: "BIT2124", title: "Database Lab", room: "Block B · Lab 2", status: "Later" },
  { time: "16:30", end: "17:30", code: "ADV101", title: "Academic Advising", room: "Student Hub · L2", status: "Later" },
];

const serviceItems = [
  { title: "Student timetable", detail: "Weekly classes and rooms", icon: "calendar" as IconName, target: "schedule" as Screen },
  { title: "Attendance", detail: "Overall and course records", icon: "check" as IconName, target: "attendance" as Screen },
  { title: "Results & CGPA", detail: "Grades and progression", icon: "task" as IconName, target: "results" as Screen },
  { title: "Student services", detail: "Letters, forms and finance", icon: "file" as IconName, target: "services" as Screen },
];

const screenTitles: Record<Screen, string> = {
  institution: "Welcome",
  login: "Student sign in",
  home: "Home",
  courses: "Courses",
  course: "Course workspace",
  tasks: "Tasks",
  inbox: "Inbox",
  announcement: "Announcement",
  assignment: "Assignment details",
  upload: "Submit assignment",
  review: "Review submission",
  confirm: "Final confirmation",
  success: "Submission complete",
  record: "Submission record",
  attendance: "Attendance",
  results: "Results and CGPA",
  schedule: "Class schedule",
  services: "Student services",
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7"/></>,
    book: <><path d="M4 4.5h6.5A2.5 2.5 0 0 1 13 7v13a3 3 0 0 0-3-3H4z"/><path d="M20 4.5h-6.5A2.5 2.5 0 0 0 11 7v13a3 3 0 0 1 3-3h6z"/></>,
    task: <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
    inbox: <><path d="M3 7h18v12H3z"/><path d="m3 8 9 7 9-7"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    bell: <><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7"/><path d="M10 20h4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    arrow: <><path d="m15 18-6-6 6-6"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></>,
    file: <><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/></>,
    upload: <><path d="M12 16V3M7 8l5-5 5 5"/><path d="M4 14v7h16v-7"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    warning: <><path d="m12 3 10 18H2z"/><path d="M12 9v5M12 18h.01"/></>,
    download: <><path d="M12 3v13M7 11l5 5 5-5"/><path d="M4 19v2h16v-2"/></>,
    chevron: <><path d="m9 18 6-6-6-6"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    shield: <><path d="M12 2 4 5v6c0 5.5 3.4 9.2 8 11 4.6-1.8 8-5.5 8-11V5z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3 2.3c-.8.3-.8.9-.8 1.7M12 17h.01"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return <span className={`status-badge ${tone}`}><span className="status-dot" />{children}</span>;
}

function Button({ children, variant = "primary", icon, onClick, type = "button", disabled = false, className = "" }: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet" | "danger";
  icon?: IconName;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return <button type={type} className={`button ${variant} ${className}`} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon} />}{children}</button>;
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Upload", "Review", "Submit"];
  return (
    <ol className="stepper" aria-label={`Submission progress: step ${step} of 3`}>
      {steps.map((label, index) => {
        const n = index + 1;
        return <li key={label} className={n < step ? "done" : n === step ? "active" : ""}>
          <span className="step-number">{n < step ? <Icon name="check" size={16} /> : n}</span>
          <span>{label}</span>
        </li>;
      })}
    </ol>
  );
}

function TaskCard({ task, onOpen }: { task: typeof taskData[number]; onOpen: () => void }) {
  return (
    <article className={`task-card ${task.urgency}`}>
      <div className="task-time"><Icon name="clock" size={18} /><span>{task.due}</span></div>
      <h3>{task.title}</h3>
      <p>{task.course}</p>
      <div className="task-card-footer">
        <StatusBadge tone={task.urgency === "critical" ? "urgent" : task.urgency === "soon" ? "warning" : "neutral"}>{task.status}</StatusBadge>
        <button className="text-action" onClick={onOpen}>Open <Icon name="chevron" size={17} /></button>
      </div>
    </article>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("institution");
  const [trail, setTrail] = useState<Screen[]>([]);
  const [largeText, setLargeText] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [institution, setInstitution] = useState("SEGi University");
  const [studentId, setStudentId] = useState("nadia.rahman@segi.edu.my");
  const [password, setPassword] = useState("Prototype1!");
  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [submittedAt, setSubmittedAt] = useState("Today, 10:42 PM (MYT)");
  const [liveMessage, setLiveMessage] = useState("");
  const mainRef = useRef<HTMLElement>(null);

  const navigate = (next: Screen) => {
    setTrail((current) => [...current, screen]);
    setScreen(next);
    requestAnimationFrame(() => mainRef.current?.focus());
  };

  const goBack = () => {
    const previous = trail.at(-1) ?? "home";
    setTrail((current) => current.slice(0, -1));
    setScreen(previous);
    requestAnimationFrame(() => mainRef.current?.focus());
  };

  const goPrimary = (next: Screen) => {
    setTrail([]);
    setScreen(next);
    requestAnimationFrame(() => mainRef.current?.focus());
  };

  useEffect(() => {
    if (uploadState !== "uploading") return;
    const timer = window.setInterval(() => {
      setProgress((value) => {
        const next = Math.min(value + 8, 100);
        if (next === 100) {
          window.clearInterval(timer);
          setUploadState("valid");
          setLiveMessage("Upload complete. File type, size and completeness validated.");
        }
        return next;
      });
    }, 140);
    return () => window.clearInterval(timer);
  }, [uploadState]);

  const startValidUpload = (name: string, size: string) => {
    setFileName(name);
    setFileSize(size);
    setProgress(0);
    setUploadState("uploading");
    setLiveMessage(`Uploading ${name}`);
  };

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !["pdf", "docx"].includes(extension)) {
      setFileName(file.name);
      setFileSize(`${(file.size / 1024 / 1024).toFixed(1)} MB`);
      setUploadState("error");
      setLiveMessage("Upload needs attention. The selected file type is not accepted.");
      return;
    }
    startValidUpload(file.name, `${(file.size / 1024 / 1024).toFixed(1)} MB`);
  };

  const showErrorExample = () => {
    setFileName("part4_prototype.pages");
    setFileSize("11.7 MB");
    setUploadState("error");
    setLiveMessage("Upload needs attention. The selected file type is not accepted.");
  };

  const submitLogin = (event: FormEvent) => {
    event.preventDefault();
    setTrail([]);
    setScreen("home");
    setLiveMessage("Signed in successfully. Dashboard loaded.");
  };

  const finishSubmission = () => {
    const now = new Date();
    setSubmittedAt(`Today, ${now.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })} (MYT)`);
    setTrail([]);
    setScreen("success");
    setLiveMessage("Assignment submitted successfully. A persistent receipt is now available.");
  };

  const downloadReceipt = () => {
    const receipt = [
      "SPARK SUBMISSION RECEIPT",
      "Reference: SPK-BIT2323-3A7F92",
      "Student: Nadia Rahman",
      "Assignment: UX Assignment - Part 4",
      `File: ${fileName || "ui_part_4_prototype_report.pdf"}`,
      `Submitted: ${submittedAt}`,
      "Status: Submitted on time",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([receipt], { type: "text/plain" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Spark_submission_receipt_BIT2323.txt";
    anchor.click();
    URL.revokeObjectURL(url);
    setLiveMessage("Submission receipt downloaded.");
  };

  const activeNav = (["course", "courses"].includes(screen) ? "courses" : ["tasks", "assignment", "upload", "review", "confirm", "success", "record"].includes(screen) ? "tasks" : ["inbox", "announcement"].includes(screen) ? "inbox" : "home") as "home" | "courses" | "tasks" | "inbox";
  const renderInstitution = () => (
    <div className="auth-shell">
      <section className="auth-brand-panel" aria-label="Spark prototype introduction">
        <div className="brand-lockup"><span className="brand-mark">S</span><span>SPARK</span></div>
        <div className="auth-brand-copy">
          <StatusBadge tone="inverse">Student experience, redesigned</StatusBadge>
          <h1>Your academic day,<br />organised around you.</h1>
          <p>See what matters, complete urgent work and keep reliable evidence of every submission.</p>
        </div>
        <div className="floating-card deadline-card">
          <span className="mini-icon"><Icon name="clock" /></span>
          <div><small>Due today · 11:59 PM</small><strong>UX Assignment - Part 4</strong></div>
          <span className="floating-arrow">→</span>
        </div>
        <div className="floating-card receipt-card">
          <span className="mini-icon success"><Icon name="check" /></span>
          <div><small>Submission status</small><strong>Receipt saved securely</strong></div>
        </div>
        <p className="prototype-note"><Icon name="shield" size={17} /> Academic prototype · No personal data is sent</p>
      </section>
      <main className="auth-main" id="main-content" ref={mainRef} tabIndex={-1}>
        <div className="mobile-brand"><span className="brand-mark">S</span><span>SPARK</span></div>
        <div className="auth-card">
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Choose your institution</h2>
          <p className="muted">We remembered the institution used on this trusted device.</p>
          <div className="institution-card">
            <div className="institution-emblem">SU</div>
            <div><small>INSTITUTION</small><strong>{institution}</strong><span>Saved on this device</span></div>
            <Icon name="check" size={21} />
          </div>
          <Button onClick={() => navigate("login")} className="full">Continue to sign in</Button>
          <Button variant="secondary" onClick={() => setInstitution(institution === "SEGi University" ? "Search for your university" : "SEGi University")} className="full">Change institution</Button>
          <div className="auth-divider"><span>First time here?</span></div>
          <label className="search-field"><Icon name="search" /><span className="sr-only">Search institution</span><input value={institution === "Search for your university" ? "" : ""} placeholder="Search by university name" onChange={(e) => e.target.value && setInstitution(e.target.value)} /></label>
          <div className="privacy-note"><Icon name="shield" /><div><strong>On a shared device?</strong><p>Do not save the institution or sign-in session on a public computer.</p></div></div>
        </div>
      </main>
    </div>
  );

  const renderLogin = () => (
    <div className="auth-shell">
      <section className="auth-brand-panel compact" aria-label="Spark secure sign in">
        <div className="brand-lockup"><span className="brand-mark">S</span><span>SPARK</span></div>
        <div className="auth-brand-copy"><p className="eyebrow light">CLEAR · ACCESSIBLE · SECURE</p><h1>One confident path<br />to your coursework.</h1><p>The recommended method is visible, help is nearby, and password managers are supported.</p></div>
        <div className="security-feature"><Icon name="shield" size={28} /><div><strong>Accessible authentication</strong><span>Paste, autofill and password managers are enabled.</span></div></div>
      </section>
      <main className="auth-main" id="main-content" ref={mainRef} tabIndex={-1}>
        <div className="mobile-brand"><span className="brand-mark">S</span><span>SPARK</span></div>
        <form className="auth-card" onSubmit={submitLogin}>
          <button className="back-link" type="button" onClick={goBack}><Icon name="arrow" /> Back</button>
          <p className="eyebrow">STUDENT PORTAL</p><h2>Sign in to Spark</h2><p className="muted">{institution}</p>
          <div className="recommended-method"><span>RECOMMENDED</span><strong>University single sign-on</strong><Icon name="shield" /></div>
          <label className="field-label">Student ID or university email<input value={studentId} onChange={(e) => setStudentId(e.target.value)} autoComplete="username" required /></label>
          <label className="field-label">Password<span className="password-wrap"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}><Icon name="eye" /></button></span></label>
          <Button type="submit" className="full">Sign in</Button>
          <div className="form-links"><button type="button">Forgot password?</button><button type="button">Need sign-in help?</button></div>
          <div className="privacy-note"><Icon name="shield" /><div><strong>Accessible authentication</strong><p>Password managers, copy and paste, and keyboard navigation are supported.</p></div></div>
        </form>
      </main>
    </div>
  );

  const renderHome = () => (
    <>
      <section className="welcome-row">
        <div><p className="eyebrow">STUDENT DASHBOARD · MAY–AUGUST 2026</p><h1>Good afternoon, Nadia</h1><p className="muted">Your academic progress, deadlines and campus day in one place.</p></div>
        <div className="semester-pill"><span>Current semester</span><strong>Week 8 of 14</strong><div><i style={{ width: "57%" }} /></div></div>
      </section>
      <section className="academic-kpis" aria-label="Academic summary">
        <button className="kpi-card teal-kpi" onClick={() => goPrimary("courses")}><span className="kpi-icon"><Icon name="book" /></span><span><small>ENROLLED COURSES</small><strong>5</strong><em>15 credit hours</em></span><Icon name="chevron" size={18} /></button>
        <button className="kpi-card blue-kpi" onClick={() => navigate("results")}><span className="kpi-icon"><Icon name="task" /></span><span><small>CURRENT CGPA</small><strong>3.52</strong><em className="positive">↑ 0.14 this semester</em></span><Icon name="chevron" size={18} /></button>
        <button className="kpi-card amber-kpi" onClick={() => goPrimary("tasks")}><span className="kpi-icon"><Icon name="clock" /></span><span><small>ASSIGNMENTS DUE</small><strong>3</strong><em>1 due today</em></span><Icon name="chevron" size={18} /></button>
        <button className="kpi-card green-kpi" onClick={() => navigate("attendance")}><span className="kpi-icon"><Icon name="check" /></span><span><small>ATTENDANCE</small><strong>89.8%</strong><em className="positive">Above 80% requirement</em></span><Icon name="chevron" size={18} /></button>
      </section>
      <section aria-labelledby="due-heading">
        <div className="section-heading"><div><p className="eyebrow">PRIORITISED FOR YOU</p><h2 id="due-heading">Due soon</h2></div><button className="text-action" onClick={() => goPrimary("tasks")}>View all tasks <Icon name="chevron" /></button></div>
        <div className="task-grid">{taskData.slice(0, 2).map((task) => <TaskCard key={task.title} task={task} onOpen={() => navigate(task.title.includes("UX") ? "assignment" : "tasks")} />)}</div>
      </section>
      <section className="portal-grid">
        <article className="portal-panel schedule-panel">
          <div className="section-heading compact"><div><p className="eyebrow">TUESDAY · 21 JULY</p><h2>Today’s schedule</h2></div><button className="text-action" onClick={() => navigate("schedule")}>Full timetable <Icon name="chevron" /></button></div>
          <div className="schedule-list">{todaySchedule.map((item) => <button key={item.time} onClick={() => navigate("schedule")}><span className="schedule-time"><strong>{item.time}</strong><small>{item.end}</small></span><span className="schedule-line" /><span className="schedule-copy"><small>{item.code} · {item.status}</small><strong>{item.title}</strong><em>{item.room}</em></span><Icon name="chevron" size={17} /></button>)}</div>
        </article>
        <article className="portal-panel attendance-panel">
          <div className="section-heading compact"><div><p className="eyebrow">LIVE OVERVIEW</p><h2>Attendance</h2></div><button className="text-action" onClick={() => navigate("attendance")}>Details <Icon name="chevron" /></button></div>
          <div className="attendance-hero"><div className="attendance-ring"><strong>89.8%</strong><span>Overall</span></div><div><strong>Safe standing</strong><p>You can miss a maximum of 2 remaining classes while staying above 80%.</p></div></div>
          <div className="mini-attendance">{academicCourses.slice(0, 3).map((course) => <div key={course.code}><span><strong>{course.code}</strong><small>{course.name}</small></span><b>{course.attendance}%</b><div><i style={{ width: `${course.attendance}%` }} /></div></div>)}</div>
        </article>
      </section>
      <section>
        <div className="section-heading"><div><p className="eyebrow">YOUR SEMESTER</p><h2>Course progress</h2></div><button className="text-action" onClick={() => goPrimary("courses")}>All courses <Icon name="chevron" /></button></div>
        <div className="course-progress-grid">{academicCourses.slice(0, 4).map((course) => <button key={course.code} onClick={() => goPrimary("courses")}><span className="course-code-chip">{course.code}</span><strong>{course.name}</strong><small>{course.lecturer}</small><div className="course-progress-meta"><span>{course.progress}% complete</span><b>{course.grade}</b></div><div className="course-progress-track"><i style={{ width: `${course.progress}%` }} /></div><em>{course.next}</em></button>)}</div>
      </section>
      <section className="portal-grid lower">
        <article className="portal-panel">
          <div className="section-heading compact"><div><p className="eyebrow">CAMPUS SERVICES</p><h2>Quick services</h2></div></div>
          <div className="service-grid">{serviceItems.map((item) => <button key={item.title} onClick={() => navigate(item.target)}><span className="quick-icon teal"><Icon name={item.icon} /></span><span><strong>{item.title}</strong><small>{item.detail}</small></span><Icon name="chevron" size={17} /></button>)}</div>
        </article>
        <article className="portal-panel notice-panel">
          <div className="section-heading compact"><div><p className="eyebrow">LATEST ANNOUNCEMENTS</p><h2>Campus updates</h2></div><StatusBadge tone="new">2 NEW</StatusBadge></div>
          <button className="notice-row" onClick={() => navigate("announcement")}><span className="quick-icon violet"><Icon name="bell" /></span><span><small>BIT2323 · 20 MIN AGO</small><strong>Part 4 prototype clarification</strong><em>Course announcement</em></span><Icon name="chevron" size={17} /></button>
          <button className="notice-row"><span className="quick-icon blue"><Icon name="calendar" /></span><span><small>STUDENT AFFAIRS · YESTERDAY</small><strong>Semester examination timetable released</strong><em>University notice</em></span><Icon name="chevron" size={17} /></button>
        </article>
      </section>
    </>
  );

  const renderTasks = () => {
    const filtered = taskData.filter((task) => `${task.title} ${task.course}`.toLowerCase().includes(search.toLowerCase()));
    return <>
      <div className="page-title"><div><p className="eyebrow">ORDERED BY URGENCY</p><h1>Tasks</h1><p className="muted">Assignments, quizzes and required actions in one place.</p></div><StatusBadge tone="urgent">2 due soon</StatusBadge></div>
      <div className="toolbar"><label className="search-field grow"><Icon name="search" /><span className="sr-only">Search assignments</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assignments" /></label><div className="filter-chips"><button>All</button><button className="active">Due soon</button><button>Submitted</button></div></div>
      <div className="list-stack">{filtered.map((task) => <TaskCard key={task.title} task={task} onOpen={() => task.title.includes("UX") && navigate("assignment")} />)}</div>
      <button className="disclosure-row">Show completed tasks <Icon name="chevron" /></button>
    </>;
  };

  const renderCourses = () => (
    <><div className="page-title"><div><p className="eyebrow">MAY-AUGUST 2026</p><h1>Courses</h1><p className="muted">Open a course by its familiar name, then access materials and tasks.</p></div></div>
    <label className="search-field page-search"><Icon name="search" /><span className="sr-only">Search courses</span><input placeholder="Search by course name" /></label>
    <div className="course-grid">{courses.map((course) => <button className="course-card" key={course.code} onClick={() => course.code === "BIT2323" && navigate("course")}><span className={`course-emblem ${course.tone}`}>{course.code.slice(-2)}</span><span><small>{course.code}</small><strong>{course.name}</strong><em>{course.detail}</em></span><Icon name="chevron" /></button>)}</div>
    <section className="recent-section"><div className="section-heading compact"><h2>Recent materials</h2></div><button className="material-row" onClick={() => navigate("course")}><span className="file-icon"><Icon name="file" /></span><span><strong>Week 8 - Prototyping guide.pdf</strong><small>BIT2323 · Opened yesterday</small></span><Icon name="chevron" /></button></section></>
  );

  const renderCourse = () => (
    <><button className="back-link content-back" onClick={goBack}><Icon name="arrow" /> Courses</button>
      <section className="course-hero"><div className="course-emblem teal large">23</div><div><p className="eyebrow">BIT2323</p><h1>User Experience Design</h1><p>Semester May-August 2026 · Lecturer workspace</p></div></section>
      <div className="course-tabs"><button className="active">Overview</button><button>Materials</button><button onClick={() => goPrimary("tasks")}>Tasks</button><button>People</button></div>
      <div className="course-layout"><section className="course-panel"><div className="section-heading compact"><h2>Current module</h2><StatusBadge tone="new">Week 8</StatusBadge></div><h3>Interactive prototyping</h3><p>Convert approved wireframes into a functional prototype and demonstrate the redesigned task journey.</p><div className="module-items"><button><Icon name="file" /><span><strong>Prototyping guide.pdf</strong><small>2.4 MB · PDF</small></span><Icon name="download" /></button><button><Icon name="file" /><span><strong>Accessibility checklist.docx</strong><small>840 KB · DOCX</small></span><Icon name="download" /></button></div></section>
      <aside className="related-task"><p className="eyebrow">RELATED TASK</p><h3>UX Assignment - Part 4</h3><p>Due today, 11:59 PM</p><Button onClick={() => navigate("assignment")} className="full">Open assignment</Button></aside></div>
    </>
  );

  const renderInbox = () => (
    <><div className="page-title"><div><p className="eyebrow">ACADEMIC UPDATES</p><h1>Inbox</h1><p className="muted">Messages remain linked to the course or task they affect.</p></div><StatusBadge tone="new">1 unread</StatusBadge></div>
      <div className="inbox-list"><button className="message-row unread" onClick={() => navigate("announcement")}><span className="message-avatar">UX</span><span className="message-copy"><small>BIT2323 · Lecturer</small><strong>Part 4 prototype clarification</strong><p>Your prototype should demonstrate navigation, accessibility and improved user experience.</p></span><span className="message-time">20 min</span></button><button className="message-row"><span className="message-avatar blue">DB</span><span className="message-copy"><small>BIT2124 · Lecturer</small><strong>Quiz opens tomorrow</strong><p>Review the SQL implementation materials before 9:00 AM.</p></span><span className="message-time">Yesterday</span></button></div>
    </>
  );

  const renderAnnouncement = () => (
    <><button className="back-link content-back" onClick={goBack}><Icon name="arrow" /> Inbox</button>
    <article className="announcement-card"><div className="announcement-meta"><span className="message-avatar">UX</span><div><p className="eyebrow">BIT2323 · USER EXPERIENCE DESIGN</p><span>Posted today, 2:15 PM · Lecturer</span></div></div><h1>Part 4 prototype clarification</h1><p>Your interactive prototype should demonstrate the redesigned interface, clear navigation between screens, accessibility considerations and a visibly improved user experience compared with the original system.</p><p>Ensure the critical assignment-submission workflow can be completed from beginning to confirmation.</p>
    <div className="linked-task"><div><p className="eyebrow">RELATED TASK</p><h3>UX Assignment - Part 4</h3><p>Due today, 11:59 PM</p></div><Button onClick={() => navigate("assignment")}>Open assignment</Button></div>
    <Button variant="secondary" icon="bell">Save announcement</Button></article></>
  );

  const renderAssignment = () => (
    <><button className="back-link content-back" onClick={goBack}><Icon name="arrow" /> Back</button>
    <div className="assignment-layout"><article className="assignment-main"><p className="eyebrow">BIT2323 · USER EXPERIENCE DESIGN</p><h1>UX Assignment - Part 4: Interactive Prototype</h1><p className="lead">Create a functional interactive prototype of the redesigned Spark experience by applying user-centred design principles.</p>
    <div className="assignment-facts"><div><span><Icon name="calendar" /> DUE</span><strong>Today, 11:59 PM</strong></div><div><span><Icon name="task" /> STATUS</span><strong>Not submitted</strong></div><div><span><Icon name="file" /> ATTEMPTS</span><strong>1 of 3</strong></div></div>
    <section><h2>What to submit</h2><p>A clickable prototype and a Part 4 report showing navigation, UX principles, accessibility and the improved user journey.</p></section>
    <section><h2>File requirements</h2><div className="requirement-pills"><span><Icon name="file" /> PDF or DOCX</span><span>Maximum 20 MB</span><span>One report required</span></div></section>
    <div className="policy-note"><Icon name="shield" /><div><strong>Submission policy</strong><p>Resubmission is allowed until the deadline. Previous versions remain recorded.</p></div></div></article>
    <aside className="submission-aside"><StatusBadge tone="urgent">Due today</StatusBadge><h2>Ready to submit?</h2><p>We will guide you through upload, review and final confirmation.</p><ul><li><Icon name="check" /> Automatic file validation</li><li><Icon name="check" /> Review before final action</li><li><Icon name="check" /> Persistent receipt</li></ul><Button onClick={() => navigate("upload")} className="full">Start submission</Button></aside></div></>
  );

  const renderUpload = () => (
    <><button className="back-link content-back" onClick={goBack}><Icon name="arrow" /> Assignment</button><Stepper step={1} />
    <div className="submission-container"><div className="submission-heading"><div><p className="eyebrow">STEP 1 OF 3</p><h1>Choose your file</h1><p>Accepted formats: PDF or DOCX · Maximum 20 MB</p></div><StatusBadge tone={uploadState === "valid" ? "success" : uploadState === "error" ? "urgent" : "neutral"}>{uploadState === "valid" ? "Validated" : uploadState === "uploading" ? "Uploading" : uploadState === "error" ? "Needs attention" : "No file selected"}</StatusBadge></div>
    {uploadState === "idle" && <div className="upload-zone"><span className="upload-icon"><Icon name="upload" size={30} /></span><h2>Select from device or cloud storage</h2><p>Your progress is saved automatically.</p><label className="button primary file-button"><input type="file" accept=".pdf,.docx" onChange={selectFile} />Browse files</label><button className="demo-link" onClick={() => startValidUpload("ui_part_4_prototype_report.pdf", "11.7 MB")}>Use demo PDF</button><button className="demo-link error-link" onClick={showErrorExample}>Try upload-error example</button></div>}
    {uploadState === "uploading" && <div className="upload-progress-card"><div className="file-summary"><span className="file-icon"><Icon name="file" /></span><div><strong>{fileName}</strong><small>{fileSize} · Uploading securely</small></div><span>{progress}%</span></div><div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div><div className="connection-note"><Icon name="shield" /><p><strong>Connection protected</strong><br />If your connection changes, upload pauses and resumes automatically.</p></div><Button variant="secondary" onClick={() => { setUploadState("idle"); setProgress(0); }}>Cancel upload</Button></div>}
    {uploadState === "error" && <div className="upload-error-card"><div className="error-heading"><span><Icon name="warning" /></span><div><p className="eyebrow">FILE NOT ACCEPTED</p><h2>Upload needs attention</h2></div></div><p>The selected <strong>.pages</strong> file is not supported. Export it as PDF or DOCX, then choose the new file.</p><div className="failed-file"><Icon name="file" /><span><strong>{fileName}</strong><small>{fileSize} · Not uploaded</small></span><button onClick={() => setUploadState("idle")}>Remove</button></div><div className="preserved-note"><Icon name="check" /><span><strong>Your progress is preserved.</strong> The assignment page and current step remain saved.</span></div><label className="button primary file-button"><input type="file" accept=".pdf,.docx" onChange={selectFile} />Choose another file</label><Button variant="secondary" onClick={() => startValidUpload("ui_part_4_prototype_report.pdf", "11.7 MB")}>Use demo PDF instead</Button></div>}
    {uploadState === "valid" && <div className="upload-valid-card"><div className="success-seal"><Icon name="check" size={30} /></div><div><p className="eyebrow">UPLOAD COMPLETE</p><h2>Your file passed validation</h2><p>File type, size and upload completeness were checked successfully.</p></div><div className="valid-file"><span className="file-icon"><Icon name="file" /></span><span><strong>{fileName}</strong><small>{fileSize} · PDF · Ready to review</small></span><StatusBadge tone="success">Valid</StatusBadge></div><div className="validation-list"><span><Icon name="check" /> File type accepted</span><span><Icon name="check" /> Under 20 MB</span><span><Icon name="check" /> Upload complete</span></div><Button onClick={() => navigate("review")} className="full">Continue to review</Button><Button variant="secondary" onClick={() => setUploadState("idle")} className="full">Replace file</Button></div>}
    </div></>
  );

  const renderReview = () => (
    <><button className="back-link content-back" onClick={goBack}><Icon name="arrow" /> Upload</button><Stepper step={2} />
    <div className="submission-container"><div className="submission-heading"><div><p className="eyebrow">STEP 2 OF 3</p><h1>Check before submitting</h1><p>Confirm the file and policy while every action is still reversible.</p></div></div>
    <div className="review-file"><div className="review-preview"><Icon name="file" size={40} /><span>PDF</span></div><div className="review-file-copy"><strong>{fileName || "ui_part_4_prototype_report.pdf"}</strong><small>{fileSize || "11.7 MB"} · Upload complete</small><div><button><Icon name="eye" /> Preview</button><button onClick={() => { setUploadState("idle"); goBack(); }}>Replace</button><button onClick={() => { setUploadState("idle"); goBack(); }}>Remove</button></div></div><StatusBadge tone="success">Validated</StatusBadge></div>
    <div className="review-summary"><h2>Submission summary</h2><dl><div><dt>Assignment</dt><dd>UX Assignment - Part 4</dd></div><div><dt>Deadline</dt><dd>Today, 11:59 PM</dd></div><div><dt>Resubmission</dt><dd>Allowed until deadline</dd></div></dl></div>
    <label className="confirmation-check"><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} /><span><strong>I confirm this is the correct file.</strong><small>I have reviewed the filename and understand it will be used for this assignment.</small></span></label>
    <div className="button-row"><Button onClick={() => navigate("confirm")} disabled={!confirmed}>Continue to final check</Button><Button variant="secondary" onClick={() => setLiveMessage("Submission saved as a draft.")}>Save as draft</Button></div></div></>
  );

  const renderConfirm = () => (
    <><button className="back-link content-back" onClick={goBack}><Icon name="arrow" /> Review</button><Stepper step={3} />
    <div className="submission-container narrow"><div className="final-icon"><Icon name="shield" size={34} /></div><p className="eyebrow center">STEP 3 OF 3</p><h1 className="center">Ready to submit?</h1><p className="center lead-small">Submitting records your file and timestamp. A receipt will remain available in submission history.</p>
    <div className="final-summary"><div><span>ASSIGNMENT</span><strong>UX Assignment - Part 4</strong></div><div><span>FILE</span><strong>{fileName || "ui_part_4_prototype_report.pdf"}</strong></div><div><span>STATUS AFTER ACTION</span><StatusBadge tone="success">Submitted</StatusBadge></div></div>
    <div className="final-warning"><Icon name="clock" /><p><strong>Due today at 11:59 PM</strong><br />Resubmission remains available until the deadline.</p></div><Button onClick={finishSubmission} className="full">Submit now</Button><Button variant="secondary" onClick={goBack} className="full">Back to review</Button></div></>
  );

  const renderSuccess = () => (
    <div className="success-page"><div className="success-rings"><span><Icon name="check" size={46} /></span></div><StatusBadge tone="success">SUBMITTED ON TIME</StatusBadge><h1>Submitted successfully</h1><p className="lead-small">Your assignment and timestamp have been recorded.</p><p className="success-time">{submittedAt}</p>
    <div className="receipt-panel"><div><span>SUBMISSION REFERENCE</span><strong>SPK-BIT2323-3A7F92</strong></div><div><span>FILE</span><strong>{fileName || "ui_part_4_prototype_report.pdf"}</strong></div></div>
    <div className="success-actions"><Button icon="download" onClick={downloadReceipt}>Download receipt</Button><Button variant="secondary" icon="eye" onClick={() => navigate("record")}>View submission record</Button><Button variant="quiet" onClick={() => goPrimary("tasks")}>Return to tasks</Button></div><p className="secure-copy"><Icon name="shield" size={17} /> This receipt remains available in your assignment history.</p></div>
  );

  const renderRecord = () => (
    <><button className="back-link content-back" onClick={goBack}><Icon name="arrow" /> Submission complete</button><div className="record-header"><div><p className="eyebrow">BIT2323 · USER EXPERIENCE DESIGN</p><h1>UX Assignment - Part 4</h1><p>Submission record and version history</p></div><StatusBadge tone="success"><Icon name="check" size={15} /> Submitted on time</StatusBadge></div>
    <div className="record-layout"><section className="timeline-card"><h2>Submission timeline</h2><ol className="timeline"><li><span><Icon name="upload" /></span><div><strong>File uploaded</strong><small>Today, 10:39 PM</small></div></li><li><span><Icon name="check" /></span><div><strong>Final submission recorded</strong><small>{submittedAt}</small></div></li><li><span><Icon name="file" /></span><div><strong>Receipt generated</strong><small>Reference SPK-BIT2323-3A7F92</small></div></li></ol></section>
    <aside className="record-actions"><h2>Version 1</h2><p>{fileName || "ui_part_4_prototype_report.pdf"}</p><StatusBadge tone="success">Current version</StatusBadge><Button icon="download" onClick={downloadReceipt} className="full">Download receipt</Button><Button variant="secondary" icon="download" className="full">Download submitted file</Button><Button variant="secondary" onClick={() => { setUploadState("idle"); navigate("upload"); }} className="full">Submit a new version</Button><small>Available until today, 11:59 PM. Previous versions remain recorded.</small></aside></div></>
  );

  const renderAttendance = () => (
    <><button className="back-link content-back" onClick={goBack}><Icon name="arrow" /> Dashboard</button>
    <div className="page-title"><div><p className="eyebrow">MAY–AUGUST 2026</p><h1>Attendance</h1><p className="muted">Track every course against the university’s 80% attendance requirement.</p></div><StatusBadge tone="success">Overall 89.8%</StatusBadge></div>
    <section className="detail-summary"><div><span>Classes attended</span><strong>79 / 88</strong><small>9 approved or missed sessions</small></div><div><span>Current standing</span><strong>Good</strong><small>All courses above requirement</small></div><div><span>Last recorded</span><strong>Today · 11:54 AM</strong><small>BIT2323 UX Design Studio</small></div></section>
    <section className="data-panel"><div className="section-heading compact"><h2>Attendance by course</h2><button className="button secondary">Download report</button></div><div className="course-table">{academicCourses.map((course) => <div key={course.code}><span className="course-code-chip">{course.code}</span><span><strong>{course.name}</strong><small>{course.lecturer}</small></span><span className="table-progress"><div><i style={{ width: `${course.attendance}%` }} /></div><small>{course.attendance >= 90 ? "Excellent" : course.attendance >= 85 ? "Good" : "Monitor"}</small></span><b>{course.attendance}%</b></div>)}</div></section></>
  );

  const renderResults = () => (
    <><button className="back-link content-back" onClick={goBack}><Icon name="arrow" /> Dashboard</button>
    <div className="page-title"><div><p className="eyebrow">ACADEMIC PERFORMANCE</p><h1>Results & CGPA</h1><p className="muted">Your current performance, completed credits and grade trend.</p></div><Button variant="secondary" icon="download">Unofficial transcript</Button></div>
    <section className="result-hero"><div><span>Cumulative GPA</span><strong>3.52</strong><small>Dean’s List standing</small></div><div><span>Semester GPA</span><strong>3.66</strong><small>↑ 0.14 from last semester</small></div><div><span>Credits</span><strong>93 / 120</strong><small>77.5% degree completion</small></div><div className="grade-bars"><i style={{ height: "52%" }} /><i style={{ height: "61%" }} /><i style={{ height: "68%" }} /><i style={{ height: "74%" }} /><i className="current" style={{ height: "84%" }} /><span>CGPA trend</span></div></section>
    <section className="data-panel"><div className="section-heading compact"><h2>Current semester</h2><StatusBadge tone="neutral">Results in progress</StatusBadge></div><div className="result-table">{academicCourses.map((course) => <div key={course.code}><span className="course-code-chip">{course.code}</span><span><strong>{course.name}</strong><small>3 credit hours</small></span><span><small>Coursework</small><strong>{course.progress + 12}%</strong></span><b>{course.grade}</b></div>)}</div></section></>
  );

  const renderSchedule = () => (
    <><button className="back-link content-back" onClick={goBack}><Icon name="arrow" /> Dashboard</button>
    <div className="page-title"><div><p className="eyebrow">WEEK 8 · 20–24 JULY</p><h1>Class schedule</h1><p className="muted">Your classes, locations and academic appointments.</p></div><div className="filter-chips"><button>‹</button><button className="active">This week</button><button>›</button></div></div>
    <section className="week-calendar">{["Monday 20", "Tuesday 21", "Wednesday 22", "Thursday 23", "Friday 24"].map((day, index) => <article key={day} className={index === 1 ? "today" : ""}><header><small>{day.split(" ")[0]}</small><strong>{day.split(" ")[1]}</strong>{index === 1 && <em>Today</em>}</header><div>{index === 0 && <><span><b>11:00</b><strong>Software Testing Lab</strong><small>BIT2133 · Lab 4</small></span><span><b>15:00</b><strong>Project Meeting</strong><small>Online · Teams</small></span></>}{index === 1 && todaySchedule.map((item) => <span key={item.time}><b>{item.time}</b><strong>{item.title}</strong><small>{item.room}</small></span>)}{index === 2 && <span><b>10:00</b><strong>UX Design Studio</strong><small>BIT2323 · Lab 6</small></span>}{index === 3 && <><span><b>09:00</b><strong>Database Lecture</strong><small>BIT2124 · Hall 3</small></span><span><b>14:00</b><strong>Database Lab</strong><small>BIT2124 · Lab 2</small></span></>}{index === 4 && <><span><b>09:00</b><strong>Artificial Intelligence</strong><small>BIT2213 · Hall 5</small></span><span><b>15:00</b><strong>Project Management</strong><small>BIT2113 · Room 2.12</small></span></>}</div></article>)}</section></>
  );

  const renderServices = () => (
    <><button className="back-link content-back" onClick={goBack}><Icon name="arrow" /> Dashboard</button>
    <div className="page-title"><div><p className="eyebrow">STUDENT HUB</p><h1>Student services</h1><p className="muted">Common requests, records and support without searching across separate systems.</p></div></div>
    <section className="service-catalog">{[
      ["Fees & payments", "Outstanding balance: RM 0.00", "check"],
      ["Official letters", "Request enrolment or confirmation letters", "file"],
      ["Academic forms", "Add/drop, deferment and appeal forms", "task"],
      ["Examinations", "Timetable, regulations and results", "calendar"],
      ["Library account", "3 items borrowed · None overdue", "book"],
      ["IT help desk", "Report Spark or university account issues", "help"],
    ].map(([title, detail, icon]) => <button key={title}><span className="quick-icon teal"><Icon name={icon as IconName} /></span><span><strong>{title}</strong><small>{detail}</small></span><Icon name="chevron" /></button>)}</section>
    <article className="support-banner"><span className="quick-icon teal"><Icon name="help" /></span><div><p className="eyebrow">NEED HUMAN SUPPORT?</p><h2>Student Services Centre</h2><p>Monday–Friday, 8:30 AM–5:30 PM · Ground Floor, Student Hub</p></div><Button>Start support request</Button></article></>
  );

  const renderScreen = () => {
    switch (screen) {
      case "home": return renderHome();
      case "tasks": return renderTasks();
      case "courses": return renderCourses();
      case "course": return renderCourse();
      case "inbox": return renderInbox();
      case "announcement": return renderAnnouncement();
      case "assignment": return renderAssignment();
      case "upload": return renderUpload();
      case "review": return renderReview();
      case "confirm": return renderConfirm();
      case "success": return renderSuccess();
      case "record": return renderRecord();
      case "attendance": return renderAttendance();
      case "results": return renderResults();
      case "schedule": return renderSchedule();
      case "services": return renderServices();
      default: return renderHome();
    }
  };

  if (screen === "institution") return renderInstitution();
  if (screen === "login") return renderLogin();

  const navItems: { id: "home" | "courses" | "tasks" | "inbox"; label: string; icon: IconName }[] = [
    { id: "home", label: "Home", icon: "home" }, { id: "courses", label: "Courses", icon: "book" }, { id: "tasks", label: "Tasks", icon: "task" }, { id: "inbox", label: "Inbox", icon: "inbox" },
  ];

  return (
    <div className={`app-shell ${largeText ? "large-text" : ""}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <aside className="side-nav">
        <div className="brand-lockup dark"><span className="brand-mark">S</span><span>SPARK</span></div>
        <nav aria-label="Primary navigation">{navItems.map((item) => <button key={item.id} className={activeNav === item.id ? "active" : ""} onClick={() => goPrimary(item.id)} aria-current={activeNav === item.id ? "page" : undefined}><Icon name={item.icon} /><span>{item.label}</span>{item.id === "inbox" && <em>1</em>}</button>)}</nav>
        <div className="side-support"><Icon name="help" /><strong>Need help?</strong><p>Find support without leaving your current task.</p><button>Open help centre</button></div>
        <div className="side-profile"><span>NR</span><div><strong>Nadia Rahman</strong><small>Student</small></div><Icon name="chevron" size={17} /></div>
      </aside>
      <div className="app-content">
        <header className="top-bar">
          <div className="mobile-brand"><span className="brand-mark">S</span><span>SPARK</span></div>
          <label className="global-search"><Icon name="search" /><span className="sr-only">Global search</span><input placeholder="Search courses, tasks or announcements" /></label>
          <div className="top-actions"><button onClick={() => setAccessOpen((v) => !v)} aria-expanded={accessOpen} className={accessOpen ? "active" : ""}><span className="aa-icon">Aa</span><span className="sr-only">Accessibility settings</span></button><button className="notification-button"><Icon name="bell" /><span className="notification-dot" /><span className="sr-only">Notifications, one unread</span></button><button className="avatar-button"><span>NR</span><span className="sr-only">Open profile</span></button></div>
          {accessOpen && <section className="access-panel" aria-label="Accessibility settings"><div><span className="quick-icon teal"><span className="aa-icon">Aa</span></span><div><strong>Reading size</strong><small>Increase interface text while preserving layout.</small></div></div><button role="switch" aria-checked={largeText} onClick={() => setLargeText((v) => !v)} className={largeText ? "switch on" : "switch"}><span /></button><p><Icon name="check" size={16} /> Visible focus indicators</p><p><Icon name="check" size={16} /> Status never relies on colour alone</p></section>}
        </header>
        <main id="main-content" ref={mainRef} tabIndex={-1} className="main-content" aria-label={screenTitles[screen]}>{renderScreen()}</main>
        <nav className="bottom-nav" aria-label="Mobile primary navigation">{navItems.map((item) => <button key={item.id} className={activeNav === item.id ? "active" : ""} onClick={() => goPrimary(item.id)} aria-current={activeNav === item.id ? "page" : undefined}><Icon name={item.icon} /><span>{item.label}</span>{item.id === "inbox" && <em>1</em>}</button>)}</nav>
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">{liveMessage}</div>
    </div>
  );
}
